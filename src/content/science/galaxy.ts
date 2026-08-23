import type { ScienceModule } from "../schema";

/**
 * GALAXY — third rung. Structure and scale are the content, which is why
 * this is a Points cloud rather than a static image: one buffer, one draw
 * call, no models and no shader authoring required (plan Section H).
 */
export const galaxyScience: ScienceModule = {
  destination: "galaxy",
  concepts: [
    {
      id: "galactic-scale",
      l1: "Every point of light here is a different age.",
      l2: "The Milky Way is roughly 100,000 light-years across. Looking at one edge and then the other means looking at two views separated by tens of thousands of years.",
      l3: "The Sun sits about 26,000 light-years from the galactic centre and completes one orbit in something like 225 to 250 million years — a single galactic year, of which the Sun has managed perhaps twenty since forming. Because light delay scales with distance, an image of the galaxy is not a snapshot of a moment: it is a composite of many different epochs, arriving together.",
      caveat:
        "The Milky Way's diameter is not sharply defined — estimates vary with which population of stars is counted, and the stellar disc fades out rather than ending.",
      sources: [
        {
          label:
            "GRAVITY Collaboration (2019), A&A 625, L10 — geometric distance to the Galactic Centre",
        },
      ],
    },

    {
      id: "stellar-evolution",
      l1: "A star's mass decides almost everything about its life.",
      l2: "How brightly a star burns, how long it lasts and how it ends are set mostly by how much material it started with. More mass means a shorter, more violent life.",
      l3: "Stars spend most of their existence fusing hydrogen on the main sequence. Luminosity rises very steeply with mass — roughly as the third to fourth power — so a star ten times the Sun's mass burns through its fuel thousands of times faster despite having more of it. Low-mass stars end as white dwarfs; sufficiently massive ones collapse and explode as core-collapse supernovae, leaving a neutron star or a black hole.",
      sources: [
        {
          label:
            "Hertzsprung (1911) and Russell (1913) — the Hertzsprung–Russell diagram",
        },
      ],
    },

    {
      id: "neutron-stars",
      l1: "Some stars end as clocks.",
      l2: "A neutron star packs more than the Sun's mass into a sphere about the size of a city. Some of them spin rapidly and sweep a beam past us with extraordinary regularity.",
      l3: "A typical neutron star holds around 1.4 solar masses within a radius near 10 kilometres, at densities comparable to an atomic nucleus. Pulsars are rotating neutron stars whose beamed emission crosses our line of sight once per rotation; the first was detected by Jocelyn Bell Burnell in 1967. The most stable millisecond pulsars keep time well enough to be compared against atomic clocks, and the orbital decay of the Hulse–Taylor binary pulsar provided the first evidence for gravitational waves.",
      sources: [
        {
          label:
            "Hewish, Bell, Pilkington, Scott & Collins (1968), Nature 217, 709 — discovery of pulsars",
        },
        {
          label:
            "Taylor & Weisberg (1982), ApJ 253, 908 — orbital decay of PSR B1913+16",
        },
      ],
    },

    {
      id: "dark-matter",
      l1: "Most of the mass here has never been seen.",
      l2: "Galaxies rotate as though they contain far more mass than their visible stars and gas account for. Something is there gravitationally that does not emit light.",
      l3: "Vera Rubin and Kent Ford's measurements in the 1970s showed that rotation velocities in spiral galaxies stay flat far from the centre, rather than falling off as visible-mass models predict. Independent lines of evidence — gravitational lensing, the cosmic microwave background power spectrum, and the mass distribution in colliding clusters such as the Bullet Cluster — point the same way.",
      caveat:
        "Dark matter is inferred from its gravitational effects. It has not been directly detected, no particle has been identified, and alternative explanations modifying gravity remain under active investigation, though they struggle to account for all the evidence at once.",
      sources: [
        {
          label:
            "Rubin & Ford (1970), ApJ 159, 379 — rotation curve of M31",
        },
        {
          label:
            "Clowe et al. (2006), ApJL 648, L109 — 'A Direct Empirical Proof of the Existence of Dark Matter'",
        },
      ],
    },
  ],
};
