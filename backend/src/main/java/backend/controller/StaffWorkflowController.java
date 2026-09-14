package backend.controller;

import backend.dto.DispatchAssignmentRequestDTO;
import backend.dto.StaffAssignedComplaintDTO;
import backend.dto.StaffAssignedTaskDTO;
import backend.dto.StaffAvailabilityDTO;
import backend.dto.StaffComplaintDetailDTO;
import backend.dto.StaffListItemDTO;
import backend.dto.StaffProfileDTO;
import backend.dto.TaskNoteDTO;
import backend.dto.TaskStatusUpdateDTO;
import backend.entity.Complaint;
import backend.service.StaffWorkflowService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/staff-workflow")
public class StaffWorkflowController {
    private final StaffWorkflowService staffWorkflowService;

    public StaffWorkflowController(StaffWorkflowService staffWorkflowService) {
        this.staffWorkflowService = staffWorkflowService;
    }

    @GetMapping("/me/profile")
    public StaffProfileDTO profile(Authentication authentication) {
        return staffWorkflowService.getProfile(authentication);
    }

    @GetMapping("/me/tasks")
    public List<StaffAssignedTaskDTO> tasks(Authentication authentication) {
        return staffWorkflowService.getTasks(authentication);
    }

    @GetMapping("/me/complaints")
    public List<StaffAssignedComplaintDTO> complaints(Authentication authentication) {
        return staffWorkflowService.getComplaints(authentication);
    }

    @GetMapping("/tasks/{taskId}/complaint")
    public StaffComplaintDetailDTO complaint(Authentication authentication, @PathVariable Long taskId) {
        return staffWorkflowService.getComplaint(authentication, taskId);
    }

    @PutMapping("/tasks/{taskId}/status")
    public StaffAssignedTaskDTO status(Authentication authentication, @PathVariable Long taskId,
            @Valid @RequestBody TaskStatusUpdateDTO request) {
        return staffWorkflowService.updateStatus(authentication, taskId, request);
    }

    @PostMapping("/tasks/{taskId}/notes")
    public StaffAssignedTaskDTO notes(Authentication authentication, @PathVariable Long taskId,
            @RequestBody TaskNoteDTO request) {
        return staffWorkflowService.updateNotes(authentication, taskId, request);
    }

    @PutMapping("/me/availability")
    public StaffListItemDTO availability(Authentication authentication,
            @Valid @RequestBody StaffAvailabilityDTO request) {
        return staffWorkflowService.updateAvailability(authentication, request);
    }

    @GetMapping("/dispatch/queue")
    public List<Complaint> dispatchQueue() {
        return staffWorkflowService.dispatchQueue();
    }

    @GetMapping("/dispatch/team")
    public List<StaffListItemDTO> dispatchTeam(@RequestParam(required = false) String zone) {
        return staffWorkflowService.dispatchTeam(zone);
    }

    @PostMapping("/dispatch/assign")
    public StaffAssignedTaskDTO assignTask(@Valid @RequestBody DispatchAssignmentRequestDTO request) {
        return staffWorkflowService.assignTask(request);
    }
}