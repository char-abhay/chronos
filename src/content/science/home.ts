import type { ScienceModule } from "../schema";

/**
 * HOME — the setup, not the payload.
 *
 * The homepage establishes that light delay is literal and measurable,
 * then hands off to TIME. It must never attempt the interactive physics
 * itself (plan Section E.2).
 */
export const homeScience: ScienceModule = {
  destination: "home",
  concepts: [
    {
      id: "the-delay",
      l1: "You are looking at the past.",
      l2: "Not as a figure of speech. Light travels fast but takes time, so every object you can see is being seen as it was when that light left — the further away, the further back.",
      l3: "Light in vacuum covers 299,792,458 metres each second. Divide any distance by that and you have how old the view is: the Moon at roughly 384,400 km is 1.3 seconds old, the Sun at about 149.6 million km is 8 minutes 20 seconds old, Proxima Centauri is 4.25 years old, and the Andromeda galaxy is roughly 2.5 million years old. There is no other kind of view available.",
      sources: [
        {
          label:
            "BIPM, The International System of Units (SI), 9th edition — the metre is defined by fixing c",
          href: "https://www.bipm.org/en/publications/si-brochure",
        },
        {
          label:
            "IAU (2012) Resolution B2 — astronomical unit defined as exactly 149,597,870,700 m",
        },
      ],
    },

    {
      id: "the-ladder",
      l1: "Distance is measured in time here.",
      l2: "Once light delay is the rule rather than a curiosity, distance stops being a length and starts being a duration. A light-year is not a year — it is how far light gets in one.",
      l3: "Expressing distance as travel time is not a convenience, it is closer to the physics: there is no way to check what a distant object is doing now, only what it was doing when its light departed. The scale ladder used across this site — Moon, Sun, Proxima, galactic centre, Andromeda — is a ladder of delays as much as of distances.",
      caveat:
        "Simultaneity across distance is not observer-independent in relativity. 'What is happening there right now' is not a question with a single correct answer.",
      sources: [
        {
          label:
            "Einstein (1905), Annalen der Physik 17, 891 — relativity of simultaneity",
        },
      ],
    },
  ],
};
