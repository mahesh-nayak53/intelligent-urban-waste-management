package backend.dto;

import java.util.List;

public class StaffPageResponseDTO {
    private List<StaffListItemDTO> content;
    private int page;
    private int size;
    private long totalElements;
    private int totalPages;

    public StaffPageResponseDTO(List<StaffListItemDTO> content, int page, int size, long totalElements) {
        this.content = content; this.page = page; this.size = size; this.totalElements = totalElements;
        this.totalPages = size == 0 ? 0 : (int) Math.ceil((double) totalElements / size);
    }
    public List<StaffListItemDTO> getContent() { return content; }
    public int getPage() { return page; }
    public int getSize() { return size; }
    public long getTotalElements() { return totalElements; }
    public int getTotalPages() { return totalPages; }
}
