package backend.service;

import backend.dto.WorkerRequestDTO;
import backend.entity.Worker;
import backend.repository.WorkerRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WorkerService {

    private final WorkerRepository workerRepository;

    public WorkerService(WorkerRepository workerRepository) {
        this.workerRepository = workerRepository;
    }

    public Worker createWorker(WorkerRequestDTO request) {
        Worker worker = new Worker();
        worker.setName(request.getName());
        worker.setEmail(request.getEmail());
        worker.setPhone(request.getPhone());
        worker.setDepartment(request.getDepartment());
        worker.setZone(request.getZone());
        worker.setAvailability(request.getAvailability() != null ? request.getAvailability() : true);
        worker.setCurrentLatitude(request.getCurrentLatitude());
        worker.setCurrentLongitude(request.getCurrentLongitude());
        return workerRepository.save(worker);
    }

    public List<Worker> getWorkers() {
        return workerRepository.findAll();
    }

    public Worker getWorker(Long id) {
        return workerRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Worker not found with id: " + id));
    }

    public Worker updateWorker(Long id, WorkerRequestDTO request) {
        Worker worker = getWorker(id);
        worker.setName(request.getName());
        worker.setEmail(request.getEmail());
        worker.setPhone(request.getPhone());
        worker.setDepartment(request.getDepartment());
        worker.setZone(request.getZone());
        worker.setAvailability(request.getAvailability() != null ? request.getAvailability() : worker.getAvailability());
        worker.setCurrentLatitude(request.getCurrentLatitude());
        worker.setCurrentLongitude(request.getCurrentLongitude());
        return workerRepository.save(worker);
    }

    public void deleteWorker(Long id) {
        Worker worker = getWorker(id);
        workerRepository.delete(worker);
    }
}
