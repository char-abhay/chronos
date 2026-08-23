import { UNKNOWN, type Certification, type SkillGroup } from "./schema";

/**
 * The capability map (plan H: 2D SVG, never 3D, never the only
 * representation of these facts).
 *
 * Levels are kept exactly as the resume states them. "Fundamentals"
 * and "Basics" stay -- understating is more credible than inflating,
 * and a recruiter can tell the difference.
 */
export const skillGroups: SkillGroup[] = [
  {
    id: "languages",
    label: "Programming Languages",
    items: ["C", "Java", "Python"],
  },
  {
    id: "web",
    label: "Web Technologies",
    items: ["HTML", "CSS", "Full Stack Development Basics"],
    // Every link below is justified by that project's own technology
    // list. Nothing is asserted that the project data does not support.
    relatedProjects: ["ecommerce-website", "dvoting"],
  },
  {
    id: "data",
    label: "Database",
    items: ["SQL", "DBMS Basics"],
  },
  {
    id: "cloud",
    label: "Cloud Computing",
    // The specialisation. Named services read as real study;
    // a bare "AWS" reads as filler.
    items: [
      "AWS Fundamentals — EC2, S3, Virtualization",
      "Microsoft Azure Basics",
    ],
    note: "Degree specialisation",
  },
  {
    id: "systems",
    label: "Operating Systems & Tools",
    items: [
      "Linux",
      "Git",
      "GitHub",
      "VS Code",
      "Google Cloud Shell",
      "Shell Scripting Basics",
    ],
  },
  {
    id: "concepts",
    label: "Other Technologies",
    items: ["AI Basics", "Blockchain", "IoT", "Cybersecurity Fundamentals"],
    note: "Coursework-level knowledge",
    relatedProjects: [
      "ai-chatbot",
      "dvoting",
      "object-detection-system",
      "digital-voting-machine",
    ],
  },
];

/**
 * Kept OUT of the capability map on purpose. Mixing self-assessed soft
 * skills into a technical diagram dilutes both. PROFILE only, one line.
 */
export const softSkills: string[] = [
  "Problem Solving",
  "Quick Learning",
  "Team Collaboration",
  "Communication",
  "Active Listening",
  "Research",
  "Adaptability",
];

export const certifications: Certification[] = [
  {
    title: "Cloud Computing",
    provider: "NPTEL",
    format: "Online course",
    date: UNKNOWN,
  },
  {
    title: "Introduction to Python Programming",
    provider: UNKNOWN,
    format: "Online",
    date: UNKNOWN,
  },
  {
    title: "Git & GitHub Basics",
    provider: UNKNOWN,
    format: "Online",
    date: UNKNOWN,
  },
];
