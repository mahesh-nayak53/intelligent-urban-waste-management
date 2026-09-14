package backend.controller;

import backend.dto.LoginResponseDTO;
import backend.dto.LoginRequestDTO;
import backend.dto.UserRequestDTO;
import backend.dto.OtpRequestDTO;
import backend.dto.OtpVerifyDTO;
import backend.service.PasswordResetService;
import jakarta.validation.Valid;
import backend.service.AuthService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final PasswordResetService passwordResetService;

    public AuthController(
            AuthService authService, PasswordResetService passwordResetService) {

        this.authService = authService;
        this.passwordResetService = passwordResetService;
    }

    @PostMapping("/login")
   public LoginResponseDTO login(
        @RequestBody LoginRequestDTO dto) {

        return authService.login(dto);
    }

    @PostMapping("/register")
    public void registerCitizen(@RequestBody UserRequestDTO dto) {
        authService.registerCitizen(dto);
    }

    @PostMapping("/password/otp")
    public void requestPasswordOtp(@Valid @RequestBody OtpRequestDTO dto) {
        passwordResetService.requestOtp(dto);
    }

    @PostMapping("/password/reset")
    public void resetPassword(@Valid @RequestBody OtpVerifyDTO dto) {
        passwordResetService.resetPassword(dto);
    }
}