package backend.controller;

import backend.dto.WorkerAssignmentRequestDTO;
import backend.dto.WorkerAssignmentStatusUpdateDTO;
import backend.entity.WorkerAssignment;
import backend.service.WorkerAssignmentService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/worker-assignments")
public class WorkerAssignmentController {

    private final WorkerAssignmentService workerAssignmentService;

    public WorkerAssignmentController(WorkerAssignmentService workerAssignmentService) {
        this.workerAssignmentService = workerAssignmentService;
    }

    @PostMapping
    public ResponseEntity<WorkerAssignment> createAssignment(@Valid @RequestBody WorkerAssignmentRequestDTO request) {
        return ResponseEntity.ok(workerAssignmentService.createAssignment(request));
    }

    @GetMapping
    public ResponseEntity<List<WorkerAssignment>> getAssignments() {
        return ResponseEntity.ok(workerAssignmentService.getAssignments());
    }

    @GetMapping("/staff/{staffId}")
    public ResponseEntity<List<WorkerAssignment>> getAssignmentsByStaff(@PathVariable Long staffId) {
        return ResponseEntity.ok(workerAssignmentService.getAssignmentsByStaff(staffId));
    }

    @GetMapping("/worker/{workerId}")
    public ResponseEntity<List<WorkerAssignment>> getAssignmentsByWorker(@PathVariable Long workerId) {
        return ResponseEntity.ok(workerAssignmentService.getAssignmentsByWorker(workerId));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<WorkerAssignment> updateStatus(@PathVariable Long id, @Valid @RequestBody WorkerAssignmentStatusUpdateDTO request) {
        return ResponseEntity.ok(workerAssignmentService.updateStatus(id, request));
    }
}
