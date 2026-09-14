package backend.controller;

import backend.dto.NavigationRouteDTO;
import backend.service.NavigationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/navigation")
public class NavigationController {

    private final NavigationService navigationService;

    public NavigationController(NavigationService navigationService) {
        this.navigationService = navigationService;
    }

    @GetMapping("/route")
    public ResponseEntity<NavigationRouteDTO> route(
            @RequestParam Double startLatitude,
            @RequestParam Double startLongitude,
            @RequestParam Double destinationLatitude,
            @RequestParam Double destinationLongitude) {
        return ResponseEntity.ok(navigationService.getRoute(startLatitude, startLongitude, destinationLatitude, destinationLongitude));
    }

    @GetMapping("/eta")
    public ResponseEntity<NavigationRouteDTO> eta(
            @RequestParam Double startLatitude,
            @RequestParam Double startLongitude,
            @RequestParam Double destinationLatitude,
            @RequestParam Double destinationLongitude) {
        return ResponseEntity.ok(navigationService.getEta(startLatitude, startLongitude, destinationLatitude, destinationLongitude));
    }
}
