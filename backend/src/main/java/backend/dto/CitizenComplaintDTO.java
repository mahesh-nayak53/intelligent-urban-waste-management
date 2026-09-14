package backend.dto;

import java.time.LocalDateTime;
import java.util.List;

public class CitizenComplaintDTO {
    private Long id;
    private String title;
    private String description;
    private String photoUrl;
    private String zone;
    private String priority;
    private String status;
    private LocalDateTime createdAt;
    private String assignedStaffName;
    private String assignedStaffPhone;
    private List<CitizenTimelineItemDTO> timeline;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getPhotoUrl() { return photoUrl; }
    public void setPhotoUrl(String photoUrl) { this.photoUrl = photoUrl; }
    public String getZone() { return zone; }
    public void setZone(String zone) { this.zone = zone; }
    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public String getAssignedStaffName() { return assignedStaffName; }
    public void setAssignedStaffName(String assignedStaffName) { this.assignedStaffName = assignedStaffName; }
    public String getAssignedStaffPhone() { return assignedStaffPhone; }
    public void setAssignedStaffPhone(String assignedStaffPhone) { this.assignedStaffPhone = assignedStaffPhone; }
    public List<CitizenTimelineItemDTO> getTimeline() { return timeline; }
    public void setTimeline(List<CitizenTimelineItemDTO> timeline) { this.timeline = timeline; }
}
