import {
  MapContainer,
  Marker,
  Popup,
  Polyline,
  TileLayer,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const workerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const complaintIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function FreeRouteMap({ start, destination, route }) {
  const startLatitude = Number(start?.latitude || 12.9716);
  const startLongitude = Number(start?.longitude || 77.5946);

  const destinationLatitude = Number(destination?.latitude || 12.9838);
  const destinationLongitude = Number(destination?.longitude || 77.5878);

  const center = [
    (startLatitude + destinationLatitude) / 2,
    (startLongitude + destinationLongitude) / 2,
  ];

  let polyline = [
    [startLatitude, startLongitude],
    [destinationLatitude, destinationLongitude],
  ];

  if (
    route?.polyline &&
    typeof route.polyline === "string" &&
    route.polyline.startsWith("[")
  ) {
    try {
      polyline = JSON.parse(route.polyline);
    } catch {
      polyline = [
        [startLatitude, startLongitude],
        [destinationLatitude, destinationLongitude],
      ];
    }
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-4 py-4 sm:px-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
            Route tracking
          </p>

          <h2 className="mt-1 text-lg font-bold text-slate-900">
            Worker route
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Live route between the worker and complaint location.
          </p>
        </div>
      </div>

      <div className="h-[300px] w-full sm:h-[360px] lg:h-[420px]">
        <MapContainer
          center={center}
          zoom={13}
          scrollWheelZoom
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <Marker position={[startLatitude, startLongitude]} icon={workerIcon}>
            <Popup>
              <div className="text-sm">
                <strong>Worker location</strong>
              </div>
            </Popup>
          </Marker>

          <Marker
            position={[destinationLatitude, destinationLongitude]}
            icon={complaintIcon}
          >
            <Popup>
              <div className="text-sm">
                <strong>Complaint location</strong>
              </div>
            </Popup>
          </Marker>

          <Polyline
            positions={polyline}
            color="#10b981"
            weight={5}
            opacity={0.8}
          />
        </MapContainer>
      </div>
    </div>
  );
}

export default FreeRouteMap;
