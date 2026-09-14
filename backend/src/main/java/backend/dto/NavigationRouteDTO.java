package backend.dto;

public class NavigationRouteDTO {
    private String origin;
    private String destination;
    private String mode = "driving";
    private Double distanceKm;
    private Integer etaMinutes;
    private String polyline;

    public NavigationRouteDTO() {
    }

    public NavigationRouteDTO(String origin, String destination, String mode, Double distanceKm, Integer etaMinutes, String polyline) {
        this.origin = origin;
        this.destination = destination;
        this.mode = mode;
        this.distanceKm = distanceKm;
        this.etaMinutes = etaMinutes;
        this.polyline = polyline;
    }

    public String getOrigin() {
        return origin;
    }

    public void setOrigin(String origin) {
        this.origin = origin;
    }

    public String getDestination() {
        return destination;
    }

    public void setDestination(String destination) {
        this.destination = destination;
    }

    public String getMode() {
        return mode;
    }

    public void setMode(String mode) {
        this.mode = mode;
    }

    public Double getDistanceKm() {
        return distanceKm;
    }

    public void setDistanceKm(Double distanceKm) {
        this.distanceKm = distanceKm;
    }

    public Integer getEtaMinutes() {
        return etaMinutes;
    }

    public void setEtaMinutes(Integer etaMinutes) {
        this.etaMinutes = etaMinutes;
    }

    public String getPolyline() {
        return polyline;
    }

    public void setPolyline(String polyline) {
        this.polyline = polyline;
    }
}
