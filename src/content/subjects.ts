import { education } from "./education";
import { projectsOrdered } from "./projects";
import { isKnown, type Project } from "./schema";
import { certifications, skillGroups } from "./skills";

/**
 * THE THREE MAJOR SUBJECTS, RESOLVED.
 *
 * /earth and the Earth scene both need to know what each subject
 * actually produced. They used to work it out separately from literal
 * slugs -- getProject("dvoting"), getProject("ai-chatbot"), a cloud
 * build count hardcoded to 0 -- which meant the day a cloud project
 * finally existed, neither would have noticed. The page would have gone
 * on reporting the specialisation as the subject with nothing behind
 * it, which is the one thing on that page that must never be stale.
 *
 * So it is derived here, once, and both read from it.
 *
 * The joins are by name, not by id, and that is deliberate: the subject
 * names in education.majorSubjects are the same strings used as a skill
 * group's `label` and a certification's `title`. Matching on them keeps
 * the content files readable -- there is no hidden key to remember --
 * and a rename that breaks a join fails loudly below rather than
 * silently emptying a subject.
 */

export type StudyItem = {
  label: string;
  /** Provider and format, where a certification supplies them. */
  meta?: string;
};

export type MajorSubject = {
  id: string;
  name: string;
  /** True for the one the degree specialised in. Exactly one is true. */
  specialisation: boolean;
  /** Coursework and certifications. Cold: studied, not built. */
  studies: StudyItem[];
  /** Builds that came out of this subject. Legitimately empty. */
  builds: Project[];
};

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

/* A misspelled subject name would not throw on its own -- it would just
   quietly match nothing, leaving a subject with no builds and no marked
   specialisation, and the build would still go green. These two checks
   turn that into a failure at `npm run build`, with the offending value
   named. Same reasoning as scripts/check-content-gaps.mjs: a content
   mistake should be loud, because nobody proofreads a passing build. */
const known = new Set(education.majorSubjects);

if (!known.has(education.specialisation)) {
  throw new Error(
    `education.specialisation is "${education.specialisation}", which is not ` +
      `one of majorSubjects (${education.majorSubjects.join(", ")}).`
  );
}

for (const project of projectsOrdered) {
  for (const subject of project.subjects ?? []) {
    if (!known.has(subject)) {
      throw new Error(
        `Project "${project.slug}" lists subject "${subject}", which is not ` +
          `one of education.majorSubjects (${education.majorSubjects.join(", ")}).`
      );
    }
  }
}

export const subjects: MajorSubject[] = education.majorSubjects.map((name) => {
  // A subject only has a skill group of its own where one is labelled
  // for it. Blockchain and AI live inside "Other Technologies" as
  // coursework-level items, so they resolve to no studies here -- which
  // is the true shape and must not be padded.
  const group = skillGroups.find((g) => g.label === name);
  const certs = certifications.filter((c) => c.title === name);

  return {
    id: slugify(name),
    name,
    specialisation: name === education.specialisation,
    studies: [
      ...(group?.items ?? []).map((label) => ({ label })),
      ...certs.map((cert) => ({
        label: cert.title,
        meta:
          (isKnown(cert.provider) ? cert.provider + " · " : "") + cert.format,
      })),
    ],
    builds: projectsOrdered.filter((project) =>
      project.subjects?.includes(name)
    ),
  };
});
