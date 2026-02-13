import { useMemo, type FC } from "react";
import { CircleMarker, Polyline, Popup } from "react-leaflet";
import { generateStops } from "../../utils/coordinates";
import type { LatLng } from "../../types/index_types";

export const DeliveryLayer: FC<{ center: LatLng }> = ({ center }) => {
  const stops = useMemo(
    () =>
      generateStops(center, 100, 4500, {
        stepMeters: 200, // tighter = more "same neighborhood"
        jumpEvery: 25, // set to 0 if you want no jumps at all
      }),
    [center],
  );

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

      <Polyline positions={routePositions} />
    </>
  );
};
