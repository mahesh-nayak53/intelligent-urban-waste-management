package backend.repository;

import backend.dto.StaffPerformanceDTO;
import org.springframework.data.jpa.repository.Query;
import backend.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {


    @Query("""
SELECT new backend.dto.StaffPerformanceDTO(
    s.id,
    s.name,
    COUNT(t.id)
)
FROM Staff s
LEFT JOIN Task t
ON s.id = t.staffId
AND t.status = 'COMPLETED'
GROUP BY s.id, s.name
""")
java.util.List<StaffPerformanceDTO> getStaffPerformance();

@Query("""
SELECT new backend.dto.StaffWorkloadDTO(
s.name,
COUNT(t.id)
)
FROM Staff s
LEFT JOIN Task t
ON s.id = t.staffId
AND t.status = 'ASSIGNED'
GROUP BY s.name
""")
List<backend.dto.StaffWorkloadDTO> getStaffWorkload();

List<Task> findByStaffId(Long staffId);

Long countByStatus(String status);

Long countByStaffId(Long staffId);

}
