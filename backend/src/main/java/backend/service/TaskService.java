package backend.service;

import java.util.List;
import java.time.LocalDateTime;

import backend.entity.Complaint;
import backend.repository.ComplaintRepository;
import backend.entity.Staff;
import backend.repository.StaffRepository;
import backend.dto.TaskRequestDTO;
import backend.entity.Task;
import backend.repository.TaskRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;


@Service
public class TaskService {

@Autowired
private NotificationService notificationService;

@Autowired
private ComplaintRepository complaintRepository;

@Autowired
private TaskRepository taskRepository;

@Autowired
private StaffRepository staffRepository;

public List<Task> getTasksByStaffId(Long staffId) {
return taskRepository.findByStaffId(staffId);
}

public Task completeTask(Long taskId) {

    Task task = taskRepository.findById(taskId)
            .orElseThrow(() -> new RuntimeException("Task not found"));

    task.setStatus("COMPLETED");
    task.setCompletedAt(LocalDateTime.now());

    Complaint complaint = complaintRepository.findById(task.getComplaintId()).orElse(null);

    if (complaint != null) {
        complaint.setStatus("RESOLVED");
        notificationService.createNotification(
            "Complaint #" +
                    complaint.getId() +
                    " resolved",
            "RESOLVED",
            complaint.getCreatedBy());
        complaintRepository.save(complaint);
    }

// Make staff available again
Staff staff = staffRepository.findById(task.getStaffId())
        .orElseThrow(() -> new RuntimeException("Staff not found"));

staff.setAvailable(true);

staffRepository.save(staff);

notificationService.createNotification(
        "Staff " +
                staff.getName() +
                " became available",
        "STAFF_AVAILABLE");

return taskRepository.save(task);
}

public Task createTask(TaskRequestDTO taskRequestDTO) {

    Task task = new Task();

    task.setComplaintId(taskRequestDTO.getComplaintId());
    task.setStaffId(taskRequestDTO.getStaffId());
    task.setStatus(taskRequestDTO.getStatus());
    task.setAssignedAt(LocalDateTime.now());

    return taskRepository.save(task);
}


}



