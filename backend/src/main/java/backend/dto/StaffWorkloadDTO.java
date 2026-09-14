package backend.dto;

public class StaffWorkloadDTO {

    private String staffName;
    private String name;
    private Long assignedTasks;
    private Long activeTasks;
    private Long capacity;

    public StaffWorkloadDTO(String staffName, Long assignedTasks) {
        this.staffName = staffName;
        this.name = staffName;
        this.assignedTasks = assignedTasks;
        this.activeTasks = assignedTasks == null ? 0L : assignedTasks;
        this.capacity = Math.max(5L, this.activeTasks + 2L);
    }

    public String getStaffName() {
        return staffName;
    }

    public void setStaffName(String staffName) {
        this.staffName = staffName;
        this.name = staffName;
    }

    public String getName() {
        return name != null ? name : staffName;
    }

    public void setName(String name) {
        this.name = name;
        this.staffName = name;
    }

    public Long getAssignedTasks() {
        return assignedTasks;
    }

    public void setAssignedTasks(Long assignedTasks) {
        this.assignedTasks = assignedTasks;
        this.activeTasks = assignedTasks == null ? 0L : assignedTasks;
        this.capacity = Math.max(5L, this.activeTasks + 2L);
    }

    public Long getActiveTasks() {
        return activeTasks == null ? 0L : activeTasks;
    }

    public void setActiveTasks(Long activeTasks) {
        this.activeTasks = activeTasks;
        this.assignedTasks = activeTasks;
    }

    public Long getCapacity() {
        return capacity == null ? 5L : capacity;
    }

    public void setCapacity(Long capacity) {
        this.capacity = capacity;
    }
}