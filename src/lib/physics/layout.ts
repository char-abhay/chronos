import { projectsOrdered, skillGroups, getProject } from "@/content";
import { toMonthIndex } from "@/lib/format/timeline";
import { seeded } from "@/lib/physics/random";
import type { Vec3 } from "@/lib/physics/space";

/**
 * The record, as geometry.
 *
 * Pure data and pure functions -- no React, no three.js, exactly like
 * space.ts and format/timeline.ts beside it. The renderer is one consumer
 * of these numbers; they can be read, checked and argued about without a
 * GPU anywhere in the picture.
 *
 * The rule this module exists to enforce: every position, size and speed
 * in the world is DERIVED from content, never hand-placed to look good.
 * When dVoting turns out to be the largest and slowest body in the solar
 * system, that is arithmetic on its own technology and functionality
 * lists -- not an assertion that it is the best project.
 *
 * All coordinates are LOCAL to a region anchor. The scene translates.
 */

const TAU = Math.PI * 2;

/* ============================================================
   SOLAR SYSTEM -- the five builds
   ============================================================ */

export type OrbitBody = {
  slug: string;
  name: string;
  /** Distance from the region centre. */
  radius: number;
  /** Sphere radius. */
  size: number;
  /** Radians per second. */
  speed: number;
  /** Starting angle, so they never line up. */
  phase: number;
  /** Orbital plane tilt, in radians. */
  tilt: number;
  /** dVoting -- the one Abhay leads with, and the only one with a repo. */
  featured: boolean;
};

const ORBIT_MIN = 6;
const ORBIT_MAX = 22;
const BODY_MIN = 0.55;
const BODY_MAX = 1.5;

/**
 * Chronology becomes distance: the earliest build sits innermost, the
 * most recent furthest out. Reading outward is reading forward in time,
 * which is the direction the whole site travels.
 */
export const solarSystem: OrbitBody[] = (() => {
  const random = seeded(0x50524a53); // "PRJS"

  const starts = projectsOrdered.map((p) => toMonthIndex(p.dates.start, "start"));
  const earliest = Math.min(...starts);
  const latest = Math.max(...starts);
  const chronoSpan = Math.max(1, latest - earliest);

  const weights = projectsOrdered.map(
    (p) => p.technologies.length + p.functionality.length
  );
  const lightest = Math.min(...weights);
  const heaviest = Math.max(...weights);
  const weightSpan = Math.max(1, heaviest - lightest);

  return projectsOrdered.map((project, i) => {
    const start = starts[i];
    const end = toMonthIndex(project.dates.end ?? project.dates.start, "end");

    // A single-month build still occupies one month, not zero.
    const months = Math.max(1, end - start + 1);

    // How much of it there is to describe, as a proxy for mass.
    const weight = (weights[i] - lightest) / weightSpan;

    return {
      slug: project.slug,
      name: project.name,
      radius:
        ORBIT_MIN + ((start - earliest) / chronoSpan) * (ORBIT_MAX - ORBIT_MIN),
      size: BODY_MIN + weight * (BODY_MAX - BODY_MIN),
      // The longer it took to build, the slower it turns.
      speed: 0.16 / (0.7 + months * 0.32),
      phase: random() * TAU,
      tilt: (random() - 0.5) * 0.42,
      featured: project.featured === true,
    };
  });
})();

/* ============================================================
   GALAXY -- six clusters, and the six edges the data supports
   ============================================================ */

export type ClusterNode = {
  id: string;
  label: string;
  position: Vec3;
  /** One bright point per skill in the cluster. */
  skills: number;
  /** Radius of the cluster's own small cloud. */
  spread: number;
  /** True when relatedProjects is empty -- four of the six. */
  isolated: boolean;
};

export type ProjectNode = {
  slug: string;
  position: Vec3;
  featured: boolean;
};

export type Edge = {
  clusterId: string;
  slug: string;
  from: Vec3;
  to: Vec3;
};

const CLUSTER_RING = 21;
const PROJECT_RING = 8;

/**
 * Clusters on an outer ring, the builds they touch on an inner one, and
 * a line for every edge the content actually authorises.
 *
 * Only `web` and `concepts` carry relatedProjects, so only two of the six
 * clusters have lines running inward. That asymmetry is the honest shape
 * of the record -- skills.ts allows an edge only where the project's own
 * technology list supports it -- and it has to read as a fact, never as a
 * cluster that failed to load.
 */
function buildGalaxy() {
  const random = seeded(0x534b4c53); // "SKLS"

  const clusters: ClusterNode[] = skillGroups.map((group, i) => {
    const angle = (i / skillGroups.length) * TAU + random() * 0.22;
    const lift = (random() - 0.5) * 7;
    return {
      id: group.id,
      label: group.label,
      position: [
        Math.cos(angle) * CLUSTER_RING,
        lift,
        Math.sin(angle) * CLUSTER_RING,
      ] as Vec3,
      skills: group.items.length,
      spread: 1.1 + group.items.length * 0.28,
      isolated: (group.relatedProjects?.length ?? 0) === 0,
    };
  });

  const projects: ProjectNode[] = projectsOrdered.map((project, i) => {
    const angle = (i / projectsOrdered.length) * TAU + 0.6;
    return {
      slug: project.slug,
      position: [
        Math.cos(angle) * PROJECT_RING,
        (random() - 0.5) * 2.4,
        Math.sin(angle) * PROJECT_RING,
      ] as Vec3,
      featured: project.featured === true,
    };
  });

  const edges: Edge[] = skillGroups.flatMap((group) =>
    (group.relatedProjects ?? []).flatMap((slug) => {
      const from = clusters.find((c) => c.id === group.id);
      const to = projects.find((p) => p.slug === slug);
      // A slug that no longer matches a project draws nothing rather
      // than throwing: content stays editable without breaking the scene.
      if (!from || !to) return [];
      return [{ clusterId: group.id, slug, from: from.position, to: to.position }];
    })
  );

  return { clusters, projects, edges };
}

export const galaxy = buildGalaxy();

/* ============================================================
   BLACK HOLES -- dVoting's four challenges, as an accretion disk
   ============================================================ */

export type DiskBand = {
  title: string;
  inner: number;
  outer: number;
  /** Radians per second. Inner bands move faster. */
  speed: number;
  /** Particles in this band, at full tier. */
  density: number;
};

export const VOID_RADIUS = 3.4;

/**
 * Four bands, one per challenge, in the order they are written. A band's
 * width comes from the length of the problem description: the harder a
 * thing was to explain, the more room it takes up.
 *
 * Every band belongs to dVoting -- the only project in the dataset with
 * challenges recorded, which is what the page says too.
 */
export const blackHoles: DiskBand[] = (() => {
  const challenges = getProject("dvoting")?.challenges ?? [];
  if (challenges.length === 0) return [];

  const lengths = challenges.map((c) => c.body.length);
  const shortest = Math.min(...lengths);
  const longest = Math.max(...lengths);
  const span = Math.max(1, longest - shortest);

  let cursor = VOID_RADIUS + 1.2;

  return challenges.map((challenge, i) => {
    const weight = (lengths[i] - shortest) / span;
    const width = 1.5 + weight * 2.6;
    const inner = cursor;
    const outer = inner + width;
    cursor = outer + 0.75;
    return {
      title: challenge.title,
      inner,
      outer,
      // Closer in, faster round -- the one piece of real orbital
      // mechanics in the world, because here it is legible.
      speed: 0.5 / Math.pow(inner, 0.85),
      density: Math.round(340 + width * 190),
    };
  });
})();

/** Where the disk ends, so the scene can size its glow against it. */
export const DISK_OUTER =
  blackHoles.length > 0 ? blackHoles[blackHoles.length - 1].outer : VOID_RADIUS;
