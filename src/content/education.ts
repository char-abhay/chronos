import { UNKNOWN, type Education } from "./schema";

export const education: Education = {
  qualification: "Bachelor of Computer Applications",
  institution: "CMR University",
  location: "Bangalore, Karnataka, India",
  dates: { start: "2023", end: "2026", label: "2023 – 2026" },
  majorSubjects: ["Cloud Computing", "Blockchain", "Artificial Intelligence"],
  specialisation: "Cloud Computing",
  // Resume states the year only. Not inferred.
  graduationMonth: UNKNOWN,
};
