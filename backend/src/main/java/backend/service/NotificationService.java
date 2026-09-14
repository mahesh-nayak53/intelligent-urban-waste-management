package backend.service;

import backend.entity.Notification;
import backend.entity.User;
import backend.repository.NotificationRepository;
import backend.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepository;

    public void createNotification(
            String message,
            String type) {
        createNotification(message, type, null);
        }

        public void createNotification(
            String message,
            String type,
            User recipient) {

        Notification notification = new Notification();

        notification.setMessage(message);
        notification.setType(type);
        notification.setCreatedAt(LocalDateTime.now());
        notification.setRecipient(recipient);

        notificationRepository.save(notification);
    }

    public List<Notification> getRecentNotifications() {

        return notificationRepository
                .findTop10ByOrderByCreatedAtDesc();
    }

    public List<Notification> getRecentNotificationsForUser(User recipient) {
        return notificationRepository.findTop10ByRecipientOrderByCreatedAtDesc(recipient);
    }

    public Notification markRead(Long id) {
        Notification notification = findAuthorized(id);
        notification.setRead(true);
        return notificationRepository.save(notification);
    }

    public void deleteNotification(Long id) {
        notificationRepository.delete(findAuthorized(id));
    }

    private Notification findAuthorized(Long id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Notification not found"));
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        boolean admin = authentication.getAuthorities().stream().anyMatch(authority -> "ROLE_ADMIN".equals(authority.getAuthority()));
        if (!admin) {
            User user = userRepository.findByEmail(authentication.getName())
                    .orElseThrow(() -> new IllegalArgumentException("User not found"));
            if (notification.getRecipient() == null || !user.getId().equals(notification.getRecipient().getId())) {
                throw new org.springframework.security.access.AccessDeniedException("Notification access denied");
            }
        }
        return notification;
    }
}