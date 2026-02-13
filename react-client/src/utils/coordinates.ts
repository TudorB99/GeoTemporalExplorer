import type { LatLng, Stop } from "../types/index_types";

/** Uniform random point in a circle around center (same as you had) */
export function randomPointAround(
  center: LatLng,
  radiusMeters: number,
): LatLng {
  const r = radiusMeters * Math.sqrt(Math.random());
  const theta = Math.random() * 2 * Math.PI;

  const dx = r * Math.cos(theta);
  const dy = r * Math.sin(theta);

  const metersPerDegLat = 111_320;
  const dLat = dy / metersPerDegLat;
  const dLng = dx / (metersPerDegLat * Math.cos((center.lat * Math.PI) / 180));

  return { lat: center.lat + dLat, lng: center.lng + dLng };
}

/** Approx distance in meters (good enough for small-ish distances) */
function distanceMeters(a: LatLng, b: LatLng): number {
  const metersPerDegLat = 111_320;
  const avgLatRad = ((a.lat + b.lat) / 2) * (Math.PI / 180);

  const dx = (b.lng - a.lng) * metersPerDegLat * Math.cos(avgLatRad);
  const dy = (b.lat - a.lat) * metersPerDegLat;
  return Math.sqrt(dx * dx + dy * dy);
}

function isWithinRadius(
  p: LatLng,
  center: LatLng,
  radiusMeters: number,
): boolean {
  return distanceMeters(p, center) <= radiusMeters;
}

type GenerateStopsOptions = {
  /** How far the route is allowed to drift from the center */
  maxRadiusMeters: number;

  /**
   * Typical step between consecutive stops.
   * Smaller = tighter clusters, larger = more spread.
   */
  stepMeters?: number;

  /**
   * Every N stops, jump to a new "neighborhood" (0/undefined disables).
   * This makes it feel more like real delivery routes with clusters.
   */
  jumpEvery?: number;

  /** How far a jump can land from the center (defaults to maxRadiusMeters) */
  jumpRadiusMeters?: number;

  /** Max attempts to find a point within bounds before giving up */
  maxTries?: number;
};

/**
 * Generates stops in a correlated sequence:
 * stop[i+1] is usually near stop[i], with optional periodic jumps.
 *
 * Backwards compatible signature:
 * generateStops(center, count, radiusMeters)
 */
export function generateStops(
  center: LatLng,
  count: number,
  radiusMeters: number,
  options?: Omit<GenerateStopsOptions, "maxRadiusMeters">,
): Stop[] {
  const cfg: Required<GenerateStopsOptions> = {
    maxRadiusMeters: radiusMeters,
    stepMeters: options?.stepMeters ?? Math.max(80, radiusMeters / 25), // sensible default
    jumpEvery: options?.jumpEvery ?? 20, // tweak this (or set to 0)
    jumpRadiusMeters: options?.jumpRadiusMeters ?? radiusMeters,
    maxTries: options?.maxTries ?? 25,
  };

  if (count <= 0) return [];

  // First stop anywhere within bounds
  let current = randomPointAround(center, cfg.jumpRadiusMeters);

  const stops: Stop[] = [{ ...current, id: "stop-0" }];

  for (let i = 1; i < count; i++) {
    const shouldJump = cfg.jumpEvery > 0 && i % cfg.jumpEvery === 0;

    let next: LatLng | null = null;

    for (let attempt = 0; attempt < cfg.maxTries; attempt++) {
      const candidate = shouldJump
        ? randomPointAround(center, cfg.jumpRadiusMeters)
        : randomPointAround(current, cfg.stepMeters * (0.6 + Math.random())); // add some variance

      if (isWithinRadius(candidate, center, cfg.maxRadiusMeters)) {
        next = candidate;
        break;
      }
    }

    // Fallback: if we failed to find a bounded point, just reset with a jump
    if (!next) next = randomPointAround(center, cfg.jumpRadiusMeters);

    current = next;
    stops.push({ ...current, id: `stop-${i}` });
  }

  return stops;
}
