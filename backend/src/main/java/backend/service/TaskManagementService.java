package backend.service;

import backend.dto.TaskListItemDTO;
import backend.dto.TaskManagementRequestDTO;
import backend.dto.TaskManagementStatsDTO;
import backend.dto.TaskNoteDTO;
import backend.dto.TaskPageResponseDTO;
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
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TaskManagementService {
    private final ComplaintRepository complaintRepository;
    private final StaffRepository staffRepository;
    private final TaskRepository taskRepository;
    private final TaskMetadataRepository metadataRepository;
    private final TaskService taskService;

    public TaskManagementService(
            ComplaintRepository complaintRepository,
            StaffRepository staffRepository,
            TaskRepository taskRepository,
            TaskMetadataRepository metadataRepository,
            TaskService taskService) {
        this.complaintRepository = complaintRepository;
        this.staffRepository = staffRepository;
        this.taskRepository = taskRepository;
        this.metadataRepository = metadataRepository;
        this.taskService = taskService;
    }

    public TaskPageResponseDTO listTasks(String search, String status, String priority,
            int page, int size, String sortBy, String sortDirection) {
        int safePage = Math.max(page, 0);
        int safeSize = Math.min(Math.max(size, 1), 100);
        String normalizedSearch = search == null ? "" : search.trim().toLowerCase(Locale.ROOT);
        String normalizedStatus = normalizeStatusFilter(status);
        String normalizedPriority = priority == null ? "" : priority.trim().toUpperCase(Locale.ROOT);

        List<TaskListItemDTO> filtered = taskRepository.findAll().stream()
                .map(this::toListItem)
                .filter(task -> normalizedSearch.isEmpty()
                        || task.getComplaintReference().toLowerCase(Locale.ROOT).contains(normalizedSearch)
                        || task.getAssignedStaff().toLowerCase(Locale.ROOT).contains(normalizedSearch)
                        || String.valueOf(task.getId()).contains(normalizedSearch))
                .filter(task -> normalizedStatus.isEmpty() || normalizedStatus.equals(task.getStatus()))
                .filter(task -> normalizedPriority.isEmpty() || normalizedPriority.equals(task.getPriority()))
                .sorted(taskComparator(sortBy, sortDirection))
                .collect(Collectors.toList());

        long total = filtered.size();
        int from = Math.min(safePage * safeSize, filtered.size());
        int to = Math.min(from + safeSize, filtered.size());
        return new TaskPageResponseDTO(filtered.subList(from, to), safePage, safeSize, total);
    }

    public TaskListItemDTO getTask(Long taskId) {
        return toListItem(findTask(taskId));
    }

    @Transactional
    public TaskListItemDTO createTask(TaskManagementRequestDTO request) {
        complaintRepository.findById(request.getComplaintId())
                .orElseThrow(() -> new IllegalArgumentException("Complaint not found"));
        staffRepository.findById(request.getStaffId())
                .orElseThrow(() -> new IllegalArgumentException("Staff not found"));

        Task task = new Task();
        task.setComplaintId(request.getComplaintId());
        task.setStaffId(request.getStaffId());
        task.setStatus(normalizeStoredStatus(request.getStatus()));
        task.setAssignedAt(LocalDateTime.now());
        Task saved = taskRepository.save(task);
        saveMetadata(saved.getId(), request);
        return toListItem(saved);
    }

    @Transactional
    public TaskListItemDTO updateTask(Long taskId, TaskManagementRequestDTO request) {
        Task task = findTask(taskId);
        if (request.getComplaintId() != null) {
            complaintRepository.findById(request.getComplaintId())
                    .orElseThrow(() -> new IllegalArgumentException("Complaint not found"));
            task.setComplaintId(request.getComplaintId());
        }
        if (request.getStaffId() != null) {
            staffRepository.findById(request.getStaffId())
                    .orElseThrow(() -> new IllegalArgumentException("Staff not found"));
            task.setStaffId(request.getStaffId());
        }
        if (request.getStatus() != null && !request.getStatus().isBlank()) {
            task.setStatus(normalizeStoredStatus(request.getStatus()));
        }
        Task saved = taskRepository.save(task);
        saveMetadata(saved.getId(), request);
        return toListItem(saved);
    }

    @Transactional
    public TaskListItemDTO updateStatus(Long taskId, TaskStatusUpdateDTO request) {
        if ("COMPLETED".equalsIgnoreCase(request.getStatus())) {
            return toListItem(taskService.completeTask(taskId));
        }
        Task task = findTask(taskId);
        task.setStatus(normalizeStoredStatus(request.getStatus()));
        return toListItem(taskRepository.save(task));
    }

    @Transactional
    public TaskListItemDTO completeTask(Long taskId) {
        return toListItem(taskService.completeTask(taskId));
    }

    @Transactional
    public TaskListItemDTO updateNotes(Long taskId, TaskNoteDTO request) {
        Task task = findTask(taskId);
        TaskManagementMetadata metadata = metadataRepository.findByTaskId(taskId)
                .orElseGet(TaskManagementMetadata::new);
        metadata.setTaskId(taskId);
        metadata.setNotes(request.getNotes());
        metadataRepository.save(metadata);
        return toListItem(task);
    }

    public TaskManagementStatsDTO getStats() {
        List<Task> tasks = taskRepository.findAll();
        long completed = tasks.stream().filter(task -> "COMPLETED".equalsIgnoreCase(task.getStatus())).count();
        long inProgress = tasks.stream().filter(task -> "ASSIGNED".equalsIgnoreCase(task.getStatus())
                || "IN_PROGRESS".equalsIgnoreCase(task.getStatus())).count();
        long pending = tasks.stream().filter(task -> "PENDING".equalsIgnoreCase(task.getStatus())).count();
        return new TaskManagementStatsDTO(tasks.size(), pending, inProgress, completed);
    }

    private Task findTask(Long taskId) {
        return taskRepository.findById(taskId)
                .orElseThrow(() -> new IllegalArgumentException("Task not found"));
    }

    private void saveMetadata(Long taskId, TaskManagementRequestDTO request) {
        TaskManagementMetadata metadata = metadataRepository.findByTaskId(taskId)
                .orElseGet(TaskManagementMetadata::new);
        metadata.setTaskId(taskId);
        if (request.getDueDate() != null) metadata.setDueDate(request.getDueDate());
        if (request.getPriority() != null) metadata.setPriority(request.getPriority().toUpperCase(Locale.ROOT));
        if (request.getNotes() != null) metadata.setNotes(request.getNotes());
        metadataRepository.save(metadata);
    }

    private TaskListItemDTO toListItem(Task task) {
        TaskListItemDTO result = new TaskListItemDTO();
        result.setId(task.getId());
        result.setComplaintId(task.getComplaintId());
        result.setStaffId(task.getStaffId());
        result.setAssignedAt(task.getAssignedAt());
        result.setCompletedAt(task.getCompletedAt());
        result.setStatus(displayStatus(task.getStatus()));

        Complaint complaint = complaintRepository.findById(task.getComplaintId()).orElse(null);
        Staff staff = staffRepository.findById(task.getStaffId()).orElse(null);
        result.setComplaintReference(complaint == null ? "Complaint #" + task.getComplaintId()
                : "#" + complaint.getId() + " - " + complaint.getTitle());
        result.setAssignedStaff(staff == null ? "Unassigned" : staff.getName());

        metadataRepository.findByTaskId(task.getId()).ifPresent(metadata -> {
            result.setDueDate(metadata.getDueDate());
            result.setPriority(metadata.getPriority());
            result.setNotes(metadata.getNotes());
        });
        return result;
    }

    private Comparator<TaskListItemDTO> taskComparator(String sortBy, String direction) {
        Comparator<TaskListItemDTO> comparator;
        if ("dueDate".equals(sortBy)) comparator = Comparator.comparing(TaskListItemDTO::getDueDate, Comparator.nullsLast(Comparator.naturalOrder()));
        else if ("priority".equals(sortBy)) comparator = Comparator.comparing(TaskListItemDTO::getPriority, Comparator.nullsLast(String.CASE_INSENSITIVE_ORDER));
        else if ("status".equals(sortBy)) comparator = Comparator.comparing(TaskListItemDTO::getStatus, Comparator.nullsLast(String.CASE_INSENSITIVE_ORDER));
        else comparator = Comparator.comparing(TaskListItemDTO::getAssignedAt, Comparator.nullsLast(Comparator.naturalOrder()));
        return "desc".equalsIgnoreCase(direction) ? comparator.reversed() : comparator;
    }

    private String normalizeStatusFilter(String status) {
        if (status == null || status.isBlank() || "ALL".equalsIgnoreCase(status)) return "";
        return displayStatus(status);
    }

    private String normalizeStoredStatus(String status) {
        if (status == null || status.isBlank()) return "PENDING";
        String normalized = status.trim().toUpperCase(Locale.ROOT);
        if ("IN_PROGRESS".equals(normalized) || "ASSIGNED".equals(normalized)
                || "PENDING".equals(normalized) || "COMPLETED".equals(normalized)) {
            return normalized;
        }
        return normalized;
    }

    private String displayStatus(String status) {
        if (status == null || status.isBlank()) return "PENDING";
        return status.trim().toUpperCase(Locale.ROOT);
    }
}
