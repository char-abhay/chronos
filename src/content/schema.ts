/* ============================================================
   CHRONOS — CONTENT SCHEMA
   Pure data types. No React, no styling, no 3D imports.
   If the entire /three tree were deleted, this layer is untouched.
   ============================================================ */

/**
 * A gap in the dataset, represented in the type system rather than
 * as a comment or an empty string.
 *
 * Rule: nothing about Abhay is ever inferred. If a fact was not
 * supplied, it is UNKNOWN, it renders a visible placeholder in
 * development, and a pre-launch check fails the build if one
 * survives into production.
 */
export const UNKNOWN: unique symbol = Symbol.for("chronos.unknown");
export type Unknown = typeof UNKNOWN;

/** A value that may not have been supplied yet. */
export type Known<T> = T | Unknown;

/** Narrowing helper: `if (isKnown(x))` gives you `T`. */
export function isKnown<T>(value: Known<T>): value is T {
  return value !== UNKNOWN;
}

/** Every UNKNOWN in a content object, for the gaps checklist. */
export function findGaps(obj: unknown, path = ""): string[] {
  if (obj === UNKNOWN) return [path || "(root)"];
  if (Array.isArray(obj)) {
    return obj.flatMap((v, i) => findGaps(v, `${path}[${i}]`));
  }
  if (obj && typeof obj === "object") {
    return Object.entries(obj).flatMap(([k, v]) =>
      findGaps(v, path ? `${path}.${k}` : k)
    );
  }
  return [];
}

/* --- Shared primitives --- */

/** A point or span on the CHRONOS timeline. `end: null` means ongoing. */
export type DateSpan = {
  start: string; // "2023-06" or "2023"
  end: string | null;
  label: string; // human-readable, e.g. "June 2025 – August 2025"
};

export type Link = {
  label: string;
  href: string;
  external?: boolean;
};

/* --- Profile --- */

export type Profile = {
  name: string;
  credential: string;
  location: string;
  email: string;
  /* NOTE: there is deliberately no `phone` field.
     Confirmed by Abhay 2026-08-24: the phone number lives only in the
     downloadable resume PDF. It must not appear in rendered markup,
     structured data or OG tags, so it is not stored in this layer at
     all -- the safest place for a value is nowhere. */
  links: {
    github: Link;
    linkedin: Link;
    resume: Link;
  };
  objective: string;
};

/* --- Education --- */

export type Education = {
  qualification: string;
  institution: string;
  location: string;
  dates: DateSpan;
  majorSubjects: string[];
  graduationMonth: Known<string>;
};

/* --- Experience --- */

export type Experience = {
  role: string;
  organisation: string;
  location: string;
  dates: DateSpan;
  /** Verbatim from the resume. Never paraphrased into stronger claims. */
  bullets: string[];
  /** Project slugs produced during this role. */
  deliverables: string[];
};

/* --- Skills --- */

export type SkillGroup = {
  id: string;
  label: string;
  items: string[];
  /**
   * Honest level marker. "fundamentals" and "basics" are kept as stated
   * on the resume — understating is more credible than inflating.
   */
  note?: string;
};

export type Certification = {
  title: string;
  provider: Known<string>;
  /** Kept explicit: these are online courses, not accredited degrees. */
  format: string;
  date: Known<string>;
};

/* --- Projects --- */

export type ProjectContext = "internship" | "academic";

export type CodeExcerpt = {
  language: string;
  /** What file/contract this is from. Never presented as complete. */
  source: string;
  caption: string;
  code: string;
};

export type ProjectChallenge = {
  title: string;
  body: string;
};

export type Project = {
  slug: string;
  name: string;
  /** Disambiguates a name that could be misread. Optional. */
  subtitle?: string;
  context: ProjectContext;
  dates: DateSpan;
  /** Pinned to the lead position on the index regardless of date. */
  featured?: boolean;
  /** One sentence. */
  what: string;
  /** One or two sentences. */
  why: string;
  technologies: string[];
  contribution: string;
  functionality: string[];
  /**
   * Only if factually supported. No metrics, users, scale, uptime or
   * business impact exist in this dataset — this stays UNKNOWN unless
   * Abhay supplies something real.
   */
  outcome: Known<string>;
  /**
   * Optional array, NOT a fixed set of slots. A project with no repo
   * renders no link row at all: no ghost button, no disabled state,
   * no "private repo" badge. Absence must be invisible.
   */
  links: Link[];
  codeExcerpt?: CodeExcerpt;
  codeExcerptFull?: CodeExcerpt;
  challenges?: ProjectChallenge[];
  /** Shown as a caution in dev when a name could imply more than it does. */
  clarification?: string;
};

/* --- Destinations --- */

export type DestinationId =
  | "home"
  | "time"
  | "earth"
  | "solar-system"
  | "galaxy"
  | "black-holes"
  | "future"
  | "story";

export type Destination = {
  id: DestinationId;
  index: string; // "01".."08"
  name: string;
  href: string;
  /** The scale marker in the ARRIVAL stamp. */
  scale: string;
  /** One-line hook. */
  hook: string;
};

/* --- Science content --- */

export type Source = {
  /** Full citation: author, year, publication. Stands on its own. */
  label: string;
  /** Only when a stable URL is genuinely known. Never invented. */
  href?: string;
};

/**
 * Progressive disclosure, per plan Section 15.
 * L1 headline -> L2 accessible -> L3 deeper.
 * Every L3 claim carries at least one source.
 */
export type ScienceConcept = {
  id: string;
  l1: string;
  l2: string;
  l3: string;
  /** Stated limits, assumptions or open questions. Optional but preferred. */
  caveat?: string;
  sources: Source[];
};

export type ScienceModule = {
  destination: DestinationId;
  concepts: ScienceConcept[];
};

/* --- My Story --- */

export type StorySegmentId =
  | "origin"
  | "discovery"
  | "learning"
  | "experiments"
  | "challenges"
  | "present"
  | "next";

export type StorySegment = {
  id: StorySegmentId;
  label: string;
  /** Timeline marker. Not every segment is a single date, and the
      challenges segment has no date at all until Abhay supplies one. */
  marker: Known<string>;
  /**
   * The narrative body. UNKNOWN where Abhay has not supplied it --
   * `challenges` is the one deliberate gap in this section and will
   * not be written on his behalf.
   */
  body: Known<string>;
  /** Related project slugs, if any. */
  projects?: string[];
};
