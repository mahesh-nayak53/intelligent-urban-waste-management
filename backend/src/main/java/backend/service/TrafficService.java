package backend.service;

import backend.dto.NavigationRouteDTO;

public interface TrafficService {
    NavigationRouteDTO getOptimalRoute(Double startLatitude, Double startLongitude, Double destinationLatitude, Double destinationLongitude);
}
