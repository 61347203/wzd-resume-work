export type ViewKey = "digital" | "data" | "operations";

export interface ViewProfile {
  label: string;
  eyebrow: string;
  role: string;
  title: string;
  summary: string;
  focusTitle: string;
  focusText: string;
  workTitle: string;
  workSummary: string;
  strengths: string[];
  highlights: { value: string; suffix: string; label: string }[];
  projectOrder: string[];
  capabilityOrder: string[];
  evidenceOrder: number[];
}

export interface Project {
  id: string;
  index: string;
  title: string;
  subtitle: string;
  tags: string[];
  metrics: { value: string; label: string }[];
  problem: string;
  analysis: string;
  actions: string[];
  result: string;
  reflection: string;
  visual: "agent" | "automation" | "dashboard";
}
