package backend.repository;

import backend.entity.Notification;
import backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository
        extends JpaRepository<Notification, Long> {

    List<Notification> findTop10ByOrderByCreatedAtDesc();

    List<Notification> findTop10ByRecipientOrderByCreatedAtDesc(User recipient);
}