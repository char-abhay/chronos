import fs from "node:fs";
import path from "node:path";
import { beforeAll, describe, expect, it } from "vitest";

/**
 * Structural accessibility, checked on the HTML the server actually
 * sends, for every prerendered route at once.
 *
 * This is the half of accessibility a machine can genuinely settle:
 * heading order, accessible names, ARIA references that point at real
 * elements, landmarks, unique ids. It says nothing about whether the
 * writing is clear or the focus order makes sense -- those need a
 * person, and the components carry their own notes about them.
 *
 * It found one thing when it was written: Tooltip set aria-controls to
 * an id that only existed once the popover opened, so the served state
 * carried a broken IDREF. The same shape Reveal had.
 */

const APP = path.join(process.cwd(), ".next", "server", "app");

type Page = { route: string; html: string };

function collect(): Page[] {
  const out: Page[] = [];
  const walk = (dir: string, prefix: string) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.isDirectory()) walk(path.join(dir, entry.name), prefix + "/" + entry.name);
      else if (entry.name.endsWith(".html")) {
        const html = fs.readFileSync(path.join(dir, entry.name), "utf8");
        // Next renders its own bare shell for the global-error boundary
        // (<html id="__next_error__">). It is framework output, not ours,
        // and app/global-error.tsx sets lang when it actually renders.
        if (html.includes('id="__next_error__"')) continue;
        out.push({ route: prefix + "/" + entry.name.replace(/\.html$/, ""), html });
      }
    }
  };
  walk(APP, "");
  return out;
}

let pages: Page[] = [];

beforeAll(() => {
  expect(
    fs.existsSync(APP),
    "no build output at .next/server/app -- run `npm run build` before `npm test`"
  ).toBe(true);
  pages = collect();
  expect(pages.length, "no prerendered routes found").toBeGreaterThan(10);
});

const ids = (html: string) => [...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]);

const strip = (s: string) => s.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();

describe("document structure", () => {
  it("gives every page exactly one h1", () => {
    for (const { route, html } of pages) {
      const count = (html.match(/<h1\b/g) ?? []).length;
      expect(count, route + " has " + count + " <h1> elements").toBe(1);
    }
  });

  it("never skips a heading level", () => {
    for (const { route, html } of pages) {
      let previous = 0;
      for (const match of html.matchAll(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/g)) {
        const level = Number(match[1]);
        if (previous) {
          expect(
            level,
            route + ': h' + previous + " -> h" + level + ' at "' + strip(match[2]).slice(0, 40) + '"'
          ).toBeLessThanOrEqual(previous + 1);
        }
        previous = level;
      }
    }
  });

  it("declares a language and a main landmark", () => {
    for (const { route, html } of pages) {
      expect(html, route + " has no lang on <html>").toMatch(/<html[^>]*\blang="/);
      expect(html, route + " has no <main>").toMatch(/<main\b/);
    }
  });

  it("keeps every id unique", () => {
    for (const { route, html } of pages) {
      const all = ids(html);
      const duplicates = all.filter((id, i) => all.indexOf(id) !== i);
      expect([...new Set(duplicates)], route + " repeats an id").toEqual([]);
    }
  });

  it("uses no positive tabindex", () => {
    // A positive tabindex takes an element out of document order and
    // reorders the whole page's tab sequence around it.
    for (const { route, html } of pages) {
      const positive = [...html.matchAll(/tabindex="(\d+)"/g)].filter((m) => Number(m[1]) > 0);
      expect(positive.map((m) => m[0]), route + " uses a positive tabindex").toEqual([]);
    }
  });
});

describe("ARIA references point at real elements", () => {
  for (const attribute of ["aria-labelledby", "aria-describedby", "aria-controls"]) {
    it(attribute, () => {
      for (const { route, html } of pages) {
        const present = ids(html);
        for (const match of html.matchAll(new RegExp(attribute + '="([^"]+)"', "g"))) {
          for (const target of match[1].split(/\s+/)) {
            expect(
              present,
              route + ": " + attribute + '="' + target + '" points at nothing'
            ).toContain(target);
          }
        }
      }
    });
  }
});

describe("everything interactive has an accessible name", () => {
  const named = (attrs: string, inner: string) =>
    strip(inner).length > 0 || /aria-label=/.test(attrs) || /aria-labelledby=/.test(attrs);

  it("links", () => {
    for (const { route, html } of pages) {
      for (const match of html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/g)) {
        expect(
          named(match[1], match[2]),
          route + ": a link with no name -- " + match[1].slice(0, 70)
        ).toBe(true);
      }
    }
  });

  it("buttons and summaries", () => {
    for (const { route, html } of pages) {
      for (const tag of ["button", "summary"] as const) {
        const re = new RegExp("<" + tag + "\\b([^>]*)>([\\s\\S]*?)</" + tag + ">", "g");
        for (const match of html.matchAll(re)) {
          expect(
            named(match[1], match[2]),
            route + ": a <" + tag + "> with no name -- " + match[1].slice(0, 70)
          ).toBe(true);
        }
      }
    }
  });

  it("form controls", () => {
    for (const { route, html } of pages) {
      for (const match of html.matchAll(/<(input|select|textarea)\b([^>]*)>/g)) {
        const attrs = match[2];
        if (/type="(hidden|submit|button|reset)"/.test(attrs)) continue;
        const id = attrs.match(/\bid="([^"]+)"/)?.[1];
        const labelled =
          /aria-label=/.test(attrs) ||
          /aria-labelledby=/.test(attrs) ||
          (id !== undefined && new RegExp('<label[^>]*\\bfor="' + id + '"').test(html)) ||
          // A wrapping <label> is an implicit association and is just as
          // valid as `for` -- TimeScrubber's slider is named this way.
          new RegExp("<label\\b[^>]*>(?:(?!</label>)[\\s\\S])*?" + escapeRe(match[0])).test(html);
        expect(labelled, route + ": an unlabelled control -- " + match[0].slice(0, 80)).toBe(true);
      }
    }
  });

  it("images carry alt text", () => {
    for (const { route, html } of pages) {
      for (const match of html.matchAll(/<img\b[^>]*>/g)) {
        expect(match[0], route + ": an <img> with no alt").toMatch(/\balt=/);
      }
    }
  });
});

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
