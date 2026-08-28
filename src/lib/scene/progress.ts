/**
 * How far through the current region the reader has scrolled, 0 to 1.
 *
 * Deliberately NOT a React hook. Scenes read this inside useFrame, sixty
 * times a second; a hook would re-render the tree at that rate to deliver
 * a number three.js can simply be handed. So this is a plain module with
 * a getter, and React never learns that scrolling happened.
 *
 * The DOM side of the site does not consume this at all -- reveals stay
 * on IntersectionObserver (components/motion/InView.tsx), which needs no
 * scroll listener and cannot thrash layout.
 */
let progress = 0;

export function setSceneProgress(value: number) {
  progress = value < 0 ? 0 : value > 1 ? 1 : value;
}

export function getSceneProgress(): number {
  return progress;
}
