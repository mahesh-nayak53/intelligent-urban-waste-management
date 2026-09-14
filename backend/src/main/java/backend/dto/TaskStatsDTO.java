package backend.dto;

public class TaskStatsDTO {

    private Long totalTasks;
    private Long assignedTasks;
    private Long completedTasks;
    private Long pendingTasks;
    private Long inProgressTasks;

    public Long getTotalTasks() {
        return totalTasks;
    }

    public void setTotalTasks(Long totalTasks) {
        this.totalTasks = totalTasks;
    }

    public Long getAssignedTasks() {
        return assignedTasks;
    }

    public void setAssignedTasks(Long assignedTasks) {
        this.assignedTasks = assignedTasks;
    }

    public Long getCompletedTasks() {
        return completedTasks;
    }

    public void setCompletedTasks(Long completedTasks) {
        this.completedTasks = completedTasks;
    }

    public Long getPendingTasks() {
        return pendingTasks;
    }

    public void setPendingTasks(Long pendingTasks) {
        this.pendingTasks = pendingTasks;
    }

    public Long getInProgressTasks() {
        return inProgressTasks;
    }

    public void setInProgressTasks(Long inProgressTasks) {
        this.inProgressTasks = inProgressTasks;
    }
}