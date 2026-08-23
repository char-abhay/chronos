import type { ScienceModule } from "../schema";

/**
 * FUTURE — deliberately the thinnest section on the site.
 *
 * The meaning here is that the future is open, and a dense visual
 * treatment would contradict that. Sparse typography on a near-empty
 * field says it; a busy 3D scene would not (plan Section H).
 *
 * This module ends without a conclusion on purpose.
 */
export const futureScience: ScienceModule = {
  destination: "future",
  concepts: [
    {
      id: "interstellar-distance",
      l1: "The nearest other star is 4.25 years away at the speed of light.",
      l2: "That is the floor, not the target. Nothing built has come remotely close to that speed, and the gap is not small.",
      l3: "Voyager 1, the fastest-receding human-made object, travels at roughly 17 kilometres per second relative to the Sun — about 0.006% of the speed of light. At that rate a journey to Proxima Centauri's distance would take on the order of 70,000 years. Proposed concepts such as laser-driven light sails aim at a few percent of c for gram-scale probes, which would still mean decades in transit and no possibility of slowing down on arrival without an entirely separate solution.",
      caveat:
        "Every interstellar propulsion concept currently discussed is at the level of engineering study, not demonstrated capability.",
      sources: [
        {
          label: "NASA, Voyager mission status and velocity data",
          href: "https://science.nasa.gov/mission/voyager/",
        },
      ],
    },

    {
      id: "one-way-travel",
      l1: "Travel into the future is possible, and has already been done.",
      l2: "Not as speculation. Time dilation means that moving fast, or sitting deeper in a gravitational field, genuinely puts you out of step with everyone else — always in the same direction.",
      l3: "Cosmonaut Gennady Padalka, who accumulated more than 878 days in orbit, is measurably younger than he would have been had he stayed on the ground — by a fraction of a second, but really. Scale the velocity up and the effect grows without limit: a crew travelling at 99.99% of c would experience roughly one year for every seventy that passed at home. The return trip is the part physics does not offer.",
      caveat:
        "This is one-directional. Nothing in established physics permits travelling back, and closed timelike curves remain regarded as unphysical (see TIME).",
      sources: [
        {
          label:
            "Hafele & Keating (1972), Science 177, 168 — measured clock differences on flown clocks",
        },
      ],
    },

    {
      id: "expansion",
      l1: "The observable universe is larger than its age in light-years.",
      l2: "The universe is about 13.8 billion years old, but the edge of what can be observed is roughly 46.5 billion light-years away. That is not a contradiction — space itself expanded while the light was in transit.",
      l3: "Expansion stretches the distance between objects over time, so light that has been travelling for 13.8 billion years originated from material now much further away than that. Measurements of distant Type Ia supernovae in 1998 showed that the expansion is accelerating, attributed to dark energy — which describes the observation rather than explaining it.",
      caveat:
        "Dark energy is a name for an effect, not an identified mechanism. Its nature is unknown, and it accounts for the large majority of the universe's energy content.",
      sources: [
        {
          label:
            "Riess et al. (1998), AJ 116, 1009 and Perlmutter et al. (1999), ApJ 517, 565 — accelerating expansion",
        },
        {
          label:
            "Planck Collaboration (2020), A&A 641, A6 — age of the universe, 13.797 ± 0.023 Gyr",
        },
      ],
    },

    {
      id: "open",
      l1: "This section does not have an ending.",
      l2: "The questions this site has raised are not rhetorical devices. Several of them are open problems that nobody has solved.",
      l3: "Why the early universe began in such a low-entropy state. What dark matter is made of. What dark energy is. What happens to information in an evaporating black hole. Whether closed timelike curves are forbidden or merely improbable. Each of these is an active field with no agreed answer, and each is a reasonable thing to spend a career on.",
      caveat:
        "Listing open problems is not the same as suggesting they are close to resolution. Some have been open for decades.",
      sources: [
        {
          label:
            "Planck Collaboration (2020), A&A 641, A6 — composition of the universe",
        },
      ],
    },
  ],
};
