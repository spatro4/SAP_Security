import { markdownToHtml } from "./markdown";
import type { InterviewQuestion, Scenario } from "./content-types";

export interface RenderedQuestion extends InterviewQuestion {
  detailedAnswerHtml: string;
  diagramHtml?: string;
}

export interface RenderedScenario extends Scenario {
  situationHtml: string;
  resolutionHtml: string;
  diagramHtml?: string;
}

export function mermaidHtml(source: string): string {
  const escaped = source.replace(/"/g, "&quot;");
  return `<div class="mermaid-container"><div class="mermaid-diagram-source" data-mermaid="${escaped}"></div></div>`;
}

export async function renderQuestions(questions: InterviewQuestion[]): Promise<RenderedQuestion[]> {
  return Promise.all(
    questions.map(async (q) => ({
      ...q,
      detailedAnswerHtml: await markdownToHtml(q.detailedAnswer),
      diagramHtml: q.diagram ? mermaidHtml(q.diagram) : undefined,
    }))
  );
}

export async function renderScenarios(scenarios: Scenario[]): Promise<RenderedScenario[]> {
  return Promise.all(
    scenarios.map(async (s) => ({
      ...s,
      situationHtml: await markdownToHtml(s.situation),
      resolutionHtml: await markdownToHtml(s.resolution),
      diagramHtml: s.diagram ? mermaidHtml(s.diagram) : undefined,
    }))
  );
}
