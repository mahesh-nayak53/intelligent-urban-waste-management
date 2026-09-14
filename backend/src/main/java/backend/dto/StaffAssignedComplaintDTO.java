package backend.dto;

import java.time.LocalDateTime;

public class StaffAssignedComplaintDTO {
    private Long id;
    private String title;
    private String priority;
    private String status;
    private LocalDateTime createdAt;

    public StaffAssignedComplaintDTO(Long id, String title, String priority, String status, LocalDateTime createdAt) {
        this.id = id; this.title = title; this.priority = priority; this.status = status; this.createdAt = createdAt;
    }
    public Long getId() { return id; }
    public String getTitle() { return title; }
    public String getPriority() { return priority; }
    public String getStatus() { return status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
