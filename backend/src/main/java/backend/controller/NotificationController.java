package backend.controller;

import backend.entity.Notification;
import backend.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @GetMapping
    public List<Notification> getNotifications() {

        return notificationService
                .getRecentNotifications();
    }

    @PutMapping("/{id}/read")
    public Notification markRead(@PathVariable Long id) {
        return notificationService.markRead(id);
    }

    @DeleteMapping("/{id}")
    public void deleteNotification(@PathVariable Long id) {
        notificationService.deleteNotification(id);
    }
}