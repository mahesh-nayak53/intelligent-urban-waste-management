package backend.dto;

import java.util.List;

public class StaffProfileDTO {
    private StaffListItemDTO staff;
    private StaffManagementPerformanceDTO performance;
    private List<StaffAssignedComplaintDTO> assignedComplaints;
    private List<StaffAssignedTaskDTO> assignedTasks;

    public StaffProfileDTO(StaffListItemDTO staff, StaffManagementPerformanceDTO performance, List<StaffAssignedComplaintDTO> assignedComplaints, List<StaffAssignedTaskDTO> assignedTasks) {
        this.staff = staff; this.performance = performance; this.assignedComplaints = assignedComplaints; this.assignedTasks = assignedTasks;
    }
    public StaffListItemDTO getStaff() { return staff; }
    public StaffManagementPerformanceDTO getPerformance() { return performance; }
    public List<StaffAssignedComplaintDTO> getAssignedComplaints() { return assignedComplaints; }
    public List<StaffAssignedTaskDTO> getAssignedTasks() { return assignedTasks; }
}
