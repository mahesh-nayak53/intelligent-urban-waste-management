package backend.service;

import backend.dto.DispatchAssignmentRequestDTO;
import backend.dto.StaffAssignedComplaintDTO;
import backend.dto.StaffAssignedTaskDTO;
import backend.dto.StaffAvailabilityDTO;
import backend.dto.StaffComplaintDetailDTO;
import backend.dto.StaffListItemDTO;
import backend.dto.StaffProfileDTO;
import backend.dto.TaskNoteDTO;
import backend.dto.TaskStatusUpdateDTO;
import backend.entity.Complaint;
import backend.entity.Staff;
import backend.entity.Task;
import backend.entity.TaskManagementMetadata;
import backend.repository.ComplaintRepository;
import backend.repository.StaffRepository;
import backend.repository.TaskMetadataRepository;
import backend.repository.TaskRepository;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.Objects;
import java.util.stream.Collectors;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class StaffWorkflowService {
    private final StaffRepository staffRepository;
    private final ComplaintRepository complaintRepository;
    private final TaskRepository taskRepository;
    private final TaskMetadataRepository metadataRepository;
    private final StaffManagementService staffManagementService;
    private final TaskService taskService;

    public StaffWorkflowService(StaffRepository staffRepository, ComplaintRepository complaintRepository,
            TaskRepository taskRepository, TaskMetadataRepository metadataRepository,
            StaffManagementService staffManagementService, TaskService taskService) {
        this.staffRepository = staffRepository;
        this.complaintRepository = complaintRepository;
        this.taskRepository = taskRepository;
        this.metadataRepository = metadataRepository;
        this.staffManagementService = staffManagementService;
        this.taskService = taskService;
    }

    public StaffProfileDTO getProfile(Authentication authentication) {
        Staff staff = currentStaff(authentication);
        List<Task> tasks = taskRepository.findByStaffId(staff.getId());
        return staffManagementService.getProfile(staff.getId());
    }

    public List<StaffAssignedTaskDTO> getTasks(Authentication authentication) {
        return taskRepository.findByStaffId(currentStaff(authentication).getId()).stream()
                .sorted(Comparator.comparing(Task::getAssignedAt, Comparator.nullsLast(Comparator.reverseOrder())))
                .map(this::toTask)
                .collect(Collectors.toList());
    }

    public List<StaffAssignedComplaintDTO> getComplaints(Authentication authentication) {
        return taskRepository.findByStaffId(currentStaff(authentication).getId()).stream()
                .map(task -> complaintRepository.findById(task.getComplaintId()).orElse(null))
                .filter(Objects::nonNull)
                .map(this::toComplaint)
                .distinct()
                .collect(Collectors.toList());
    }

    public StaffComplaintDetailDTO getComplaint(Authentication authentication, Long taskId) {
        Task task = ownedTask(authentication, taskId);
        Complaint complaint = complaintRepository.findById(task.getComplaintId())
                .orElseThrow(() -> new IllegalArgumentException("Complaint not found"));
        return toDetail(complaint);
    }

    @Transactional
    public StaffAssignedTaskDTO updateStatus(Authentication authentication, Long taskId, TaskStatusUpdateDTO request) {
        Task task = ownedTask(authentication, taskId);
        String next = normalize(request.getStatus());
        String current = normalize(task.getStatus());
        if (!isValidTransition(current, next)) {
            throw new IllegalArgumentException("Invalid task status transition");
        }
        if ("COMPLETED".equals(next)) return toTask(taskService.completeTask(taskId));
        task.setStatus(next);
        return toTask(taskRepository.save(task));
    }

    @Transactional
    public StaffAssignedTaskDTO updateNotes(Authentication authentication, Long taskId, TaskNoteDTO request) {
        Task task = ownedTask(authentication, taskId);
        TaskManagementMetadata metadata = metadataRepository.findByTaskId(taskId)
                .orElseGet(TaskManagementMetadata::new);
        metadata.setTaskId(taskId);
        metadata.setNotes(request.getNotes());
        metadataRepository.save(metadata);
        return toTask(task);
    }

    @Transactional
    public StaffListItemDTO updateAvailability(Authentication authentication, StaffAvailabilityDTO request) {
        Staff staff = currentStaff(authentication);
        staff.setAvailable(request.getAvailable());
        return staffManagementService.getProfile(staffRepository.save(staff).getId()).getStaff();
    }

    public List<Complaint> dispatchQueue() {
        return complaintRepository.findAll().stream()
                .filter(complaint -> complaint.getStatus() == null || !"RESOLVED".equalsIgnoreCase(complaint.getStatus()))
                .sorted(Comparator.comparing(Complaint::getCreatedAt, Comparator.nullsLast(Comparator.reverseOrder())))
                .collect(Collectors.toList());
    }

    public List<StaffListItemDTO> dispatchTeam(String zone) {
        return staffRepository.findAll().stream()
                .filter(staff -> Boolean.TRUE.equals(staff.getAvailable()))
                .filter(staff -> zone == null || zone.isBlank() || zone.equalsIgnoreCase(staff.getZone()))
                .map(staffManagementService::toListItemInternal)
                .sorted(Comparator.comparing(StaffListItemDTO::getAssignedTasks))
                .collect(Collectors.toList());
    }

    @Transactional
    public StaffAssignedTaskDTO assignTask(DispatchAssignmentRequestDTO request) {
        Complaint complaint = complaintRepository.findById(request.getComplaintId())
                .orElseThrow(() -> new IllegalArgumentException("Complaint not found"));
        Staff staff = staffRepository.findById(request.getStaffId())
                .orElseThrow(() -> new IllegalArgumentException("Staff member not found"));

        String type = request.getType() == null ? "FIELD" : request.getType().trim().toUpperCase(Locale.ROOT);
        if (staff.getAvailable() != null && !staff.getAvailable()) {
            throw new IllegalArgumentException("Staff member is unavailable for assignment");
        }

        Task task = new Task();
        task.setComplaintId(complaint.getId());
        task.setStaffId(staff.getId());
        task.setStatus("ASSIGNED");
        task.setAssignedAt(LocalDateTime.now());
        Task saved = taskRepository.save(task);

        complaint.setStatus("ASSIGNED");
        if (request.getPriority() != null && !request.getPriority().isBlank()) {
            complaint.setPriority(request.getPriority().trim().toUpperCase(Locale.ROOT));
        }
        if (request.getZone() != null && !request.getZone().isBlank()) {
            complaint.setZone(request.getZone());
        }
        complaintRepository.save(complaint);

        return toTask(saved);
    }

    private Staff currentStaff(Authentication authentication) {
        return staffRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new IllegalArgumentException("Staff profile not found"));
    }

    private Task ownedTask(Authentication authentication, Long taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new IllegalArgumentException("Task not found"));
        if (!task.getStaffId().equals(currentStaff(authentication).getId())) {
            throw new IllegalArgumentException("Task is not assigned to this staff member");
        }
        return task;
    }

    private boolean isValidTransition(String current, String next) {
        return ("PENDING".equals(current) && "ASSIGNED".equals(next))
                || ("ASSIGNED".equals(current) && "IN_PROGRESS".equals(next))
                || ("IN_PROGRESS".equals(current) && "COMPLETED".equals(next));
    }

    private String normalize(String status) {
        return status == null ? "" : status.trim().toUpperCase(Locale.ROOT);
    }

    private StaffAssignedTaskDTO toTask(Task task) {
        return new StaffAssignedTaskDTO(task.getId(), task.getComplaintId(), normalize(task.getStatus()),
                task.getAssignedAt(), task.getCompletedAt());
    }

    private StaffAssignedComplaintDTO toComplaint(Complaint complaint) {
        return new StaffAssignedComplaintDTO(complaint.getId(), complaint.getTitle(), complaint.getPriority(),
                complaint.getStatus(), complaint.getCreatedAt());
    }

    private StaffComplaintDetailDTO toDetail(Complaint complaint) {
        return new StaffComplaintDetailDTO(complaint.getId(), complaint.getTitle(), complaint.getDescription(),
                complaint.getPhotoUrl(), complaint.getLatitude(), complaint.getLongitude(), complaint.getZone(),
                complaint.getPriority(), complaint.getStatus());
    }
}