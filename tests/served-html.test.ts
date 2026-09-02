import fs from "node:fs";
import path from "node:path";
import { beforeAll, describe, expect, it } from "vitest";
import {
  certifications,
  education,
  experience,
  isKnown,
  profile,
  projectsOrdered,
  skillGroups,
  storySegments,
} from "@/content";

/**
 * The non-negotiables, checked against what the server actually sends.
 *
 * README calls these enforced rather than aspirational. Until this file
 * existed that was a claim about intent: the recruiter guarantee and the
 * JavaScript-off promise were both true only for as long as nobody
 * happened to break them, and one of them had already been broken for
 * months. A closed Reveal rendered `{open ? children : null}`, so five
 * pages served their headings and nothing underneath -- /black-holes
 * shipped 822 characters, fewer than the page the README itself calls
 * the sparsest on the site.
 *
 * Nothing renders here. `next build` prerenders every route to disk, so
 * this reads the real HTML a visitor is handed, with no server to start
 * and nothing to be flaky about. It asserts against the content layer
 * rather than against fixtures, because a fixture cannot catch the
 * record and the page disagreeing -- which is the only failure that has
 * ever actually happened.
 */

const APP = path.join(process.cwd(), ".next", "server", "app");

/** Visible text, as a reader with no JavaScript would get it. */
function servedText(route: string): string {
  const file = path.join(APP, route + ".html");
  return fs
    .readFileSync(file, "utf8")
    .replace(/<script[\s\S]*?<\/script>/g, " ")
    .replace(/<style[\s\S]*?<\/style>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, "/")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function servedHtml(route: string): string {
  return fs.readFileSync(path.join(APP, route + ".html"), "utf8");
}

beforeAll(() => {
  // A guard that silently passes when there is nothing to guard is worse
  // than no guard, so say so loudly rather than skipping.
  expect(
    fs.existsSync(APP),
    "no build output at .next/server/app -- run `npm run build` before `npm test`"
  ).toBe(true);
});

describe("the recruiter guarantee", () => {
  it("puts the name, the credential and the qualification in the home page HTML", () => {
    const home = servedText("index");
    expect(home).toContain(profile.name);
    expect(home).toContain(profile.credential);
    expect(home).toContain(education.specialisation);
  });

  it("puts the name on every page a recruiter might land on first", () => {
    for (const route of ["index", "profile", "resume", "projects", "contact"]) {
      expect(servedText(route), "no name on /" + route).toContain(profile.name);
    }
  });

  it("does not put the phone number anywhere in the markup", () => {
    // profile.ts keeps the number out of rendered markup, structured data
    // and OG tags on purpose: it lives only in the downloadable resume.
    // The safest place for a value is nowhere.
    const digits = /\+?\d[\d\s()-]{8,}\d/g;
    for (const route of ["index", "profile", "resume", "contact"]) {
      const found = (servedText(route).match(digits) ?? []).filter(
        (m) => m.replace(/\D/g, "").length >= 10
      );
      expect(found, "a phone-shaped number leaked into /" + route).toEqual([]);
    }
  });
});

describe("it works with JavaScript off", () => {
  it("gates no content behind a script-driven disclosure", () => {
    // A <button aria-expanded="false"> that conditionally renders its
    // children serves nothing to a reader without JavaScript. The
    // browser's own <details> keeps the content in the document.
    for (const route of ["solar-system", "time", "black-holes", "earth", "galaxy", "story"]) {
      expect(
        servedHtml(route).includes('aria-expanded="false"'),
        "/" + route + " hides content behind aria-expanded"
      ).toBe(false);
    }
  });

  it("serves every build in full on /solar-system", () => {
    const page = servedText("solar-system");
    for (const project of projectsOrdered) {
      expect(page, project.name + " is missing").toContain(project.name);
      expect(page, project.name + " has no description").toContain(project.what);
      expect(page, project.name + " has no reason").toContain(project.why);
      for (const item of project.functionality) {
        expect(page, project.name + " is missing a capability").toContain(item);
      }
    }
  });

  it("serves every challenge write-up on /black-holes", () => {
    const page = servedText("black-holes");
    const challenges = projectsOrdered.flatMap((p) => p.challenges ?? []);
    expect(challenges.length).toBeGreaterThan(0);
    for (const challenge of challenges) {
      expect(page, challenge.title + " is missing").toContain(challenge.title);
      // The title is the summary and survives anything; the body is the
      // write-up, and the write-up is the whole point of the page.
      expect(page, challenge.title + " has no write-up").toContain(challenge.body);
    }
  });

  it("serves the courses and the tools on /earth", () => {
    const page = servedText("earth");
    for (const cert of certifications) {
      expect(page, cert.title + " is missing").toContain(cert.title);
    }
    const tools = skillGroups
      .filter((g) => g.id === "systems" || g.id === "languages")
      .flatMap((g) => g.items);
    expect(tools.length).toBeGreaterThan(0);
    for (const tool of tools) {
      expect(page, tool + " is missing").toContain(tool);
    }
  });

  it("serves the whole written record on /time", () => {
    const page = servedText("time");
    for (const role of experience) {
      expect(page, role.organisation + " is missing").toContain(role.organisation);
      for (const bullet of role.bullets) {
        expect(page, "a bullet of " + role.role + " is missing").toContain(bullet);
      }
    }
    for (const project of projectsOrdered) {
      expect(page, project.name + " is missing from the record").toContain(project.name);
    }
    expect(page).toContain(education.qualification);
  });

  it("forces the scroll reveals visible without script", () => {
    // The other half of the promise: InView renders hidden and is
    // unhidden by script, so the root layout carries a <noscript> rule.
    expect(servedHtml("index")).toContain("[data-reveal]");
    expect(servedHtml("index")).toContain("<noscript>");
  });
});

describe("no invented facts reach the page", () => {
  it("never renders the UNKNOWN marker as text", () => {
    const routes = fs
      .readdirSync(APP)
      .filter((f) => f.endsWith(".html"))
      .map((f) => f.replace(/\.html$/, ""));
    expect(routes.length).toBeGreaterThan(10);
    for (const route of routes) {
      expect(servedText(route).toLowerCase(), "/" + route + " renders a gap").not.toContain(
        "unknown"
      );
    }
  });

  it("writes every story segment it has, and nothing for the one it does not", () => {
    // storySegments.challenges.body is UNKNOWN and is Abhay's to write.
    // /story renders that segment as nothing at all rather than as a
    // "coming soon" placeholder, so the check is that the gap stays a
    // gap: no body appears for it, and no other segment goes missing to
    // make room.
    const page = servedText("story");
    const written = storySegments.filter((s) => isKnown(s.body));
    const unwritten = storySegments.filter((s) => !isKnown(s.body));

    expect(unwritten.length, "the deliberate gap has been filled in").toBeGreaterThan(0);
    for (const segment of unwritten) {
      expect(page, "a body appeared for the unwritten " + segment.id).not.toContain(
        segment.label + " "
      );
    }
    for (const segment of written) {
      expect(page, segment.id + " is missing its label").toContain(segment.label);
      expect(page, segment.id + " is missing its body").toContain(segment.body as string);
    }
  });
});
