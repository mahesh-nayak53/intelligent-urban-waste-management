package backend.controller;

import backend.dto.WorkerRequestDTO;
import backend.entity.Worker;
import backend.service.WorkerService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/workers")
public class WorkerController {

    private final WorkerService workerService;

    public WorkerController(WorkerService workerService) {
        this.workerService = workerService;
    }

    @PostMapping
    public ResponseEntity<Worker> createWorker(@Valid @RequestBody WorkerRequestDTO request) {
        return ResponseEntity.ok(workerService.createWorker(request));
    }

    @GetMapping
    public ResponseEntity<List<Worker>> getWorkers() {
        return ResponseEntity.ok(workerService.getWorkers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Worker> getWorker(@PathVariable Long id) {
        return ResponseEntity.ok(workerService.getWorker(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Worker> updateWorker(@PathVariable Long id, @Valid @RequestBody WorkerRequestDTO request) {
        return ResponseEntity.ok(workerService.updateWorker(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteWorker(@PathVariable Long id) {
        workerService.deleteWorker(id);
        return ResponseEntity.noContent().build();
    }
}
