/**
 * A small deterministic PRNG (mulberry32).
 *
 * The star field is generated, not authored, but it should still be the
 * SAME field every time: a layout that reshuffles on each mount is a
 * layout nobody can art-direct, and a remount would visibly re-scatter
 * the sky. Seeding also keeps generation pure, which is what lets it run
 * inside a render without lying about being idempotent.
 */
export function seeded(seed: number): () => number {
  let state = seed >>> 0;
  return function next(): number {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
