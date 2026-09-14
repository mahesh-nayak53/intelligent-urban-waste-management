package backend.controller;

import backend.dto.TaskRequestDTO;
import backend.entity.Task;
import backend.service.TaskService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {
    @PutMapping("/{taskId}/complete")
public Task completeTask(@PathVariable Long taskId) {
    return taskService.completeTask(taskId);
}
    

@GetMapping("/staff/{staffId}")
public java.util.List<Task> getTasksByStaffId(
@PathVariable Long staffId) {


return taskService.getTasksByStaffId(staffId);



}

@Autowired
private TaskService taskService;

@PostMapping
public Task createTask(@Valid @RequestBody TaskRequestDTO taskRequestDTO) {
    return taskService.createTask(taskRequestDTO);
}


}
