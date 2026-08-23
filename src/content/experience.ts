import type { Experience } from "./schema";

/**
 * The only professional experience in the dataset.
 *
 * `deliverables` links the E-commerce Website here. Abhay confirmed on
 * 2026-08-24 that it was built during this internship, not as coursework
 * -- his resume currently files it under Academic Projects, and his
 * correction overrides the resume.
 *
 * This is what turns the internship from three generic bullets into
 * evidence: bullet 3 now names a build the reader can go and look at.
 */
export const experience: Experience[] = [
  {
    role: "Full Stack Development Intern",
    organisation: "EduPhoenix Solutions Pvt. Ltd.",
    location: "Bangalore",
    dates: { start: "2025-06", end: "2025-08", label: "June 2025 – August 2025" },
    // Verbatim from the resume. Never paraphrased into stronger claims.
    bullets: [
      "Completed a hands-on internship focused on Full Stack Development, gaining practical exposure to end-to-end web application development.",
      "Recognized by the organization for being punctual, hardworking, and inquisitive throughout the internship.",
      "Applied front-end and back-end development concepts to build and troubleshoot functional web features under real-world project conditions.",
    ],
    deliverables: ["ecommerce-website"],
  },
];
