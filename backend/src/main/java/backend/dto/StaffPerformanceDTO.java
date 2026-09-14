package backend.dto;

public class StaffPerformanceDTO {

    private Long staffId;
    private String staffName;
    private String name;
    private Long completedTasks;
    private Long resolved;
    private Double efficiency;
    private String status;

    public StaffPerformanceDTO(Long staffId,
                               String staffName,
                               Long completedTasks) {
        this.staffId = staffId;
        this.staffName = staffName;
        this.name = staffName;
        this.completedTasks = completedTasks;
        this.resolved = completedTasks == null ? 0L : completedTasks;
        this.efficiency = this.resolved > 0 ? 100.0 : 0.0;
        this.status = "Active";
    }

    public Long getStaffId() {
        return staffId;
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

    public Long getCompletedTasks() {
        return completedTasks;
    }

    public void setCompletedTasks(Long completedTasks) {
        this.completedTasks = completedTasks;
        this.resolved = completedTasks == null ? 0L : completedTasks;
        this.efficiency = this.resolved > 0 ? 100.0 : 0.0;
    }

    public Long getResolved() {
        return resolved == null ? 0L : resolved;
    }

    public void setResolved(Long resolved) {
        this.resolved = resolved;
    }

    public Double getEfficiency() {
        return efficiency == null ? 0.0 : efficiency;
    }

    public void setEfficiency(Double efficiency) {
        this.efficiency = efficiency;
    }

    public String getStatus() {
        return status == null ? "Active" : status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}