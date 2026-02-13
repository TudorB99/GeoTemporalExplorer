import type { LatLng, Stop } from "../types/index_types";

export function randomPointAround(
  center: LatLng,
  radiusMeters: number,
): LatLng {
  // Uniform distribution over the area of a circle
  const r = radiusMeters * Math.sqrt(Math.random());
  const theta = Math.random() * 2 * Math.PI;

  const dx = r * Math.cos(theta);
  const dy = r * Math.sin(theta);

  // meters -> degrees
  const metersPerDegLat = 111_320;
  const dLat = dy / metersPerDegLat;
  const dLng = dx / (metersPerDegLat * Math.cos((center.lat * Math.PI) / 180));

  return { lat: center.lat + dLat, lng: center.lng + dLng };
}

export function generateStops(
  center: LatLng,
  count: number,
  radiusMeters: number,
): Stop[] {
  return Array.from({ length: count }, (_, i) => {
    const p = randomPointAround(center, radiusMeters);
    return { ...p, id: `stop-${i}` };
  });
}
