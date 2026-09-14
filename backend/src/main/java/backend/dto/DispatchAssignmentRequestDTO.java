package backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class DispatchAssignmentRequestDTO {

    @NotNull(message = "Complaint ID is required")
    @Positive(message = "Complaint ID must be positive")
    private Long complaintId;

    @NotNull(message = "Staff ID is required")
    @Positive(message = "Staff ID must be positive")
    private Long staffId;

    @NotBlank(message = "Assignment type is required")
    private String type;

    private String priority;
    private String zone;

    public Long getComplaintId() {
        return complaintId;
    }

    public void setComplaintId(Long complaintId) {
        this.complaintId = complaintId;
    }

    public Long getStaffId() {
        return staffId;
    }

    public void setStaffId(Long staffId) {
        this.staffId = staffId;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public String getZone() {
        return zone;
    }

    public void setZone(String zone) {
        this.zone = zone;
    }
}
