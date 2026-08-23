import type { Profile } from "./schema";

/* Source: Abhay P Resume (read 2026-08-24). Nothing inferred. */
export const profile: Profile = {
  name: "Abhay P",
  credential: "BCA Graduate",
  location: "Kasaragod, Kerala, India",
  email: "abhayunni111@gmail.com",
  links: {
    github: {
      label: "github.com/char-abhay",
      href: "https://github.com/char-abhay",
      external: true,
    },
    linkedin: {
      label: "linkedin.com/in/abhayptech",
      href: "https://linkedin.com/in/abhayptech",
      external: true,
    },
    resume: {
      label: "Resume (PDF)",
      href: "/Abhay-P-Resume.pdf",
    },
  },
  // Verbatim from the resume's Career Objective.
  objective:
    "BCA graduate with hands-on experience in full stack development through an industry internship and academic projects. Skilled in programming, web technologies, databases, and cloud fundamentals, with practical exposure to AI, Blockchain, and IoT. Seeking an entry-level Software Developer or IT role to apply my technical skills and grow within a professional environment.",
};
