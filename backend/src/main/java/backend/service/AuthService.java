package backend.service;


import backend.dto.LoginResponseDTO;
import backend.util.JwtUtil;

import backend.dto.LoginRequestDTO;
import backend.dto.UserRequestDTO;
import backend.entity.User;
import backend.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public LoginResponseDTO login(
        LoginRequestDTO dto) {

    String email = dto.getEmail().trim();
    User user = userRepository
            .findByEmail(email)
            .orElseThrow(() ->
                    new RuntimeException(
                            "User not found"));

    boolean matches =
            passwordEncoder.matches(
                    dto.getPassword(),
                    user.getPassword());

    if (!matches) {

        throw new RuntimeException(
                "Invalid password");
    }

    String role = "admin@gmail.com".equalsIgnoreCase(email)
            ? "ADMIN"
            : user.getRole() == null ? "CITIZEN" : user.getRole().trim().toUpperCase();

    if ("admin@gmail.com".equalsIgnoreCase(email) && !"ADMIN".equals(user.getRole())) {
        user.setRole("ADMIN");
        userRepository.save(user);
    }

    String token =
            JwtUtil.generateToken(
                    user.getEmail());

    return new LoginResponseDTO(
            token,
            user.getName(),
            role);
}

        public void registerCitizen(UserRequestDTO dto) {
                if (userRepository.findByEmail(dto.getEmail()).isPresent()) {
                        throw new RuntimeException("An account with this email already exists");
                }

                User user = new User();
                user.setName(dto.getName());
                user.setEmail(dto.getEmail());
                user.setPhone(dto.getPhone());
                user.setPassword(passwordEncoder.encode(dto.getPassword()));
                user.setRole("CITIZEN");
                userRepository.save(user);
        }
}