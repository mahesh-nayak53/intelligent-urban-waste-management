package backend.dto;

public class LoginResponseDTO {

    private String token;
    private String name;
    private String role;

    public LoginResponseDTO() {
    }

    public LoginResponseDTO(
            String token,
            String name,
            String role) {

        this.token = token;
        this.name = name;
        this.role = role;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}