package backend.dto;

public class ComplaintStatusDTO {

    private String status;
    private String name;
    private Long count;
    private Long value;

    public ComplaintStatusDTO(String status, Long count) {
        this.status = status;
        this.name = status;
        this.count = count;
        this.value = count;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
        this.name = status;
    }

    public String getName() {
        return name != null ? name : status;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getCount() {
        return count;
    }

    public void setCount(Long count) {
        this.count = count;
        this.value = count;
    }

    public Long getValue() {
        return value != null ? value : count;
    }

    public void setValue(Long value) {
        this.value = value;
        this.count = value;
    }
}