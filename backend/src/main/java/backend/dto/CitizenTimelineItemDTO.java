package backend.dto;

import java.time.LocalDateTime;

public class CitizenTimelineItemDTO {
    private String label;
    private String detail;
    private LocalDateTime timestamp;
    private boolean complete;

    public CitizenTimelineItemDTO(String label, String detail, LocalDateTime timestamp, boolean complete) {
        this.label = label;
        this.detail = detail;
        this.timestamp = timestamp;
        this.complete = complete;
    }

    public String getLabel() { return label; }
    public String getDetail() { return detail; }
    public LocalDateTime getTimestamp() { return timestamp; }
    public boolean isComplete() { return complete; }
}
