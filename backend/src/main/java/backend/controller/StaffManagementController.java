package backend.controller;

import backend.dto.StaffAvailabilityDTO;
import backend.dto.StaffListItemDTO;
import backend.dto.StaffManagementRequestDTO;
import backend.dto.StaffPageResponseDTO;
import backend.dto.StaffProfileDTO;
import backend.service.StaffManagementService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/staff-management")
public class StaffManagementController {
    private final StaffManagementService staffManagementService;

    public StaffManagementController(StaffManagementService staffManagementService) {
        this.staffManagementService = staffManagementService;
    }

    @GetMapping("/staff")
    public StaffPageResponseDTO listStaff(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String department,
            @RequestParam(required = false) String zone,
            @RequestParam(required = false) Boolean available,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDirection) {
        return staffManagementService.listStaff(search, department, zone, available, page, size, sortBy, sortDirection);
    }

    @GetMapping("/staff/{staffId}")
    public StaffProfileDTO getProfile(@PathVariable Long staffId) {
        return staffManagementService.getProfile(staffId);
    }

    @PostMapping("/staff")
    public StaffListItemDTO createStaff(@Valid @RequestBody StaffManagementRequestDTO request) {
        return staffManagementService.createStaff(request);
    }

    @PutMapping("/staff/{staffId}")
    public StaffListItemDTO updateStaff(@PathVariable Long staffId, @Valid @RequestBody StaffManagementRequestDTO request) {
        return staffManagementService.updateStaff(staffId, request);
    }

    @PutMapping("/staff/{staffId}/availability")
    public StaffListItemDTO updateAvailability(@PathVariable Long staffId, @Valid @RequestBody StaffAvailabilityDTO request) {
        return staffManagementService.updateAvailability(staffId, request);
    }
}
