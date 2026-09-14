package backend.service;


import backend.entity.Notification;
import backend.repository.NotificationRepository;

import backend.dto.ComplaintTrendDTO;
import backend.entity.Complaint;
import backend.dto.PriorityStatsDTO;
import backend.dto.ComplaintHistoryDTO;
import backend.repository.TaskRepository;
import backend.dto.StaffPerformanceDTO;
import backend.dto.ZoneStatsDTO;
import backend.dto.TaskStatsDTO;

import java.util.List;
import backend.dto.DashboardResponseDTO;
import backend.repository.ComplaintRepository;
import backend.repository.StaffRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DashboardService {

    @Autowired
    private ComplaintRepository complaintRepository;

    
    @Autowired
    private StaffRepository staffRepository;

     @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private NotificationRepository notificationRepository;


    public List<ZoneStatsDTO> getZoneStats() {

    return complaintRepository.getZoneStatistics();

}

    public List<PriorityStatsDTO> getPriorityStats() {

    return complaintRepository.getPriorityStatistics();
}

public List<backend.dto.ComplaintStatusDTO> getStatusStats() {

    return complaintRepository.getStatusStatistics();
}

public List<backend.dto.StaffWorkloadDTO> getStaffWorkload() {
    return taskRepository.getStaffWorkload();
}

public List<Complaint> getRecentComplaints() {

    return complaintRepository
            .findTop5ByOrderByCreatedAtDesc();
}

public List<StaffPerformanceDTO> getStaffPerformance() {
    return taskRepository.getStaffPerformance();
}



public java.util.List<ComplaintTrendDTO> getComplaintTrend() {

    return complaintRepository.getComplaintTrend();

}

    public DashboardResponseDTO getDashboardStats() {

        DashboardResponseDTO dto = new DashboardResponseDTO();
        long totalComplaints = complaintRepository.count();
        long pendingComplaints = complaintRepository.countByStatus("PENDING");
        long assignedComplaints = complaintRepository.countByStatus("ASSIGNED");
        long resolvedComplaints = complaintRepository.countByStatus("RESOLVED");
        long totalStaff = staffRepository.count();
        long availableStaff = staffRepository.countByAvailableTrue();

        dto.setTotalComplaints(totalComplaints);
        dto.setPendingComplaints(pendingComplaints);
        dto.setAssignedComplaints(assignedComplaints);
        dto.setResolvedComplaints(resolvedComplaints);
        dto.setTotalStaff(totalStaff);
        dto.setStaffMembers(totalStaff);
        dto.setAvailableStaff(availableStaff);

        return dto;
    }
    public ComplaintHistoryDTO getComplaintHistory() {

    ComplaintHistoryDTO dto = new ComplaintHistoryDTO();

    dto.setPending(
            complaintRepository.countByStatus("PENDING"));

    dto.setAssigned(
            complaintRepository.countByStatus("ASSIGNED"));

    dto.setResolved(
            complaintRepository.countByStatus("RESOLVED"));

    dto.setTotal(
            complaintRepository.count());

    return dto;
}

    public TaskStatsDTO getTaskStats() {

    TaskStatsDTO dto = new TaskStatsDTO();
    long total = taskRepository.count();
    long completed = taskRepository.countByStatus("COMPLETED");
    long assigned = taskRepository.countByStatus("ASSIGNED");
    long pending = taskRepository.countByStatus("PENDING");
    long inProgress = assigned;

    dto.setTotalTasks(total);
    dto.setAssignedTasks(assigned + inProgress);
    dto.setCompletedTasks(completed);
    dto.setPendingTasks(pending);
    dto.setInProgressTasks(inProgress);

    return dto;
}

public List<Notification> getRecentActivity() {

    return notificationRepository
            .findTop10ByOrderByCreatedAtDesc();
            
        }
        }