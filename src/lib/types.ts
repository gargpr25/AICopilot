export type CategoryId =
  | "frontend"
  | "backend"
  | "llm"
  | "inference"
  | "embeddings"
  | "vectordb"
  | "retrieval"
  | "rag"
  | "agents"
  | "mcp"
  | "memory"
  | "tools"
  | "observability"
  | "security"
  | "scaling"
  | "evaluation";

export interface Category {
  id: CategoryId;
  name: string;
  color: string;
  blurb: string;
}

export interface IOItem {
  name: string;
  type: string;
  desc: string;
}

export interface Example {
  title: string;
  body: string;
}

export interface AtlasComponent {
  slug: string;
  name: string;
  category: CategoryId;
  tagline: string;
  level: 1 | 2 | 3 | 4; // beginner -> expert
  /** consistent "why" schema */
  whatIsIt: string;
  whyItExists: string;
  whyCantSkip: string;
  ifRemoved: string;
  whereItFits: string;
  calledBy: string[]; // slugs or free text
  callsNext: string[]; // slugs or free text
  inputs: IOItem[];
  outputs: IOItem[];
  requestExample?: string;
  responseExample?: string;
  code?: { lang: string; body: string };
  bestPractices: string[];
  commonMistakes: string[];
  alternatives: string[];
  performance: string;
  scaling: string;
  advantages: string[];
  disadvantages: string[];
  realCompanies: string[];
  interviewQuestions: string[];
  prerequisites: string[]; // slugs
  advanced: string[]; // slugs
  related: string[]; // slugs
}

export interface Module {
  id: number;
  slug: string;
  title: string;
  level: "Beginner" | "Intermediate" | "Advanced" | "Expert";
  summary: string;
  objectives: string[];
  concepts: string[]; // component slugs
  keyTakeaways: string[];
  overview?: string;
  commonMistakes?: string[];
  practicalExercises?: string[];
  interviewQuestions?: string[];
}

export interface FlowNodeDef {
  id: string;
  label: string;
  category: CategoryId;
  slug?: string; // link to component
  note?: string;
}

export interface FlowLevel {
  id: number;
  name: string;
  description: string;
  nodes: string[]; // node ids in order
}

export interface Architecture {
  slug: string;
  name: string;
  vendor: string;
  tagline: string;
  steps: { label: string; slug?: string; detail: string }[];
  highlights: string[];
  stack: string[];
  overview?: string;
  keyDecisions?: string[];
  tradeoffs?: string[];
  scaleNotes?: string;
  lessonsLearned?: string[];
}

export interface ComparisonTable {
  slug: string;
  title: string;
  columns: string[];
  rows: string[][];
  takeaway: string;
}

export interface GlossaryEntry {
  term: string;
  definition: string;
  slug?: string;
}

export interface CheatSheet {
  slug: string;
  title: string;
  sections: { heading: string; items: string[] }[];
}
