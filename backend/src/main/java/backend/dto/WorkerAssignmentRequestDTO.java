package backend.dto;

import jakarta.validation.constraints.NotNull;

public class WorkerAssignmentRequestDTO {

    @NotNull(message = "Complaint id is required")
    private Long complaintId;

    @NotNull(message = "Staff id is required")
    private Long staffId;

    @NotNull(message = "Worker id is required")
    private Long workerId;

    private String priority = "MEDIUM";
    private String notes;
    private String status; 

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

    public Long getWorkerId() {
        return workerId;
    }

    public void setWorkerId(Long workerId) {
        this.workerId = workerId;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
