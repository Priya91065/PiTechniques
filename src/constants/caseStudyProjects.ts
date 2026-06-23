import data from "./caseStudyProjects.json";

/** Typed view over case-studies-data.json (faithful copy of the PHP data). */
export interface Solution {
  title: string;
  subTitle: string;
  list: string[];
}
export interface KeyFeature {
  img: string;
  feature: string;
}
export interface Impact {
  img: string;
  title: string;
  subTitle: string;
}
export interface CaseStudyProject {
  topSection: { title: string; shortDesc: string; tags: string[]; img: string; logo: string };
  projectInfo: {
    name: string;
    projectDetails: { industry: string; headquarters: string; website: string };
  };
  challenges: { shortInfo: string; lists: string[]; background: string };
  piSolution: { details: string; solutions?: Solution[] };
  keyFeature: KeyFeature[];
  longTermImpact: { title: string; impact: Impact[] };
  previous: { label: string; link: string };
  next: { label: string; link: string };
}

export const caseStudyProjects = (data as { projects: Record<string, CaseStudyProject> }).projects;
