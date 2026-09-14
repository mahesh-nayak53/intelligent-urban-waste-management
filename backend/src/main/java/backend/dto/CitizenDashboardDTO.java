package backend.dto;

import backend.entity.Notification;
import java.util.List;

public class CitizenDashboardDTO {
    private CitizenStatsDTO stats;
    private List<CitizenComplaintDTO> complaints;
    private List<Notification> notifications;

    public CitizenDashboardDTO(CitizenStatsDTO stats, List<CitizenComplaintDTO> complaints, List<Notification> notifications) {
        this.stats = stats;
        this.complaints = complaints;
        this.notifications = notifications;
    }

    public CitizenStatsDTO getStats() { return stats; }
    public List<CitizenComplaintDTO> getComplaints() { return complaints; }
    public List<Notification> getNotifications() { return notifications; }
}
