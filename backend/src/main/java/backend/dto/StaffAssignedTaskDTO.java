package backend.dto;

import java.time.LocalDateTime;

public class StaffAssignedTaskDTO {
    private Long id;
    private Long complaintId;
    private String status;
    private LocalDateTime assignedAt;
    private LocalDateTime completedAt;

    public StaffAssignedTaskDTO(Long id, Long complaintId, String status, LocalDateTime assignedAt, LocalDateTime completedAt) {
        this.id = id; this.complaintId = complaintId; this.status = status; this.assignedAt = assignedAt; this.completedAt = completedAt;
    }
    public Long getId() { return id; }
    public Long getComplaintId() { return complaintId; }
    public String getStatus() { return status; }
    public LocalDateTime getAssignedAt() { return assignedAt; }
    public LocalDateTime getCompletedAt() { return completedAt; }
}
