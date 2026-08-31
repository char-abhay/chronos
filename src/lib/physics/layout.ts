import {
  destinations,
  education,
  experience,
  getProject,
  isKnown,
  projectsOrdered,
  skillGroups,
  storySegments,
  subjects,
} from "@/content";
import { AXIS_MONTHS, toMonthIndex } from "@/lib/format/timeline";
import { seeded } from "@/lib/physics/random";
import { anchors, type Vec3 } from "@/lib/physics/space";

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

/* ============================================================
   HOME -- seven bearings out of the origin
   ============================================================ */

export type Bearing = {
  id: string;
  /** Unit direction from the origin toward that region's anchor. */
  direction: Vec3;
  /** How far the thread reaches before it fades. */
  reach: number;
};

const HOME_REACH_MIN = 7;
const HOME_REACH_MAX = 15;

/**
 * "Everything is reachable from anywhere. Nothing is locked, and no order
 * is required." -- the home page says exactly that, so the geometry says
 * it too: a short thread pointing at the true bearing of every other
 * region, from the one place in the world where all of them are ahead of
 * you.
 *
 * The directions are not decorative. They are the real normalised vectors
 * to the real anchors, so the thread that points at Future is genuinely
 * pointing at Future, 862 units away.
 */
export const home: Bearing[] = destinations
  .filter((destination) => destination.id !== "home")
  .map((destination, i) => {
    const target = anchors[destination.id];
    const length = Math.hypot(target[0], target[1], target[2]) || 1;
    // Nearer regions get shorter threads, so the spray has depth rather
    // than reading as a flat asterisk.
    const reach =
      HOME_REACH_MIN +
      (i / Math.max(1, destinations.length - 2)) * (HOME_REACH_MAX - HOME_REACH_MIN);
    return {
      id: destination.id,
      direction: [
        target[0] / length,
        target[1] / length,
        target[2] / length,
      ] as Vec3,
      reach,
    };
  });

/* ============================================================
   TIME -- 48 months, seven tracks
   ============================================================ */

export type Track = {
  id: string;
  kind: "education" | "internship" | "build";
  /** World X of each end of the bar. */
  fromX: number;
  toX: number;
  /** World Y of the row. */
  y: number;
};

/** Total width of the axis in world units. */
export const AXIS_WIDTH = 46;
const ROW_GAP = 1.5;

/** Month index -> world X, the 3D twin of toPercent(). */
export function monthToX(monthIndex: number): number {
  return (monthIndex / (AXIS_MONTHS - 1) - 0.5) * AXIS_WIDTH;
}

/**
 * The same seven tracks /time draws, on the same 48-month axis, read
 * through the same toMonthIndex -- including its rule that a year-only
 * value ends in December. The degree is therefore one long bar with every
 * build clustered into the final stretch of it, which is the shape the
 * scrubber exists to reveal.
 *
 * Assembled here rather than imported from the page because a scene must
 * not depend on a route module; the derivation is the same three sources
 * in the same order.
 */
export const time: Track[] = (() => {
  const rows: { id: string; kind: Track["kind"]; start: string; end: string }[] = [
    {
      id: "education",
      kind: "education",
      start: education.dates.start,
      end: education.dates.end ?? education.dates.start,
    },
    ...experience.map((role) => ({
      id: "role-" + role.organisation,
      kind: "internship" as const,
      start: role.dates.start,
      end: role.dates.end ?? role.dates.start,
    })),
    ...projectsOrdered.map((project) => ({
      id: project.slug,
      kind: "build" as const,
      start: project.dates.start,
      end: project.dates.end ?? project.dates.start,
    })),
  ];

  const middle = (rows.length - 1) / 2;

  return rows.map((row, i) => {
    const fromX = monthToX(toMonthIndex(row.start, "start"));
    const toX = monthToX(toMonthIndex(row.end, "end"));
    return {
      id: row.id,
      kind: row.kind,
      fromX,
      // A single-month build would be a zero-length line and draw
      // nothing, so it keeps a minimum extent -- the same reason the 2D
      // bars have a 1.4% floor.
      toX: Math.max(toX, fromX + 0.5),
      y: (middle - i) * ROW_GAP,
    };
  });
})();

/* ============================================================
   EARTH -- one move, three subjects
   ============================================================ */

export type Subject = {
  id: string;
  /** Things studied. */
  studies: number;
  /** Things built. Cloud has none, and that has to show. */
  builds: number;
  position: Vec3;
};

/** Kasaragod and Bangalore, as two points and the line between them. */
export const move: { from: Vec3; to: Vec3 } = {
  from: [-9, -1.5, 4],
  to: [9, 1.5, -4],
};

/**
 * The three major subjects, counted from the same resolved record /earth
 * reads, so the page and the world can never disagree.
 *
 * As the data stands, Cloud is the degree specialisation and has
 * coursework and a certification but NO project, while Blockchain and AI
 * each have one build -- so the specialisation is visibly the subject
 * with nothing orbiting it. That asymmetry is read, not asserted: the
 * day a cloud project is added to the record, this picks it up and the
 * scene changes on its own.
 */
export const earth: Subject[] = subjects.map((subject, i) => ({
  id: subject.id,
  studies: subject.studies.length,
  builds: subject.builds.length,
  // Centred on the row rather than pinned to a literal middle index, so
  // a fourth subject would widen the row instead of skewing it.
  position: [(i - (subjects.length - 1) / 2) * 8.5, 6.5, -2] as Vec3,
}));

/* ============================================================
   STORY -- seven vertebrae, one of them hollow
   ============================================================ */

export type Vertebra = {
  id: string;
  y: number;
  /** False for `challenges`, whose body is UNKNOWN. */
  written: boolean;
  /** Builds named by this segment -- five, on `experiments`. */
  projects: number;
};

const SPINE_GAP = 4.2;

/**
 * The spine mirrors the 2D timeline on /story: seven segments top to
 * bottom, and the Challenges vertebra is empty because its body is
 * UNKNOWN and will stay that way until Abhay writes it.
 *
 * It renders as a gap in the spine rather than a placeholder. The page
 * makes the same choice -- it returns null for that segment -- because an
 * honest absence reads better than a "coming soon", and inventing a
 * struggle would be the worst thing this site could do.
 */
export const story: Vertebra[] = storySegments.map((segment, i) => ({
  id: segment.id,
  y: ((storySegments.length - 1) / 2 - i) * SPINE_GAP,
  written: isKnown(segment.body),
  projects: segment.projects?.length ?? 0,
}));

/* ============================================================
   FUTURE -- deliberately almost nothing
   ============================================================ */

/**
 * "This page is intentionally unfinished."
 *
 * /future is the sparsest page on the site, and whitespace is doing the
 * work there. The scene does the same: a single unresolved point and a
 * great deal of empty space. Filling this region would contradict the one
 * thing it is trying to say.
 */
export const FUTURE_MARKER_RADIUS = 0.8;
