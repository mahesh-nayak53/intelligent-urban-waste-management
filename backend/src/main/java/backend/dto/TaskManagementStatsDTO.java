package backend.dto;

public class TaskManagementStatsDTO {
    private long totalTasks;
    private long pendingTasks;
    private long inProgressTasks;
    private long completedTasks;

    public TaskManagementStatsDTO(long totalTasks, long pendingTasks, long inProgressTasks, long completedTasks) {
        this.totalTasks = totalTasks;
        this.pendingTasks = pendingTasks;
        this.inProgressTasks = inProgressTasks;
        this.completedTasks = completedTasks;
    }

    public long getTotalTasks() { return totalTasks; }
    public long getPendingTasks() { return pendingTasks; }
    public long getInProgressTasks() { return inProgressTasks; }
    public long getCompletedTasks() { return completedTasks; }
}
