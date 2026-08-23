import type { ScienceModule } from "../schema";

/**
 * BLACK HOLES — where ordinary intuition stops working.
 *
 * This module ships with a 2D SVG cross-section, NOT a lensing shader.
 * The diagram is scientifically clearer than any real-time approximation
 * and cannot consume weeks of shader work (plan Section H, risk 4).
 *
 * Copy discipline here is stricter than anywhere else on the site:
 * dramatic language is exactly what makes black-hole writing inaccurate.
 */
export const blackHoleScience: ScienceModule = {
  destination: "black-holes",
  concepts: [
    {
      id: "event-horizon",
      l1: "The horizon is not a surface. Nothing is there.",
      l2: "An event horizon is a boundary, not an object. It marks where every possible path leads inward. Someone crossing it would notice nothing locally special about the moment they did.",
      l3: "For a non-rotating black hole the horizon sits at the Schwarzschild radius, r = 2GM/c². What happens next depends entirely on who is asking. A distant observer never sees anything cross: infalling material appears to slow, redden and freeze at the boundary as its light is stretched without limit. The infalling observer crosses in finite proper time and measures nothing unusual at the horizon itself. Both descriptions are correct — they are answers to different questions.",
      caveat:
        "Tidal forces at the horizon depend on mass. For a stellar-mass black hole they are lethal well before the horizon; for a supermassive one they are mild at crossing. 'You would not notice' is only true for large enough holes.",
      sources: [
        {
          label:
            "Schwarzschild (1916), Sitzungsberichte der Königlich Preussischen Akademie der Wissenschaften",
        },
        {
          label:
            "Event Horizon Telescope Collaboration (2019), ApJL 875, L1 — first image of the M87* shadow",
          href: "https://eventhorizontelescope.org/",
        },
      ],
    },

    {
      id: "photon-sphere",
      l1: "There is a radius where light itself can orbit.",
      l2: "Closer in than the horizon's surroundings, but still outside it, gravity bends light sharply enough that a photon can circle the black hole.",
      l3: "For a non-rotating black hole the photon sphere lies at r = 3GM/c², exactly 1.5 times the Schwarzschild radius. Those orbits are unstable — the slightest perturbation sends a photon either inward or away — so the photon sphere is not a place light accumulates. It is responsible for the bright ring structure in black-hole images: light that has looped one or more times before escaping toward the observer.",
      caveat:
        "A rotating (Kerr) black hole has no single photon sphere. The radius depends on the direction of the orbit relative to the spin, and the structure is a region rather than a shell.",
      sources: [
        {
          label:
            "Event Horizon Telescope Collaboration (2019), ApJL 875, L5 — physical origin of the ring",
        },
      ],
    },

    {
      id: "accretion-disk",
      l1: "The light comes from the material, not the hole.",
      l2: "A black hole emits nothing. Everything bright in an image of one is matter outside it, heated on its way in.",
      l3: "Material with angular momentum cannot fall straight in; it settles into a disc and spirals inward as viscous processes transport angular momentum outward. Compression and friction heat the inner disc to temperatures that radiate strongly in X-rays. For a non-rotating black hole, stable circular orbits stop at the innermost stable circular orbit, r = 6GM/c², inside which material plunges. Accretion is among the most efficient energy-release mechanisms known — considerably more efficient per unit mass than nuclear fusion.",
      sources: [
        {
          label:
            "Shakura & Sunyaev (1973), A&A 24, 337 — the standard thin-disc model",
        },
      ],
    },

    {
      id: "hawking-radiation",
      l1: "In theory, black holes evaporate. Nobody has seen it.",
      l2: "Quantum field theory in curved spacetime predicts that black holes emit a faint thermal radiation and slowly lose mass. The prediction is taken seriously. The observation has never been made.",
      l3: "Hawking showed in 1974 that a black hole should radiate as a black body with a temperature inversely proportional to its mass. That makes the effect vanishingly weak for anything astrophysical: a stellar-mass black hole has a Hawking temperature far below the 2.725 K cosmic microwave background, so it currently absorbs far more energy than it emits and is growing, not evaporating. Evaporation could only begin once the universe has cooled below that temperature, on timescales enormously longer than its present age.",
      caveat:
        "Hawking radiation is a theoretical result that has never been observed. Laboratory analogue systems have produced suggestive results, but they are analogues, not black holes.",
      sources: [
        {
          label: "Hawking (1974), Nature 248, 30 — 'Black hole explosions?'",
        },
      ],
    },

    {
      id: "information-paradox",
      l1: "This one is genuinely unresolved.",
      l2: "Quantum mechanics says information is never destroyed. The simplest reading of black-hole evaporation says it is. Both cannot be right, and physics does not currently have an agreed answer.",
      l3: "If Hawking radiation is exactly thermal, it carries no information about what formed the black hole, so evaporation would destroy information — contradicting the unitarity of quantum mechanics. Proposed resolutions include information escaping in subtle correlations within the radiation, remnants, complementarity, firewalls, and more recently arguments based on the entanglement entropy of the radiation. None is established.",
      caveat:
        "This is an open problem, not a settled result presented simply. Any confident-sounding answer to it is overstating the state of the field.",
      sources: [
        {
          label:
            "Hawking (1976), Phys. Rev. D 14, 2460 — 'Breakdown of predictability in gravitational collapse'",
        },
        {
          label:
            "Almheiri, Marolf, Polchinski & Sully (2013), JHEP 2013:62 — 'Black holes: complementarity or firewalls?'",
        },
      ],
    },
  ],
};
