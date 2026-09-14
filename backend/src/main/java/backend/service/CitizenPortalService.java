package backend.service;

import backend.dto.CitizenComplaintDTO;
import backend.dto.CitizenDashboardDTO;
import backend.dto.CitizenProfileDTO;
import backend.dto.CitizenProfileUpdateDTO;
import backend.dto.CitizenStatsDTO;
import backend.dto.CitizenTimelineItemDTO;
import backend.entity.Complaint;
import backend.entity.Notification;
import backend.entity.Staff;
import backend.entity.Task;
import backend.entity.User;
import backend.repository.ComplaintRepository;
import backend.repository.NotificationRepository;
import backend.repository.StaffRepository;
import backend.repository.TaskRepository;
import backend.repository.UserRepository;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CitizenPortalService {
    private final ComplaintRepository complaintRepository;
    private final NotificationRepository notificationRepository;
    private final StaffRepository staffRepository;
    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    public CitizenPortalService(ComplaintRepository complaintRepository,
            NotificationRepository notificationRepository,
            StaffRepository staffRepository,
            TaskRepository taskRepository,
            UserRepository userRepository) {
        this.complaintRepository = complaintRepository;
        this.notificationRepository = notificationRepository;
        this.staffRepository = staffRepository;
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
    }

    public CitizenDashboardDTO getDashboard() {
        User user = currentUser();
        List<CitizenComplaintDTO> complaints = complaintRepository.findByCreatedBy(user).stream()
                .map(this::toComplaint)
                .toList();
        CitizenStatsDTO stats = new CitizenStatsDTO(
                complaints.size(),
                countStatus(complaints, "PENDING"),
                countStatus(complaints, "ASSIGNED"),
                countStatus(complaints, "RESOLVED"));
        return new CitizenDashboardDTO(stats, complaints, notificationRepository.findTop10ByRecipientOrderByCreatedAtDesc(user));
    }

    public CitizenComplaintDTO getComplaint(Long complaintId) {
        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new IllegalArgumentException("Complaint not found"));
        assertOwner(complaint);
        return toComplaint(complaint);
    }

    public CitizenProfileDTO getProfile() {
        return toProfile(currentUser());
    }

    @Transactional
    public CitizenProfileDTO updateProfile(CitizenProfileUpdateDTO request) {
        User user = currentUser();
        user.setName(request.getName());
        user.setPhone(request.getPhone());
        return toProfile(userRepository.save(user));
    }

    private CitizenComplaintDTO toComplaint(Complaint complaint) {
        CitizenComplaintDTO result = new CitizenComplaintDTO();
        result.setId(complaint.getId());
        result.setTitle(complaint.getTitle());
        result.setDescription(complaint.getDescription());
        result.setPhotoUrl(complaint.getPhotoUrl());
        result.setZone(complaint.getZone());
        result.setPriority(complaint.getPriority());
        result.setStatus(complaint.getStatus());
        result.setCreatedAt(complaint.getCreatedAt());

        Task task = taskRepository.findAll().stream()
                .filter(candidate -> complaint.getId().equals(candidate.getComplaintId()))
                .findFirst()
                .orElse(null);
        Staff staff = task == null ? null : staffRepository.findById(task.getStaffId()).orElse(null);
        if (staff != null) {
            result.setAssignedStaffName(staff.getName());
            result.setAssignedStaffPhone(staff.getPhone());
        }
        result.setTimeline(buildTimeline(complaint, task));
        return result;
    }

    private List<CitizenTimelineItemDTO> buildTimeline(Complaint complaint, Task task) {
        List<CitizenTimelineItemDTO> timeline = new ArrayList<>();
        timeline.add(new CitizenTimelineItemDTO("Complaint submitted", "Your report was received by CleanCity.", complaint.getCreatedAt(), true));
        boolean assigned = task != null;
        timeline.add(new CitizenTimelineItemDTO("Team assigned", assigned ? "A field team is reviewing the report." : "Waiting for a field team assignment.", assigned ? task.getAssignedAt() : null, assigned));
        boolean resolved = "RESOLVED".equalsIgnoreCase(complaint.getStatus()) || "COMPLETED".equalsIgnoreCase(task == null ? "" : task.getStatus());
        timeline.add(new CitizenTimelineItemDTO("Resolved", resolved ? "The reported issue has been resolved." : "This step will update when the work is complete.", resolved && task != null ? task.getCompletedAt() : null, resolved));
        return timeline;
    }

    private CitizenProfileDTO toProfile(User user) {
        return new CitizenProfileDTO(user.getId(), user.getName(), user.getEmail(), user.getPhone());
    }

    private User currentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    private void assertOwner(Complaint complaint) {
        User user = currentUser();
        if (complaint.getCreatedBy() == null || !user.getId().equals(complaint.getCreatedBy().getId())) {
            throw new IllegalArgumentException("Complaint not found");
        }
    }

    private long countStatus(List<CitizenComplaintDTO> complaints, String status) {
        return complaints.stream().filter(complaint -> status.equalsIgnoreCase(complaint.getStatus())).count();
    }
}
