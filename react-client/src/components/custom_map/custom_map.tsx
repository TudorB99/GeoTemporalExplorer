import "./custom_map.css";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer } from "react-leaflet";
import type { FC } from "react";
import { DeliveryLayer } from "../delivery_layer/delivery_layer";

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
          url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
          attribution="&copy; OpenStreetMap contributors &copy; Stadia Maps"
          maxZoom={20}
        />

        <DeliveryLayer center={center} />
      </MapContainer>
    </div>
  );
};

export default CustomMap;
