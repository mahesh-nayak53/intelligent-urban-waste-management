package backend.repository;

import backend.entity.Worker;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WorkerRepository extends JpaRepository<Worker, Long> {
    List<Worker> findByAvailabilityTrue();
    List<Worker> findByZoneAndAvailabilityTrue(String zone, Boolean availability);
    List<Worker> findByDepartment(String department);
}
