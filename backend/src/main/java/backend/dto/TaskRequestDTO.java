package backend.dto;

import jakarta.validation.constraints.NotNull;

public class TaskRequestDTO {


@NotNull(message = "Complaint ID is required")
private Long complaintId;

@NotNull(message = "Staff ID is required")
private Long staffId;

@NotNull(message = "Status is required")
private String status;

public TaskRequestDTO() {
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


}
