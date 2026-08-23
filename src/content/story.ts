import { UNKNOWN, type StorySegment } from "./schema";

/**
 * MY STORY — a timeline in a site about time.
 *
 * This is the one section where the metaphor becomes literal rather than
 * decorative, so it earns the treatment. Everything here traces to the
 * resume or to Abhay's own corrections; nothing is dramatised.
 *
 * `challenges` is UNKNOWN on purpose. It is the segment that would most
 * humanise the section and the one thing the dataset cannot supply. It
 * stays visibly empty until Abhay writes it himself -- inventing a
 * struggle would be the single worst thing this site could do.
 */
export const storySegments: StorySegment[] = [
  {
    id: "origin",
    label: "Origin",
    marker: "Kasaragod, Kerala → Bangalore · 2023",
    body: "Kasaragod, Kerala. The Bachelor of Computer Applications at CMR University meant moving to Bangalore — a change of position on a timeline, before any of the rest of this had a shape.",
  },
  {
    id: "discovery",
    label: "Discovery",
    marker: "2023 – 2026",
    body: "The degree specialised in Cloud Computing, with Blockchain and Artificial Intelligence as major subjects alongside it. Three fields that answer very different questions, studied in parallel rather than in sequence.",
  },
  {
    id: "learning",
    label: "Learning",
    marker: "2023 – 2026",
    body: "C, Java and Python. HTML and CSS. SQL and database fundamentals. Linux, shell scripting, Git and the tooling around them. AWS fundamentals — EC2, S3, virtualization — and the basics of Azure. Alongside the degree: NPTEL's Cloud Computing course, an introduction to Python programming, and Git and GitHub basics.",
  },
  {
    id: "experiments",
    label: "Experiments",
    marker: "June 2025 – May 2026",
    body: "Five builds in under a year, and they do not sit in one category. A voting machine built conventionally, then the same problem rebuilt on a blockchain where no administrator holds the record. A chatbot. An Arduino that finds objects by timing an echo. And, during the internship, a working e-commerce platform under real project conditions.",
    projects: [
      "ecommerce-website",
      "digital-voting-machine",
      "dvoting",
      "object-detection-system",
      "ai-chatbot",
    ],
  },
  {
    id: "challenges",
    label: "Challenges",
    marker: UNKNOWN,
    // DELIBERATE GAP. See module docblock. Do not fill this in.
    body: UNKNOWN,
  },
  {
    id: "present",
    label: "Present",
    marker: "2026",
    body: "BCA graduate, specialising in Cloud Computing. The EduPhoenix Solutions internship completed in August 2025, where the organisation noted punctuality, hard work and curiosity — the only outside assessment in this record, and worth stating exactly as it was given.",
  },
  {
    id: "next",
    label: "Next destination",
    marker: "Not yet",
    body: "Looking for an entry-level Software Developer or IT role — somewhere to apply this and keep going. Deliberately the least resolved part of this page, because it is the part that has not happened.",
  },
];
