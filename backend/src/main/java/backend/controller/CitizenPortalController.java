package backend.controller;

import backend.dto.CitizenComplaintDTO;
import backend.dto.CitizenDashboardDTO;
import backend.dto.CitizenProfileDTO;
import backend.dto.CitizenProfileUpdateDTO;
import backend.service.CitizenPortalService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/citizen-portal")
public class CitizenPortalController {
    private final CitizenPortalService citizenPortalService;

    public CitizenPortalController(CitizenPortalService citizenPortalService) {
        this.citizenPortalService = citizenPortalService;
    }

    @GetMapping("/dashboard")
    public CitizenDashboardDTO getDashboard() {
        return citizenPortalService.getDashboard();
    }

    @GetMapping("/complaints/{complaintId}")
    public CitizenComplaintDTO getComplaint(@PathVariable Long complaintId) {
        return citizenPortalService.getComplaint(complaintId);
    }

    @GetMapping("/profile")
    public CitizenProfileDTO getProfile() {
        return citizenPortalService.getProfile();
    }

    @PutMapping("/profile")
    public CitizenProfileDTO updateProfile(@Valid @RequestBody CitizenProfileUpdateDTO request) {
        return citizenPortalService.updateProfile(request);
    }
}
