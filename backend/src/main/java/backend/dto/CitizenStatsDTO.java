package backend.dto;

public class CitizenStatsDTO {
    private long totalComplaints;
    private long pendingComplaints;
    private long assignedComplaints;
    private long resolvedComplaints;

    public CitizenStatsDTO(long totalComplaints, long pendingComplaints, long assignedComplaints, long resolvedComplaints) {
        this.totalComplaints = totalComplaints;
        this.pendingComplaints = pendingComplaints;
        this.assignedComplaints = assignedComplaints;
        this.resolvedComplaints = resolvedComplaints;
    }

    public long getTotalComplaints() { return totalComplaints; }
    public long getPendingComplaints() { return pendingComplaints; }
    public long getAssignedComplaints() { return assignedComplaints; }
    public long getResolvedComplaints() { return resolvedComplaints; }
}
