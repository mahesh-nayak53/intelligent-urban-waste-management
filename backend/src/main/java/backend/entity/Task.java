package backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "tasks")
public class Task {


@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
private Long id;

private Long complaintId;

private Long staffId;

private String status;

private LocalDateTime assignedAt;

private LocalDateTime completedAt;

public Task() {
}

public Long getId() {
    return id;
}

public void setId(Long id) {
    this.id = id;
}

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

public String getStatus() {
    return status;
}

public void setStatus(String status) {
    this.status = status;
}

public LocalDateTime getAssignedAt() {
    return assignedAt;
}

public void setAssignedAt(LocalDateTime assignedAt) {
    this.assignedAt = assignedAt;
}

public LocalDateTime getCompletedAt() {
    return completedAt;
}

public void setCompletedAt(LocalDateTime completedAt) {
    this.completedAt = completedAt;
}


}
