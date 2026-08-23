/* The content layer's public surface.
   Nothing here imports React, styling or 3D. */
export * from "./schema";
export { profile } from "./profile";
export { education } from "./education";
export { experience } from "./experience";
export { skillGroups, softSkills, certifications } from "./skills";
export { projects, projectsOrdered, getProject } from "./projects";
export { destinations, getDestination } from "./destinations";
export { storySegments } from "./story";
