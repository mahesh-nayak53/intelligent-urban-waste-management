package backend.service;

import backend.dto.OtpRequestDTO;
import backend.dto.OtpVerifyDTO;
import backend.entity.PasswordResetOtp;
import backend.entity.Staff;
import backend.entity.User;
import backend.repository.PasswordResetOtpRepository;
import backend.repository.StaffRepository;
import backend.repository.UserRepository;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.Locale;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestClient;

@Service
public class PasswordResetService {
    private static final int OTP_EXPIRY_MINUTES = 10;
    private static final int MAX_ATTEMPTS = 5;
    private final SecureRandom random = new SecureRandom();
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final StaffRepository staffRepository;
    private final PasswordResetOtpRepository otpRepository;
    private final JavaMailSender mailSender;
    private final RestClient restClient = RestClient.builder().build();

    @Value("${spring.mail.host:}")
    private String mailHost;
    @Value("${spring.mail.username:}")
    private String mailUsername;
    @Value("${app.sms.twilio.account-sid:}")
    private String twilioAccountSid;
    @Value("${app.sms.twilio.auth-token:}")
    private String twilioAuthToken;
    @Value("${app.sms.twilio.from-number:}")
    private String twilioFromNumber;

    public PasswordResetService(PasswordEncoder passwordEncoder, UserRepository userRepository,
            StaffRepository staffRepository, PasswordResetOtpRepository otpRepository,
            JavaMailSender mailSender) {
        this.passwordEncoder = passwordEncoder;
        this.userRepository = userRepository;
        this.staffRepository = staffRepository;
        this.otpRepository = otpRepository;
        this.mailSender = mailSender;
    }

    @Transactional
    public void requestOtp(OtpRequestDTO request) {
        String email = request.getEmail().trim().toLowerCase(Locale.ROOT);
        User user = findOrProvisionStaff(email);
        String method = request.getMethod().trim().toUpperCase(Locale.ROOT);
        if (!"EMAIL".equals(method) && !"SMS".equals(method)) {
            throw new IllegalArgumentException("Delivery method must be EMAIL or SMS");
        }
        String destination = "EMAIL".equals(method) ? email : phoneFor(user);
        String code = String.format("%06d", random.nextInt(1_000_000));
        otpRepository.findTopByEmailAndUsedFalseOrderByIdDesc(email).ifPresent(previous -> previous.setUsed(true));
        PasswordResetOtp otp = new PasswordResetOtp();
        otp.setEmail(email);
        otp.setCodeHash(hash(code));
        otp.setDeliveryMethod(method);
        otp.setExpiresAt(LocalDateTime.now().plusMinutes(OTP_EXPIRY_MINUTES));
        otpRepository.save(otp);
        deliver(method, destination, code);
    }

    @Transactional
    public void resetPassword(OtpVerifyDTO request) {
        String email = request.getEmail().trim().toLowerCase(Locale.ROOT);
        PasswordResetOtp otp = otpRepository.findTopByEmailAndUsedFalseOrderByIdDesc(email)
                .orElseThrow(() -> new IllegalArgumentException("Request a new OTP"));
        if (otp.getExpiresAt().isBefore(LocalDateTime.now()) || otp.getAttempts() >= MAX_ATTEMPTS) {
            throw new IllegalArgumentException("OTP expired. Request a new OTP");
        }
        otp.setAttempts(otp.getAttempts() + 1);
        if (!MessageDigest.isEqual(otp.getCodeHash().getBytes(StandardCharsets.UTF_8), hash(request.getOtp()).getBytes(StandardCharsets.UTF_8))) {
            otpRepository.save(otp);
            throw new IllegalArgumentException("Invalid OTP");
        }
        if (request.getNewPassword().length() < 6) throw new IllegalArgumentException("Password must be at least 6 characters");
        User user = userRepository.findByEmail(email).orElseThrow(() -> new IllegalArgumentException("Account not found"));
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
        otp.setUsed(true);
        otpRepository.save(otp);
    }

    private User findOrProvisionStaff(String email) {
        return userRepository.findByEmail(email).orElseGet(() -> {
            Staff staff = staffRepository.findByEmail(email).orElseThrow(() -> new IllegalArgumentException("No account found for this email"));
            User user = new User();
            user.setName(staff.getName());
            user.setEmail(staff.getEmail());
            user.setPhone(staff.getPhone());
            user.setPassword(passwordEncoder.encode(UUID.randomUUID().toString()));
            user.setRole("STAFF");
            return userRepository.save(user);
        });
    }

    private String phoneFor(User user) {
        if (user.getPhone() == null || user.getPhone().isBlank()) throw new IllegalArgumentException("No phone number is registered for this account");
        return user.getPhone();
    }

    private void deliver(String method, String destination, String code) {
        if ("EMAIL".equals(method)) {
            if (mailHost.isBlank() || mailUsername.isBlank()) throw new IllegalStateException("Email OTP is not configured");
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(destination);
            message.setSubject("CleanCity password reset OTP");
            message.setText("Your CleanCity password reset OTP is " + code + ". It expires in 10 minutes.");
            mailSender.send(message);
            return;
        }
        if (twilioAccountSid.isBlank() || twilioAuthToken.isBlank() || twilioFromNumber.isBlank()) throw new IllegalStateException("SMS OTP is not configured");
        restClient.post().uri("https://api.twilio.com/2010-04-01/Accounts/{sid}/Messages.json", twilioAccountSid)
            .headers(headers -> {
                headers.setBasicAuth(twilioAccountSid, twilioAuthToken);
                headers.setContentType(org.springframework.http.MediaType.APPLICATION_FORM_URLENCODED);
            })
                .body("To=" + encode(destination) + "&From=" + encode(twilioFromNumber) + "&Body=" + encode("Your CleanCity password reset OTP is " + code + ". It expires in 10 minutes."))
                .retrieve().toBodilessEntity();
    }

    private String encode(String value) { return java.net.URLEncoder.encode(value, StandardCharsets.UTF_8); }
    private String hash(String value) {
        try {
            return Base64.getEncoder().encodeToString(MessageDigest.getInstance("SHA-256").digest(value.getBytes(StandardCharsets.UTF_8)));
        } catch (java.security.NoSuchAlgorithmException exception) {
            throw new IllegalStateException("Unable to create OTP", exception);
        }
    }
}
