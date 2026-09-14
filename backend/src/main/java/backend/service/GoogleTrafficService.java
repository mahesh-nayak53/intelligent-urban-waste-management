package backend.service;

import backend.dto.NavigationRouteDTO;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

@Service
public class GoogleTrafficService implements TrafficService {

    private final HttpClient httpClient = HttpClient.newHttpClient();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public NavigationRouteDTO getOptimalRoute(Double startLatitude, Double startLongitude, Double destinationLatitude, Double destinationLongitude) {
        if (startLatitude == null || startLongitude == null || destinationLatitude == null || destinationLongitude == null) {
            throw new IllegalArgumentException("Route coordinates are required");
        }

        try {
            String url = String.format(
                    "https://router.project-osrm.org/route/v1/driving/%s,%s;%s,%s?overview=false&geometries=geojson",
                    startLongitude,
                    startLatitude,
                    destinationLongitude,
                    destinationLatitude
            );

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .header("Accept", "application/json")
                    .GET()
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() >= 400) {
                throw new IllegalStateException("Free route service request failed with status: " + response.statusCode());
            }

            JsonNode root = objectMapper.readTree(response.body());
            JsonNode routeNode = root.path("routes").get(0);
            if (routeNode == null || routeNode.isMissingNode()) {
                throw new IllegalStateException("No route returned by the free routing service.");
            }

            double distanceKm = routeNode.path("distance").asDouble() / 1000.0;
            int etaMinutes = Math.max(1, (int) Math.round(routeNode.path("duration").asDouble() / 60.0));
            String geometry = routeNode.path("geometry").toString();

            return new NavigationRouteDTO(
                    startLatitude + "," + startLongitude,
                    destinationLatitude + "," + destinationLongitude,
                    "driving",
                    Math.round(distanceKm * 10.0) / 10.0,
                    etaMinutes,
                    geometry
            );
        } catch (Exception e) {
            throw new IllegalStateException("Unable to calculate a free route via OSRM. Please check the route coordinates.", e);
        }
    }
}
