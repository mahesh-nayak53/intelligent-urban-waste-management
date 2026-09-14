package backend.controller;

import backend.dto.ComplaintResponseDTO;
import java.util.List;

import backend.dto.ComplaintRequestDTO;
import backend.entity.Complaint;
import backend.service.ComplaintService;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;


    @RestController
    @RequestMapping("/api/complaints")


    public class ComplaintController {

    @GetMapping
    public java.util.List<Complaint> getAllComplaints() {
    return complaintService.getAllComplaints();
    }

    @GetMapping("/{id}")
    public Complaint getComplaintById(@PathVariable Long id) {
    return complaintService.getComplaintById(id);
    }

    @DeleteMapping("/{id}")
    public String deleteComplaint(@PathVariable Long id) {


    complaintService.deleteComplaint(id);

    return "Complaint deleted successfully";


    }

@PutMapping("/{id}/status")
public Complaint updateComplaintStatus(
@PathVariable Long id,
@RequestParam String status) {


return complaintService.updateComplaintStatus(id, status);


}
     @Autowired
    private ComplaintService complaintService;

    @PostMapping
    public Complaint createComplaint(
    @Valid @RequestBody ComplaintRequestDTO complaintDTO) {

        return complaintService.createComplaint(complaintDTO);
    }

    @GetMapping("/my")
    public List<ComplaintResponseDTO> getMyComplaints() {

    return complaintService.getMyComplaints();
}

}