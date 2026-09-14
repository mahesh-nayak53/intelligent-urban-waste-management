package backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class OtpRequestDTO {
    @NotBlank @Email
    private String email;
    @NotBlank
    private String method;
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getMethod() { return method; }
    public void setMethod(String method) { this.method = method; }
}
