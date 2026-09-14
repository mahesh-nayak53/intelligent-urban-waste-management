package backend.dto;

public class ComplaintHistoryDTO {

    private Long pending;
    private Long assigned;
    private Long resolved;
    private Long total;

    public Long getPending() {
        return pending;
    }

    public void setPending(Long pending) {
        this.pending = pending;
    }

    public Long getAssigned() {
        return assigned;
    }

    public void setAssigned(Long assigned) {
        this.assigned = assigned;
    }

    public Long getResolved() {
        return resolved;
    }

    public void setResolved(Long resolved) {
        this.resolved = resolved;
    }

    public Long getTotal() {
        return total;
    }

    public void setTotal(Long total) {
        this.total = total;
    }
}