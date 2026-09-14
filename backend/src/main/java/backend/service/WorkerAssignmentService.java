package backend.service;

import backend.dto.WorkerAssignmentRequestDTO;
import backend.dto.WorkerAssignmentStatusUpdateDTO;
import backend.entity.WorkerAssignment;
import backend.repository.WorkerAssignmentRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class WorkerAssignmentService {

    private final WorkerAssignmentRepository workerAssignmentRepository;

    public WorkerAssignmentService(WorkerAssignmentRepository workerAssignmentRepository) {
        this.workerAssignmentRepository = workerAssignmentRepository;
    }

    public WorkerAssignment createAssignment(WorkerAssignmentRequestDTO request) {
        WorkerAssignment assignment = new WorkerAssignment();
        assignment.setComplaintId(request.getComplaintId());
        assignment.setStaffId(request.getStaffId());
        assignment.setWorkerId(request.getWorkerId());
        assignment.setPriority(request.getPriority());
        assignment.setNotes(request.getNotes());
        assignment.setStatus(request.getStatus() != null ? request.getStatus() : WorkerAssignment.STATUS_ASSIGNED);
        return workerAssignmentRepository.save(assignment);
    }

    public List<WorkerAssignment> getAssignments() {
        return workerAssignmentRepository.findAll();
    }

    public List<WorkerAssignment> getAssignmentsByStaff(Long staffId) {
        return workerAssignmentRepository.findByStaffId(staffId);
    }

    public List<WorkerAssignment> getAssignmentsByWorker(Long workerId) {
        return workerAssignmentRepository.findByWorkerId(workerId);
    }

    public WorkerAssignment updateStatus(Long id, WorkerAssignmentStatusUpdateDTO request) {
        WorkerAssignment assignment = workerAssignmentRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Assignment not found with id: " + id));

        assignment.setStatus(request.getStatus());
        if (request.getNotes() != null && !request.getNotes().isBlank()) {
            assignment.setNotes(request.getNotes());
        }

        if (WorkerAssignment.STATUS_IN_PROGRESS.equalsIgnoreCase(request.getStatus())) {
            assignment.setStartedAt(LocalDateTime.now());
        }

        if (WorkerAssignment.STATUS_COMPLETED.equalsIgnoreCase(request.getStatus())) {
            assignment.setCompletedAt(LocalDateTime.now());
        }

        return workerAssignmentRepository.save(assignment);
    }
}
