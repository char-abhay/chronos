import type { ScienceModule } from "../schema";

/**
 * EARTH — the first rung of the scale ladder, and the only place in the
 * dataset where the arrow of time has ever actually been experienced by
 * anyone. Kept grounded and small: this section's job is to make the
 * jump to Solar System feel like a jump.
 */
export const earthScience: ScienceModule = {
  destination: "earth",
  concepts: [
    {
      id: "escape-velocity",
      l1: "Leaving requires about 11.2 kilometres per second.",
      l2: "Escape velocity is the speed at which something would need to be launched, with no further push, to never fall back. From Earth's surface that is roughly 11.2 km/s — about 40,000 km/h.",
      l3: "Escape velocity follows from v = √(2GM/r), and depends only on the mass of the body and the distance from its centre — not on the mass of the object leaving. A pebble and a spacecraft need the same speed. In practice rockets never reach it in a single instantaneous burst; they accelerate continuously while climbing, which is why the figure describes a threshold rather than a launch speed.",
      caveat:
        "The 11.2 km/s figure ignores atmospheric drag and assumes no continued thrust. Real missions are planned in terms of delta-v budgets instead.",
      sources: [
        {
          label:
            "NASA, Basics of Space Flight — gravitation and escape velocity",
          href: "https://science.nasa.gov/learn/basics-of-space-flight/",
        },
      ],
    },

    {
      id: "day-length",
      l1: "The day is getting longer.",
      l2: "A day is not a fixed quantity. Tidal interaction between the Earth and the Moon is gradually slowing Earth's rotation, stretching the length of a day over geological time.",
      l3: "Tidal friction transfers angular momentum from Earth's rotation to the Moon's orbit: the Moon recedes by roughly 3.8 cm per year, measured directly by laser ranging off retroreflectors left by the Apollo missions, and Earth's rotation slows correspondingly. Combining modern measurements with records of ancient eclipses gives a mean lengthening of the day on the order of 1.8 milliseconds per century. Hundreds of millions of years ago the day was measurably shorter.",
      caveat:
        "The rate is not constant. Redistribution of mass within Earth — glacial rebound, core–mantle coupling, large earthquakes — changes rotation on shorter timescales, which is why leap seconds have been irregular rather than periodic.",
      sources: [
        {
          label:
            "Stephenson, Morrison & Hohenkerk (2016), Proc. R. Soc. A 472, 20160404 — 'Measurement of the Earth's rotation: 720 BC to AD 2015'",
        },
        {
          label:
            "Dickey et al. (1994), Science 265, 482 — Lunar Laser Ranging results",
        },
      ],
    },

    {
      id: "one-observer",
      l1: "Every measurement of time ever made was made from here.",
      l2: "Every clock discussed on this site, every confirmation of relativity, every recorded observation of the sky — all of it was carried out from one planet, by one species, over a very short interval.",
      l3: "This is a real constraint on the data, not a rhetorical point. Cosmology is built on observations taken from a single vantage point at essentially a single moment on cosmic timescales — a few centuries of instruments against a 13.8-billion-year history. Much of the confidence in the results comes from the cosmological principle: the assumption that the universe looks broadly the same from anywhere, which is supported by observation but is an assumption nonetheless.",
      caveat:
        "The cosmological principle is well tested on large scales but remains an assumption underpinning a great deal of what follows.",
      sources: [
        {
          label:
            "Planck Collaboration (2020), A&A 641, A6 — 'Planck 2018 results. VI. Cosmological parameters'",
        },
      ],
    },
  ],
};
