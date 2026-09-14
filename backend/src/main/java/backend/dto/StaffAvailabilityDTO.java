package backend.dto;

import jakarta.validation.constraints.NotNull;

public class StaffAvailabilityDTO {
    @NotNull(message = "Availability is required")
    private Boolean available;

    public Boolean getAvailable() { return available; }
    public void setAvailable(Boolean available) { this.available = available; }
}
