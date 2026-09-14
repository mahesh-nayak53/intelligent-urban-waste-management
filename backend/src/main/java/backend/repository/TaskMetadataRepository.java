package backend.repository;

import backend.entity.TaskManagementMetadata;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TaskMetadataRepository extends JpaRepository<TaskManagementMetadata, Long> {
    Optional<TaskManagementMetadata> findByTaskId(Long taskId);
}
