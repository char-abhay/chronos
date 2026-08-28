import type { DestinationId } from "@/content/schema";

/**
 * The shape of the world.
 *
 * Pure data and pure functions -- no React, no three.js. Same rule as
 * lib/format/timeline.ts: the geometry of the universe is describable on
 * its own, and the renderer is just one consumer of it.
 *
 * Eight regions sit at fixed anchors along one outward path. Because
 * they are all in a single coordinate space, moving between routes is a
 * camera move rather than a scene swap -- which is the whole reason the
 * canvas never unmounts.
 *
 * Depth (-Z) tracks the scale metaphor in content/destinations.ts: Home
 * is the origin, Future is the furthest thing out, and Story sits high
 * above the path looking back down at all of it.
 */
export type Vec3 = readonly [number, number, number];

export type Pose = {
  /** Where the camera sits. */
  position: Vec3;
  /** What it looks at -- normally the region anchor. */
  target: Vec3;
  fov: number;
};

/** The centre of each region, in world units. */
export const anchors: Record<DestinationId, Vec3> = {
  home: [0, 0, 0],
  time: [0, 0, -60],
  earth: [40, -10, -140],
  "solar-system": [-60, 5, -260],
  galaxy: [90, 30, -430],
  "black-holes": [-40, -30, -640],
  future: [10, 60, -860],
  story: [0, 120, -420],
};

/**
 * Camera poses. Each is written out rather than derived, because the
 * framing of a region is an art-direction decision, not arithmetic --
 * Black Holes is approached from below, Future from far back so the
 * emptiness reads, Story from above so the whole path is visible.
 */
export const poses: Record<DestinationId, Pose> = {
  home: { position: [0, 2, 24], target: [0, 0, -20], fov: 55 },
  time: { position: [0, 4, -20], target: [0, 0, -70], fov: 50 },
  earth: { position: [46, -4, -100], target: [40, -10, -145], fov: 45 },
  "solar-system": { position: [-52, 22, -200], target: [-60, 0, -265], fov: 50 },
  galaxy: { position: [88, 40, -360], target: [90, 26, -440], fov: 55 },
  "black-holes": { position: [-38, -46, -570], target: [-40, -28, -645], fov: 40 },
  future: { position: [10, 62, -790], target: [10, 60, -880], fov: 60 },
  story: { position: [0, 150, -280], target: [0, 40, -520], fov: 65 },
};

/** Home is the fallback for any route that is not a region (/projects, /contact). */
export const DEFAULT_DESTINATION: DestinationId = "home";

/**
 * Distance between two anchors, used to scale traversal duration: a hop
 * from Home to Time should not take as long as Home to Future.
 */
export function distance(a: Vec3, b: Vec3): number {
  const dx = a[0] - b[0];
  const dy = a[1] - b[1];
  const dz = a[2] - b[2];
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

/** The longest hop in the world, so traversal time can be normalised against it. */
export const MAX_TRAVERSAL = distance(anchors.home, anchors.future);
