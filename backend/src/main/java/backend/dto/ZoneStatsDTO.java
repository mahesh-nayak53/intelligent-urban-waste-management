package backend.dto;

public class ZoneStatsDTO {

    private String zone;
    private Long complaints;
    private Long resolved;

    public ZoneStatsDTO() {
    }

    public ZoneStatsDTO(String zone, Long complaints) {
        this.zone = zone;
        this.complaints = complaints;
        this.resolved = 0L;
    }

    public String getZone() {
        return zone;
    }

    public void setZone(String zone) {
        this.zone = zone;
    }

    public Long getComplaints() {
        return complaints;
    }

    public void setComplaints(Long complaints) {
        this.complaints = complaints;
    }

    public Long getResolved() {
        return resolved == null ? 0L : resolved;
    }

    public void setResolved(Long resolved) {
        this.resolved = resolved;
    }
}