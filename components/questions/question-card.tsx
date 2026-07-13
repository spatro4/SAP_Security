"use client";

import * as React from "react";
import { ChevronDown, Lightbulb, MessageCircleQuestion, AlertOctagon, Terminal, Table2, KeyRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookmarkButton } from "@/components/bookmark-button";
import { NotesDialog } from "@/components/notes-dialog";
import { DIFFICULTY_BADGE } from "@/lib/difficulty";
import { useAppStore } from "@/lib/store";
import type { RenderedQuestion } from "@/lib/render-content";

export function QuestionCard({ question }: { question: RenderedQuestion }) {
  const [open, setOpen] = React.useState(false);
  const [showHints, setShowHints] = React.useState(false);
  const { reviewCard } = useAppStore();
  const href = `/questions/${question.category}#${question.id}`;

  return (
    <Card id={question.id} className="scroll-mt-24">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <Badge variant={DIFFICULTY_BADGE[question.difficulty]}>{question.difficulty}</Badge>
              {question.tags.slice(0, 3).map((t) => (
                <Badge key={t} variant="outline">
                  {t}
                </Badge>
              ))}
            </div>
            <button className="text-left font-semibold hover:text-primary" onClick={() => setOpen((o) => !o)}>
              {question.question}
            </button>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setOpen((o) => !o)} aria-label="Expand">
            <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
          </Button>
        </div>

        {!open && <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{question.expectedAnswer}</p>}

        {open && (
          <div className="mt-4 space-y-4 border-t border-border pt-4">
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowHints((h) => !h)}>
                <Lightbulb className="h-4 w-4" /> {showHints ? "Hide Hints" : "Show Hints"}
              </Button>
              <BookmarkButton id={`question:${question.id}`} type="question" title={question.question} href={href} category={question.category} />
              <NotesDialog id={`question:${question.id}`} title={question.question} refHref={href} />
            </div>

            {showHints && (
              <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                {question.hints.map((h, i) => (
                  <li key={i}>{h}</li>
                ))}
              </ul>
            )}

            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Expected Answer</p>
              <p className="text-sm">{question.expectedAnswer}</p>
            </div>

            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Detailed Answer</p>
              <div className="prose-sap text-sm" dangerouslySetInnerHTML={{ __html: question.detailedAnswerHtml }} />
            </div>

            {question.diagramHtml && (
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Architecture Diagram</p>
                <div dangerouslySetInnerHTML={{ __html: question.diagramHtml }} />
              </div>
            )}

            {question.followUps.length > 0 && (
              <div>
                <p className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <MessageCircleQuestion className="h-3.5 w-3.5" /> Follow-up Questions
                </p>
                <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                  {question.followUps.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              </div>
            )}

            {question.commonMistakes.length > 0 && (
              <div>
                <p className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <AlertOctagon className="h-3.5 w-3.5" /> Common Mistakes
                </p>
                <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                  {question.commonMistakes.map((m, i) => (
                    <li key={i}>{m}</li>
                  ))}
                </ul>
              </div>
            )}

            {question.scenario && (
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Real Scenario</p>
                <p className="text-sm text-muted-foreground">{question.scenario}</p>
              </div>
            )}

            <div className="flex flex-wrap gap-4 text-xs">
              {question.tcodes.length > 0 && (
                <span className="flex items-center gap-1.5">
                  <Terminal className="h-3.5 w-3.5 text-primary" />
                  {question.tcodes.map((t) => (
                    <code key={t} className="rounded bg-muted px-1.5 py-0.5">
                      {t}
                    </code>
                  ))}
                </span>
              )}
              {question.tables.length > 0 && (
                <span className="flex items-center gap-1.5">
                  <Table2 className="h-3.5 w-3.5 text-primary" />
                  {question.tables.map((t) => (
                    <code key={t} className="rounded bg-muted px-1.5 py-0.5">
                      {t}
                    </code>
                  ))}
                </span>
              )}
              {question.authObjects.length > 0 && (
                <span className="flex items-center gap-1.5">
                  <KeyRound className="h-3.5 w-3.5 text-primary" />
                  {question.authObjects.map((t) => (
                    <code key={t} className="rounded bg-muted px-1.5 py-0.5">
                      {t}
                    </code>
                  ))}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 border-t border-border pt-3">
              <span className="text-xs text-muted-foreground">Rate your recall for spaced revision:</span>
              {(["again", "hard", "good", "easy"] as const).map((r) => (
                <Button key={r} size="sm" variant="outline" onClick={() => reviewCard(`question:${question.id}`, "question", r)}>
                  {r}
                </Button>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
