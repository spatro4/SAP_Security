export interface ChapterFrontmatter {
  title: string;
  category: string;
  slug: string;
  order: number;
  summary: string;
  tags: string[];
  estMinutes: number;
  level: "Consultant" | "Senior Consultant" | "Lead" | "Architect" | "Principal Architect";
}

export interface Chapter extends ChapterFrontmatter {
  html: string;
  sections: { id: string; title: string; depth: number }[];
}

export interface ChapterSummary extends ChapterFrontmatter {
  href: string;
}

export type Difficulty = "Easy" | "Medium" | "Hard" | "Architect" | "Manager" | "Principal Architect";

export interface InterviewQuestion {
  id: string;
  category: string;
  difficulty: Difficulty;
  question: string;
  hints: string[];
  expectedAnswer: string;
  detailedAnswer: string;
  followUps: string[];
  commonMistakes: string[];
  tcodes: string[];
  tables: string[];
  authObjects: string[];
  scenario?: string;
  diagram?: string;
  tags: string[];
  askedBy?: string[];
}

export interface Scenario {
  id: string;
  category: string;
  title: string;
  difficulty: Difficulty;
  situation: string;
  troubleshootingSteps: string[];
  toolsUsed: string[];
  tablesChecked: string[];
  authObjects: string[];
  rootCause: string;
  resolution: string;
  preventiveMeasures: string[];
  relatedQuestionIds?: string[];
  diagram?: string;
}

export interface Flashcard {
  id: string;
  category: string;
  front: string;
  back: string;
}

export type QuizQuestionType = "mcq" | "true-false" | "scenario" | "drag-drop";

export interface QuizOption {
  id: string;
  text: string;
}

export interface QuizQuestion {
  id: string;
  category: string;
  type: QuizQuestionType;
  difficulty: Difficulty;
  prompt: string;
  options?: QuizOption[];
  correctOptionIds?: string[];
  correctBoolean?: boolean;
  dragItems?: string[];
  dragTargets?: string[];
  correctMapping?: Record<string, string>;
  explanation: string;
}

export interface GlossaryTerm {
  term: string;
  category: string;
  definition: string;
  related?: string[];
}

export interface ArchitectureDiagram {
  id: string;
  title: string;
  category: string;
  description: string;
  mermaid: string;
}

export interface AuthObjectEntry {
  object: string;
  description: string;
  category: string;
  fields: { field: string; description: string }[];
  relatedTcodes: string[];
}

export interface TransactionEntry {
  tcode: string;
  description: string;
  category: string;
  relatedTables?: string[];
}

export interface TableEntry {
  table: string;
  description: string;
  category: string;
}
