import { describe, expect, it } from "vitest";
import {
  certifications,
  destinations,
  projectsOrdered,
  skillGroups,
  storySegments,
  subjects,
} from "@/content";
import { seeded } from "@/lib/physics/random";
import {
  AXIS_WIDTH,
  blackHoles,
  DISK_OUTER,
  earth,
  galaxy,
  home,
  monthToX,
  solarSystem,
  story,
  time,
  VOID_RADIUS,
} from "@/lib/physics/layout";
import { AXIS_MONTHS } from "@/lib/format/timeline";
import { destinationIdForPath } from "@/lib/scene/route";
import { anchors, DEFAULT_DESTINATION, distance, poses } from "@/lib/physics/space";

/**
 * These are invariants, not golden geometry. Nobody should have to
 * re-record a hundred coordinates to nudge a body; what must not change
 * is that the world is derived from the record and stays inside the
 * bounds the scenes are built for.
 */

describe("seeded", () => {
  it("gives the same sky every time", () => {
    const a = seeded(1234);
    const b = seeded(1234);
    expect(Array.from({ length: 12 }, () => a())).toEqual(
      Array.from({ length: 12 }, () => b())
    );
  });

  it("gives a different sky for a different seed", () => {
    expect(seeded(1)()).not.toBe(seeded(2)());
  });

  it("stays inside the unit interval", () => {
    const next = seeded(99);
    for (let i = 0; i < 2000; i++) {
      const v = next();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
      expect(Number.isFinite(v)).toBe(true);
    }
  });
});

describe("the scenes count what the record counts", () => {
  it("gives the solar system one body per build", () => {
    expect(solarSystem.map((b) => b.slug).sort()).toEqual(
      projectsOrdered.map((p) => p.slug).sort()
    );
  });

  it("gives the galaxy one cluster per skill group and one node per build", () => {
    expect(galaxy.clusters.map((c) => c.id).sort()).toEqual(
      skillGroups.map((g) => g.id).sort()
    );
    expect(galaxy.projects.map((p) => p.slug).sort()).toEqual(
      projectsOrdered.map((p) => p.slug).sort()
    );
  });

  it("gives the black holes one band per recorded challenge", () => {
    const challenges = projectsOrdered.flatMap((p) => p.challenges ?? []);
    expect(blackHoles.map((b) => b.title)).toEqual(challenges.map((c) => c.title));
  });

  it("gives the story one vertebra per segment", () => {
    expect(story.map((v) => v.id)).toEqual(storySegments.map((s) => s.id));
  });

  it("gives Earth one subject per major subject", () => {
    expect(earth.map((s) => s.id).sort()).toEqual(subjects.map((s) => s.id).sort());
  });

  it("gives Home one bearing per destination away from Home", () => {
    expect(home.map((b) => b.id)).toEqual(
      destinations.filter((d) => d.id !== "home").map((d) => d.id)
    );
  });

  it("gives the timeline one track per dated thing", () => {
    expect(time).toHaveLength(1 + 1 + projectsOrdered.length);
    expect(time.filter((t) => t.kind === "build")).toHaveLength(projectsOrdered.length);
    expect(time.filter((t) => t.kind === "education")).toHaveLength(1);
  });
});

describe("the record shows through the geometry", () => {
  it("leaves the hollow story segment hollow", () => {
    // `challenges` is UNKNOWN on purpose and the spine has to show it.
    const unwritten = story.filter((v) => !v.written).map((v) => v.id);
    expect(unwritten).toContain("challenges");
    expect(unwritten).toHaveLength(
      storySegments.filter((s) => typeof s.body !== "string").length
    );
  });

  it("counts a subject's builds from the record, zero included", () => {
    for (const subject of subjects) {
      const node = earth.find((s) => s.id === subject.id);
      expect(node, "no Earth node for " + subject.id).toBeDefined();
      expect(node!.builds).toBe(subject.builds.length);
    }
  });

  it("names the featured build in both scenes that mark one", () => {
    const featured = solarSystem.filter((b) => b.featured).map((b) => b.slug);
    expect(galaxy.projects.filter((p) => p.featured).map((p) => p.slug)).toEqual(featured);
  });
});

describe("nothing in the world is NaN or off its axis", () => {
  const allFinite = (label: string, values: number[]) =>
    it(label, () => {
      expect(values.length).toBeGreaterThan(0);
      for (const v of values) expect(Number.isFinite(v), label + " has a NaN").toBe(true);
    });

  allFinite(
    "solar system orbits and sizes",
    solarSystem.flatMap((b) => [b.radius, b.size, b.speed, b.phase, b.tilt])
  );
  allFinite("galaxy cluster positions", galaxy.clusters.flatMap((c) => c.position));
  allFinite("galaxy project positions", galaxy.projects.flatMap((p) => p.position));
  allFinite("black hole bands", blackHoles.flatMap((b) => [b.inner, b.outer, b.speed, b.density]));
  allFinite("time tracks", time.flatMap((t) => [t.fromX, t.toX, t.y]));
  allFinite("home bearings", home.flatMap((b) => [...b.direction, b.reach]));
  allFinite("story spine", story.map((v) => v.y));
  allFinite("earth subjects", earth.flatMap((s) => s.position));

  it("keeps the timeline inside the axis it is drawn on", () => {
    const half = AXIS_WIDTH / 2;
    for (const track of time) {
      expect(track.fromX, track.id + " starts off the axis").toBeGreaterThanOrEqual(-half - 1e-9);
      expect(track.toX, track.id + " ends off the axis").toBeLessThanOrEqual(half + 1e-9);
      expect(track.toX, track.id + " runs backwards").toBeGreaterThanOrEqual(track.fromX);
    }
  });

  it("maps the first and last month to the two ends of the axis", () => {
    expect(monthToX(0)).toBeCloseTo(-AXIS_WIDTH / 2, 9);
    expect(monthToX(AXIS_MONTHS - 1)).toBeCloseTo(AXIS_WIDTH / 2, 9);
  });

  it("keeps every accretion band outside the void and inside the disk", () => {
    for (const band of blackHoles) {
      expect(band.inner, band.title + " is inside the void").toBeGreaterThanOrEqual(VOID_RADIUS);
      expect(band.outer, band.title + " has no width").toBeGreaterThan(band.inner);
      expect(band.outer, band.title + " is outside the disk").toBeLessThanOrEqual(DISK_OUTER);
    }
  });

  it("draws every galaxy edge between two real nodes", () => {
    const clusters = new Map(galaxy.clusters.map((c) => [c.id, c.position]));
    const projects = new Map(galaxy.projects.map((p) => [p.slug, p.position]));
    expect(galaxy.edges.length).toBeGreaterThan(0);
    for (const edge of galaxy.edges) {
      expect(clusters.has(edge.clusterId), "edge from unknown cluster " + edge.clusterId).toBe(true);
      expect(projects.has(edge.slug), "edge to unknown build " + edge.slug).toBe(true);
      // The endpoints are the nodes themselves, not a second guess at
      // where they are -- a line to nowhere would still render.
      expect(edge.from).toEqual(clusters.get(edge.clusterId));
      expect(edge.to).toEqual(projects.get(edge.slug));
    }
  });

  it("points every home bearing at the region it names", () => {
    for (const bearing of home) {
      const target = anchors[bearing.id as keyof typeof anchors];
      const length = Math.hypot(...target) || 1;
      expect(bearing.direction[0]).toBeCloseTo(target[0] / length, 9);
      expect(bearing.direction[1]).toBeCloseTo(target[1] / length, 9);
      expect(bearing.direction[2]).toBeCloseTo(target[2] / length, 9);
      expect(Math.hypot(...bearing.direction)).toBeCloseTo(1, 9);
    }
  });
});

describe("space", () => {
  it("gives every destination an anchor and a pose", () => {
    for (const d of destinations) {
      expect(anchors[d.id], "no anchor for " + d.id).toBeDefined();
      expect(poses[d.id], "no pose for " + d.id).toBeDefined();
    }
  });

  it("measures a distance of zero from a point to itself", () => {
    expect(distance(anchors[DEFAULT_DESTINATION], anchors[DEFAULT_DESTINATION])).toBe(0);
  });

  it("measures the same distance in both directions", () => {
    const [a, b] = destinations;
    expect(distance(anchors[a.id], anchors[b.id])).toBeCloseTo(
      distance(anchors[b.id], anchors[a.id]),
      9
    );
  });
});

describe("destinationIdForPath", () => {
  it("resolves every destination to itself", () => {
    for (const d of destinations) {
      expect(destinationIdForPath(d.href)).toBe(d.id);
    }
  });

  it("parks a build page in the region that catalogues the builds", () => {
    for (const project of projectsOrdered) {
      expect(destinationIdForPath("/projects/" + project.slug)).toBe("solar-system");
    }
    expect(destinationIdForPath("/projects")).toBe("solar-system");
  });

  it("parks reference pages at the origin", () => {
    for (const path of ["/contact", "/styleguide", "/resume", "/profile", "/nowhere"]) {
      expect(destinationIdForPath(path)).toBe(DEFAULT_DESTINATION);
    }
  });
});

describe("the record itself", () => {
  it("holds a certification list Earth can render", () => {
    expect(certifications.length).toBeGreaterThan(0);
  });
});
