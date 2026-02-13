import "leaflet/dist/leaflet.css";
import "./App.css";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

export default function App() {
  const center = { lat: 51.505, lng: -0.09 };

  return (
    <div className="page">
      <div className="mapWrap">
        <MapContainer
          center={center}
          zoom={13}
          scrollWheelZoom={false}
          preferCanvas
        >
          <TileLayer
            // Faster than the default OSM tile host for many people
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors &copy; CARTO"
            detectRetina
            updateWhenIdle
          />

          <Marker position={center}>
            <Popup>
              A pretty CSS3 popup. <br /> Easily customizable.
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
}
