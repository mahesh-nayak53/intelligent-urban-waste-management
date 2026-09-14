package backend.service;

import backend.dto.NavigationRouteDTO;
import org.springframework.stereotype.Service;

@Service
public class NavigationService {

    private final TrafficService trafficService;

    public NavigationService(TrafficService trafficService) {
        this.trafficService = trafficService;
    }

    public NavigationRouteDTO getRoute(Double startLatitude, Double startLongitude, Double destinationLatitude, Double destinationLongitude) {
        return trafficService.getOptimalRoute(startLatitude, startLongitude, destinationLatitude, destinationLongitude);
    }

    public NavigationRouteDTO getEta(Double startLatitude, Double startLongitude, Double destinationLatitude, Double destinationLongitude) {
        NavigationRouteDTO route = getRoute(startLatitude, startLongitude, destinationLatitude, destinationLongitude);
        return route;
    }
}
