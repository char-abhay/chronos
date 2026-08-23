/**
 * Content gaps checklist.
 *
 * Scans the content layer for every UNKNOWN marker so gaps stay visible
 * instead of quietly becoming invented text.
 *
 *   npm run gaps          list the gaps
 *   npm run gaps -- --ci  exit 1 if any gap remains
 *
 * The --ci form is the pre-launch gate (plan Phase 9): an UNKNOWN is a
 * legitimate authoring state during development and must never ship.
 *
 * This is a source scan, not a semantic walk of the evaluated objects.
 * That is deliberate -- it needs no build step, no loader and no extra
 * dependency, and it reports an exact file and line, which is what you
 * actually want when filling a gap.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = "src/content";
const ci = process.argv.includes("--ci");

/** Lines that define or document UNKNOWN rather than using it as a gap. */
function isDefinition(file, line) {
  if (file.endsWith("schema.ts")) return true;
  const t = line.trim();
  return (
    t.startsWith("*") ||
    t.startsWith("//") ||
    t.startsWith("/*") ||
    t.startsWith("import")
  );
}

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else if (entry.endsWith(".ts")) out.push(full);
  }
  return out;
}

const gaps = [];
for (const file of walk(ROOT)) {
  const lines = readFileSync(file, "utf8").split(/\r?\n/);
  lines.forEach((line, i) => {
    if (!line.includes("UNKNOWN")) return;
    if (isDefinition(file, line)) return;
    gaps.push({
      file: relative(process.cwd(), file).replace(/\\/g, "/"),
      line: i + 1,
      text: line.trim(),
    });
  });
}

if (gaps.length === 0) {
  console.log("No UNKNOWN markers in the content layer.");
  process.exit(0);
}

console.log(`\n${gaps.length} content gap(s) — UNKNOWN / TO BE PROVIDED\n`);
let current = "";
for (const g of gaps) {
  if (g.file !== current) {
    current = g.file;
    console.log(`  ${g.file}`);
  }
  console.log(`    ${String(g.line).padStart(4)}  ${g.text}`);
}
console.log(
  "\nThese are real gaps in the dataset. Fill them with facts from Abhay,\n" +
    "never by inference. Run with --ci to fail a build while any remain.\n"
);

process.exit(ci ? 1 : 0);
