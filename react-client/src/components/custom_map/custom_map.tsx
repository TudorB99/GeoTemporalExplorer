import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import type { FC } from "react";
import "./custom_map.css";
const CustomMap: FC = () => {
  const center = { lat: 53.8008, lng: -1.5491 };
  return (
    <div className="mapWrap">
      <MapContainer
        center={center}
        zoom={13}
        scrollWheelZoom={false}
        preferCanvas
      >
        <TileLayer
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
  );
};

export default CustomMap;
