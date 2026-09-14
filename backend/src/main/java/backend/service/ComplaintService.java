package backend.service;

import backend.dto.ComplaintResponseDTO;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import backend.entity.User;
import backend.repository.UserRepository;

import java.util.List;
import backend.entity.Staff;
import backend.entity.Task;
import backend.repository.StaffRepository;
import backend.repository.TaskRepository;

import java.time.LocalDateTime;
import backend.dto.ComplaintRequestDTO;
import backend.entity.Complaint;
import backend.repository.ComplaintRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;



@Service

public class ComplaintService {

@Autowired
private NotificationService notificationService;

@Autowired
private StaffRepository staffRepository;

@Autowired
private TaskRepository taskRepository;
    public void deleteComplaint(Long id) {


Complaint complaint = complaintRepository.findById(id)
        .orElseThrow(() ->
new RuntimeException("Complaint not found"));

complaintRepository.delete(complaint);


}

    public Complaint updateComplaintStatus(Long id, String status) {


Complaint complaint = complaintRepository.findById(id)
        .orElseThrow(() ->
                new RuntimeException("Complaint not found"));

complaint.setStatus(status);

return complaintRepository.save(complaint);


}


    @Autowired
    private final ComplaintRepository complaintRepository;

    private final UserRepository userRepository;

    public ComplaintService(
        ComplaintRepository complaintRepository,
        UserRepository userRepository) {

    this.complaintRepository = complaintRepository;
    this.userRepository = userRepository;
}

    public java.util.List<Complaint> getAllComplaints() {
return complaintRepository.findAll();
}


public Complaint getComplaintById(Long id) {
return complaintRepository.findById(id)
.orElseThrow(() ->
new RuntimeException("Complaint not found"));
}



    
    public Complaint createComplaint(ComplaintRequestDTO dto) {

    Complaint complaint = new Complaint();

Authentication authentication =
        SecurityContextHolder
                .getContext()
                .getAuthentication();

String email = authentication.getName();

User user =
        userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

complaint.setCreatedBy(user);

complaint.setZone(dto.getZone());

complaint.setTitle(dto.getTitle());
complaint.setDescription(dto.getDescription());
complaint.setPhotoUrl(dto.getPhotoUrl());
complaint.setLatitude(dto.getLatitude());
complaint.setLongitude(dto.getLongitude());
complaint.setPriority(dto.getPriority());

complaint.setStatus("PENDING");

    // Save complaint first
    Complaint savedComplaint = complaintRepository.save(complaint);

    // Find available staff
    // Find available staff in same zone
List<Staff> staffList =
        staffRepository.findByZoneAndAvailableTrue(
                complaint.getZone());

if (!staffList.isEmpty()) {

    Staff staff = null;
    long minTasks = Long.MAX_VALUE;

    for (Staff s : staffList) {

        long taskCount =
                taskRepository.countByStaffId(s.getId());

        if (taskCount < minTasks) {

            minTasks = taskCount;
            staff = s;
        }
    }
    Task task = new Task(); 

    task.setComplaintId(savedComplaint.getId());
    task.setStaffId(staff.getId());
    task.setStatus("ASSIGNED");
    task.setAssignedAt(LocalDateTime.now());

    taskRepository.save(task);

    notificationService.createNotification(
        "Complaint #" +
                savedComplaint.getId() +
                " assigned to " +
                staff.getName(),
        "ASSIGNMENT",
        user);

    savedComplaint.setStatus("ASSIGNED");
    complaintRepository.save(savedComplaint);

    notificationService.createNotification(
        "Complaint #" + savedComplaint.getId() + " created",
        "COMPLAINT_CREATED",
        user);

    staff.setAvailable(false);
    staffRepository.save(staff);
}

    return savedComplaint;
    
}

public List<ComplaintResponseDTO> getMyComplaints() {

    Authentication authentication =
            SecurityContextHolder
                    .getContext()
                    .getAuthentication();

    String email = authentication.getName();

    User user =
            userRepository
                    .findByEmail(email)
                    .orElseThrow(() ->
                            new RuntimeException(
                                    "User not found"));

    return complaintRepository
            .findByCreatedBy(user)
            .stream()
            .map(this::convertToDTO)
            .toList();
}


private ComplaintResponseDTO convertToDTO(
        Complaint complaint) {

    ComplaintResponseDTO dto =
            new ComplaintResponseDTO();

    dto.setId(complaint.getId());
    dto.setTitle(complaint.getTitle());
    dto.setDescription(complaint.getDescription());
    dto.setZone(complaint.getZone());
    dto.setPriority(complaint.getPriority());
    dto.setStatus(complaint.getStatus());
    dto.setLatitude(complaint.getLatitude());
    dto.setLongitude(complaint.getLongitude());
    dto.setPhotoUrl(complaint.getPhotoUrl());

    if (complaint.getCreatedBy() != null) {
        dto.setCreatedByName(
                complaint.getCreatedBy().getName()
        );
    }

    return dto;
}
}