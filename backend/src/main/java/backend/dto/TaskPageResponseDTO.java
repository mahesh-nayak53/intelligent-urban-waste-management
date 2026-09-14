package backend.dto;

import java.util.List;

public class TaskPageResponseDTO {
    private List<TaskListItemDTO> content;
    private int page;
    private int size;
    private long totalElements;
    private int totalPages;

    public TaskPageResponseDTO(List<TaskListItemDTO> content, int page, int size, long totalElements) {
        this.content = content;
        this.page = page;
        this.size = size;
        this.totalElements = totalElements;
        this.totalPages = size == 0 ? 0 : (int) Math.ceil((double) totalElements / size);
    }

    public List<TaskListItemDTO> getContent() { return content; }
    public int getPage() { return page; }
    public int getSize() { return size; }
    public long getTotalElements() { return totalElements; }
    public int getTotalPages() { return totalPages; }
}
