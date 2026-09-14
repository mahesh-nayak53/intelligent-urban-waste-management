package backend.dto;

public class StaffComplaintDetailDTO {
    private Long id;
    private String title;
    private String description;
    private String photoUrl;
    private Double latitude;
    private Double longitude;
    private String zone;
    private String priority;
    private String status;

    public StaffComplaintDetailDTO(Long id, String title, String description, String photoUrl,
            Double latitude, Double longitude, String zone, String priority, String status) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.photoUrl = photoUrl;
        this.latitude = latitude;
        this.longitude = longitude;
        this.zone = zone;
        this.priority = priority;
        this.status = status;
    }

    public Long getId() { return id; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public String getPhotoUrl() { return photoUrl; }
    public Double getLatitude() { return latitude; }
    public Double getLongitude() { return longitude; }
    public String getZone() { return zone; }
    public String getPriority() { return priority; }
    public String getStatus() { return status; }
}