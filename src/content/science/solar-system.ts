import type { ScienceModule } from "../schema";

/**
 * SOLAR SYSTEM — second rung. Orbits are the content here, which is the
 * justification for this being one of the three real 3D scenes: relative
 * distance and period cannot be shown honestly in a static image.
 */
export const solarSystemScience: ScienceModule = {
  destination: "solar-system",
  concepts: [
    {
      id: "light-minutes",
      l1: "Sunlight is already eight minutes old.",
      l2: "The Sun is about 8 minutes 20 seconds away at light speed. If it stopped shining, nobody would know for eight minutes — and nothing would leave its orbit for eight minutes either.",
      l3: "One astronomical unit is defined as exactly 149,597,870,700 metres, which is 499 light-seconds. The same holds for gravity: in general relativity, changes in a gravitational field propagate at c, confirmed to high precision by the timing of gravitational waves from GW170817 against the accompanying gamma-ray burst in 2017. Across the rest of the system, light takes roughly 1.3 seconds to the Moon, about 4 to 20 minutes to Mars depending on configuration, and around 4 to 6 hours to Neptune.",
      sources: [
        {
          label:
            "IAU (2012) Resolution B2 — definition of the astronomical unit",
        },
        {
          label:
            "LIGO/Virgo & Fermi-GBM (2017), ApJL 848, L13 — GW170817 constrains the speed of gravity to c",
        },
      ],
    },

    {
      id: "orbital-mechanics",
      l1: "How far out you are determines how long a year takes.",
      l2: "Orbital period is not arbitrary. It follows directly from distance: further out means slower, and the relationship is fixed.",
      l3: "Kepler's third law states that the square of the orbital period is proportional to the cube of the semi-major axis — T² ∝ a³. For bodies orbiting the Sun in astronomical units and years the constant is 1, so a planet at 4 AU takes 8 years. Newton later showed this follows from the inverse-square law of gravitation, and that the full form depends on the combined mass of both bodies, which matters for binary stars but is negligible for planets around the Sun.",
      sources: [
        {
          label: "Kepler (1619), Harmonices Mundi, Book V — the third law",
        },
        {
          label:
            "Newton (1687), Philosophiae Naturalis Principia Mathematica, Book I",
        },
      ],
    },

    {
      id: "lagrange-points",
      l1: "There are five places where you can sit still relative to two moving bodies.",
      l2: "In a system of two large bodies — the Sun and the Earth, say — there are five points where a small object's orbital motion keeps pace with both. Spacecraft are parked there deliberately.",
      l3: "The five Lagrange points arise from the restricted three-body problem. L1, L2 and L3 lie along the line joining the two bodies and are unstable: an object there drifts away and needs periodic station-keeping. L4 and L5, sixty degrees ahead of and behind the smaller body in its orbit, are stable for sufficiently large mass ratios, which is why Jupiter's Trojan asteroids accumulate there naturally. The James Webb Space Telescope operates near Sun–Earth L2, roughly 1.5 million kilometres from Earth, where the Sun, Earth and Moon stay on the same side and can be blocked by a single sunshield.",
      caveat:
        "'Stationary' means stationary in the rotating frame of the two bodies. Nothing there is at rest in any absolute sense — L2 orbits the Sun alongside Earth.",
      sources: [
        {
          label:
            "Lagrange (1772), Essai sur le problème des trois corps",
        },
        {
          label:
            "NASA, James Webb Space Telescope — orbit at Sun–Earth L2",
          href: "https://science.nasa.gov/mission/webb/",
        },
      ],
    },
  ],
};
