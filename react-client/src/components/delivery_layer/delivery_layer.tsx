import { useMemo, type FC } from "react";
import { CircleMarker, Polyline, Popup } from "react-leaflet";
import { generateStops } from "../../utils/coordinates";
import type { LatLng } from "../../types/index_types";

export const DeliveryLayer: FC<{ center: LatLng }> = ({ center }) => {
  const stops = useMemo(() => generateStops(center, 250, 4500), [center]); // 250 points within 4.5km

  const routePositions = useMemo(
    () => stops.map((s) => [s.lat, s.lng] as [number, number]),
    [stops],
  );

  return (
    <>
      {stops.map((s, idx) => (
        <CircleMarker
          key={s.id}
          center={[s.lat, s.lng]}
          radius={5}
          pathOptions={{ weight: 1, fillOpacity: 1 }}
        >
          <Popup>Delivery stop #{idx + 1}</Popup>
        </CircleMarker>
      ))}

      {/* OPTIONAL: draw a route */}
      <Polyline positions={routePositions} />
    </>
  );
};
