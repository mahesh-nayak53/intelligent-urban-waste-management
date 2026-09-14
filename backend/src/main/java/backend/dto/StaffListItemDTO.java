package backend.dto;

public class StaffListItemDTO {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private String department;
    private String zone;
    private Boolean available;
    private long assignedTasks;
    private long resolvedComplaints;
    private double taskCompletionRate;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
    public String getZone() { return zone; }
    public void setZone(String zone) { this.zone = zone; }
    public Boolean getAvailable() { return available; }
    public void setAvailable(Boolean available) { this.available = available; }
    public long getAssignedTasks() { return assignedTasks; }
    public void setAssignedTasks(long assignedTasks) { this.assignedTasks = assignedTasks; }
    public long getResolvedComplaints() { return resolvedComplaints; }
    public void setResolvedComplaints(long resolvedComplaints) { this.resolvedComplaints = resolvedComplaints; }
    public double getTaskCompletionRate() { return taskCompletionRate; }
    public void setTaskCompletionRate(double taskCompletionRate) { this.taskCompletionRate = taskCompletionRate; }
}
