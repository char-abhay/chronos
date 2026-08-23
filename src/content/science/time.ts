import type { ScienceModule } from "../schema";

/**
 * TIME — the flagship module.
 *
 * Deliberately the richest science content on the site, and deliberately
 * rendered in SVG/DOM rather than 3D (plan Section H): two clocks, a
 * velocity control and a live Lorentz factor communicate relativity
 * better than any polygon.
 *
 * Every L3 claim carries a citation. Where the physics is unsettled,
 * the caveat says so -- uncertainty is on-theme, not a weakness.
 */
export const timeScience: ScienceModule = {
  destination: "time",
  concepts: [
    {
      id: "light-delay",
      l1: "You are looking at the past.",
      l2: "Light is fast, but it is not instant. Everything you can see is being seen as it was when the light left it — 1.3 seconds ago for the Moon, 8 minutes 20 seconds for the Sun, 4.2 years for the nearest star.",
      l3: "The speed of light in vacuum, c, is exactly 299,792,458 metres per second — not measured but defined, since the metre was redefined in terms of it in 1983. Delay is simply distance divided by c. Nothing carrying information has ever been observed to travel faster, so there is no view of any distant object except a delayed one. 'Now', applied to somewhere else, is not something anyone can observe.",
      sources: [
        {
          label:
            "BIPM, The International System of Units (SI), 9th edition — definition of the metre via the fixed value of c",
          href: "https://www.bipm.org/en/publications/si-brochure",
        },
      ],
    },

    {
      id: "velocity-time-dilation",
      l1: "A moving clock ticks slower — as measured from here.",
      l2: "The faster something moves relative to you, the more slowly its clock runs from your point of view. At everyday speeds the effect is far too small to notice. Near the speed of light it becomes enormous.",
      l3: "The Lorentz factor γ = 1 / √(1 − v²/c²) relates the time measured in your frame to the proper time experienced by the moving object. At 10% of c, γ ≈ 1.005. At 99%, γ ≈ 7.09. At 99.99%, γ ≈ 70.7. This is measured routinely: muons created in the upper atmosphere reach the ground in far greater numbers than their 2.2-microsecond half-life would allow, because their clocks — from ours — run slow.",
      caveat:
        "The effect is symmetric between two inertial observers: each measures the other's clock as running slow, and neither is wrong. Asking which one is 'really' slower is asking a question the theory does not answer.",
      sources: [
        {
          label:
            "Rossi & Hall (1941), Phys. Rev. 59, 223 — atmospheric muon decay as direct evidence of time dilation",
        },
        {
          label:
            "Einstein (1905), Annalen der Physik 17, 891 — 'On the Electrodynamics of Moving Bodies'",
        },
      ],
    },

    {
      id: "twin-paradox",
      l1: "One twin leaves, comes back, and is younger.",
      l2: "If time dilation is symmetric, why does one twin actually end up younger? Because the situation is not symmetric. Only one of them turns around.",
      l3: "The travelling twin changes inertial frames at the turnaround, and the stay-at-home twin does not. That asymmetry — not motion itself, which is relative — is what makes the elapsed proper times genuinely different when the paths meet again. It has been measured directly: in 1971 Hafele and Keating flew caesium clocks around the world in both directions and compared them against clocks at the U.S. Naval Observatory, finding differences of tens of nanoseconds that matched prediction.",
      caveat:
        "The 'paradox' is not a paradox in the theory. It only appears as one when the traveller's frame change is left out of the description.",
      sources: [
        {
          label:
            "Hafele & Keating (1972), Science 177, 166 — 'Around-the-World Atomic Clocks: Observed Relativistic Time Gains'",
        },
      ],
    },

    {
      id: "gravitational-time-dilation",
      l1: "Clocks run slower deeper in gravity.",
      l2: "Time does not pass at the same rate at sea level as it does on a mountain. A clock closer to a mass runs measurably slower than one further away. This is not a mechanical effect on the clock — it is the rate of time itself.",
      l3: "General relativity predicts that clocks deeper in a gravitational potential tick slower relative to distant ones. GPS depends on correcting for it: satellite clocks gain roughly 45 microseconds per day from being higher in Earth's field, and lose roughly 7 microseconds per day from their orbital speed, for a net gain near 38 microseconds per day. Left uncorrected, position errors would accumulate at kilometres per day. The effect was first measured terrestrially by Pound and Rebka in 1959 over a 22.5-metre tower, and optical clocks are now sensitive enough to resolve a height difference of about 33 centimetres.",
      sources: [
        {
          label:
            "Pound & Rebka (1960), Phys. Rev. Lett. 4, 337 — 'Apparent Weight of Photons'",
        },
        {
          label:
            "Chou, Hume, Rosenband & Wineland (2010), Science 329, 1630 — 'Optical Clocks and Relativity'",
        },
      ],
    },

    {
      id: "arrow-of-time",
      l1: "Almost every law of physics works the same run backwards. Your experience does not.",
      l2: "Watch a film of two billiard balls colliding in reverse and nothing looks wrong. Watch a film of a cup shattering in reverse and everything does. The difference is not in the fundamental laws — it is statistical.",
      l3: "The microscopic laws of mechanics and electromagnetism are very nearly time-symmetric. The macroscopic asymmetry comes from the second law of thermodynamics: there are vastly more disordered configurations than ordered ones, so systems overwhelmingly move toward higher entropy. That only produces a direction if the universe started in a very low-entropy state — which, as far as can be determined, it did.",
      caveat:
        "Why the early universe had such low entropy is an open question, not a settled result. There is also one known exception to time-symmetry at the fundamental level: CP violation in the weak interaction, first observed in neutral kaon decay by Christenson, Cronin, Fitch and Turlay in 1964.",
      sources: [
        {
          label:
            "Christenson, Cronin, Fitch & Turlay (1964), Phys. Rev. Lett. 13, 138 — evidence for CP violation",
        },
      ],
    },

    {
      id: "causality",
      l1: "Could you reach your own past?",
      l2: "Nothing in the equations of general relativity forbids it outright. Certain solutions contain closed timelike curves — paths through spacetime that return to their own starting point. Whether any of them describe anything real is a different question.",
      l3: "Gödel published a rotating-universe solution containing closed timelike curves in 1949, and others have been constructed since. Physicists generally regard them as artefacts of unphysical assumptions rather than as predictions. Two ideas frame the debate: the Novikov self-consistency principle, which holds that only self-consistent histories can occur, and Hawking's chronology protection conjecture, which proposes that quantum effects prevent closed timelike curves from forming at all.",
      caveat:
        "The chronology protection conjecture is a conjecture. It has not been proved, and the question is genuinely open.",
      sources: [
        {
          label:
            "Gödel (1949), Rev. Mod. Phys. 21, 447 — 'An Example of a New Type of Cosmological Solution'",
        },
        {
          label:
            "Hawking (1992), Phys. Rev. D 46, 603 — 'Chronology protection conjecture'",
        },
      ],
    },
  ],
};
