package backend.dto;

public class StaffManagementPerformanceDTO {
    private long resolvedComplaints;
    private double averageResolutionHours;
    private double taskCompletionRate;
    private long activeTasks;
    private long totalTasks;

    public StaffManagementPerformanceDTO(long resolvedComplaints, double averageResolutionHours, double taskCompletionRate, long activeTasks, long totalTasks) {
        this.resolvedComplaints = resolvedComplaints;
        this.averageResolutionHours = averageResolutionHours;
        this.taskCompletionRate = taskCompletionRate;
        this.activeTasks = activeTasks;
        this.totalTasks = totalTasks;
    }
    public long getResolvedComplaints() { return resolvedComplaints; }
    public double getAverageResolutionHours() { return averageResolutionHours; }
    public double getTaskCompletionRate() { return taskCompletionRate; }
    public long getActiveTasks() { return activeTasks; }
    public long getTotalTasks() { return totalTasks; }
}
