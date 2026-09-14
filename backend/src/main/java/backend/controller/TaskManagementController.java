package backend.controller;

import backend.dto.TaskListItemDTO;
import backend.dto.TaskManagementRequestDTO;
import backend.dto.TaskManagementStatsDTO;
import backend.dto.TaskNoteDTO;
import backend.dto.TaskPageResponseDTO;
import backend.dto.TaskStatusUpdateDTO;
import backend.service.TaskManagementService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/task-management")
public class TaskManagementController {
    private final TaskManagementService taskManagementService;

    public TaskManagementController(TaskManagementService taskManagementService) {
        this.taskManagementService = taskManagementService;
    }

    @GetMapping("/tasks")
    public TaskPageResponseDTO listTasks(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String priority,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "assignedAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDirection) {
        return taskManagementService.listTasks(search, status, priority, page, size, sortBy, sortDirection);
    }

    @GetMapping("/tasks/{taskId}")
    public TaskListItemDTO getTask(@PathVariable Long taskId) {
        return taskManagementService.getTask(taskId);
    }

    @PostMapping("/tasks")
    public TaskListItemDTO createTask(@Valid @RequestBody TaskManagementRequestDTO request) {
        return taskManagementService.createTask(request);
    }

    @PutMapping("/tasks/{taskId}")
    public TaskListItemDTO updateTask(@PathVariable Long taskId, @RequestBody TaskManagementRequestDTO request) {
        return taskManagementService.updateTask(taskId, request);
    }

    @PutMapping("/tasks/{taskId}/status")
    public TaskListItemDTO updateStatus(@PathVariable Long taskId, @Valid @RequestBody TaskStatusUpdateDTO request) {
        return taskManagementService.updateStatus(taskId, request);
    }

    @PutMapping("/tasks/{taskId}/complete")
    public TaskListItemDTO completeTask(@PathVariable Long taskId) {
        return taskManagementService.completeTask(taskId);
    }

    @PostMapping("/tasks/{taskId}/notes")
    public TaskListItemDTO updateNotes(@PathVariable Long taskId, @RequestBody TaskNoteDTO request) {
        return taskManagementService.updateNotes(taskId, request);
    }

    @GetMapping("/stats")
    public TaskManagementStatsDTO getStats() {
        return taskManagementService.getStats();
    }
}
