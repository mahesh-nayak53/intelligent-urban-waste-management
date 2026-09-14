package backend.repository;

import backend.entity.WorkerAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WorkerAssignmentRepository extends JpaRepository<WorkerAssignment, Long> {
    List<WorkerAssignment> findByStaffId(Long staffId);
    List<WorkerAssignment> findByWorkerId(Long workerId);
    List<WorkerAssignment> findByComplaintId(Long complaintId);
    List<WorkerAssignment> findByStatus(String status);
}
