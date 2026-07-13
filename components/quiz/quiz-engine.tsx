"use client";

import * as React from "react";
import { CheckCircle2, XCircle, RotateCcw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import type { QuizQuestion } from "@/lib/content-types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function QuizEngine({ questions, categoryLabel }: { questions: QuizQuestion[]; categoryLabel: string }) {
  const [order] = React.useState(() => shuffle(questions));
  const [index, setIndex] = React.useState(0);
  const [answered, setAnswered] = React.useState(false);
  const [selected, setSelected] = React.useState<string[]>([]);
  const [boolAnswer, setBoolAnswer] = React.useState<boolean | null>(null);
  const [mapping, setMapping] = React.useState<Record<string, string>>({});
  const [score, setScore] = React.useState(0);
  const [finished, setFinished] = React.useState(false);
  const { recordQuizAttempt, registerMiss } = useAppStore();

  const current = order[index];

  function isCorrect(): boolean {
    if (!current) return false;
    if (current.type === "mcq" || current.type === "scenario") {
      const correct = current.correctOptionIds ?? [];
      return correct.length === selected.length && correct.every((c) => selected.includes(c));
    }
    if (current.type === "true-false") {
      return boolAnswer === current.correctBoolean;
    }
    if (current.type === "drag-drop") {
      const correctMap = current.correctMapping ?? {};
      return Object.entries(correctMap).every(([k, v]) => mapping[k] === v);
    }
    return false;
  }

  function submit() {
    const correct = isCorrect();
    if (correct) setScore((s) => s + 1);
    else registerMiss(current.category);
    setAnswered(true);
  }

  function next() {
    if (index + 1 >= order.length) {
      recordQuizAttempt({ category: categoryLabel, score: score, total: order.length });
      setFinished(true);
      return;
    }
    setIndex((i) => i + 1);
    setAnswered(false);
    setSelected([]);
    setBoolAnswer(null);
    setMapping({});
  }

  function restart() {
    setIndex(0);
    setAnswered(false);
    setSelected([]);
    setBoolAnswer(null);
    setMapping({});
    setScore(0);
    setFinished(false);
  }

  if (order.length === 0) {
    return <p className="text-sm text-muted-foreground">No quiz questions available for this selection yet.</p>;
  }

  if (finished) {
    const pct = Math.round((score / order.length) * 100);
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
          <h2 className="text-xl font-bold">Quiz Complete</h2>
          <p className="text-4xl font-bold text-primary">{pct}%</p>
          <p className="text-muted-foreground">
            {score} / {order.length} correct
          </p>
          <Button onClick={restart}>
            <RotateCcw className="h-4 w-4" /> Retake Quiz
          </Button>
        </CardContent>
      </Card>
    );
  }

  const correct = answered && isCorrect();

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Progress value={(index / order.length) * 100} className="flex-1" />
        <span className="shrink-0 text-sm text-muted-foreground">
          {index + 1} / {order.length}
        </span>
      </div>

      <Card>
        <CardContent className="space-y-4 p-6">
          <Badge variant="outline">{current.difficulty}</Badge>
          <p className="text-lg font-medium">{current.prompt}</p>

          {current.type === "mcq" || current.type === "scenario" ? (
            <div className="space-y-2">
              {current.options?.map((opt) => {
                const isSelected = selected.includes(opt.id);
                const showCorrect = answered && current.correctOptionIds?.includes(opt.id);
                const showWrong = answered && isSelected && !current.correctOptionIds?.includes(opt.id);
                return (
                  <button
                    key={opt.id}
                    disabled={answered}
                    onClick={() => setSelected((s) => (s.includes(opt.id) ? s.filter((x) => x !== opt.id) : [...s, opt.id]))}
                    className={cn(
                      "flex w-full items-center justify-between rounded-md border px-4 py-2.5 text-left text-sm transition-colors",
                      isSelected ? "border-primary bg-primary/5" : "border-border hover:bg-accent",
                      showCorrect && "border-success bg-success/10",
                      showWrong && "border-destructive bg-destructive/10"
                    )}
                  >
                    <span>{opt.text}</span>
                    {showCorrect && <CheckCircle2 className="h-4 w-4 text-success" />}
                    {showWrong && <XCircle className="h-4 w-4 text-destructive" />}
                  </button>
                );
              })}
            </div>
          ) : current.type === "true-false" ? (
            <div className="flex gap-3">
              {[true, false].map((v) => (
                <button
                  key={String(v)}
                  disabled={answered}
                  onClick={() => setBoolAnswer(v)}
                  className={cn(
                    "flex-1 rounded-md border px-4 py-3 text-sm font-medium transition-colors",
                    boolAnswer === v ? "border-primary bg-primary/5" : "border-border hover:bg-accent",
                    answered && current.correctBoolean === v && "border-success bg-success/10",
                    answered && boolAnswer === v && current.correctBoolean !== v && "border-destructive bg-destructive/10"
                  )}
                >
                  {v ? "True" : "False"}
                </button>
              ))}
            </div>
          ) : current.type === "drag-drop" ? (
            <div className="space-y-3">
              {current.dragItems?.map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <span className="w-48 shrink-0 truncate text-sm">{item}</span>
                  <Select disabled={answered} value={mapping[item] ?? ""} onValueChange={(v) => setMapping((m) => ({ ...m, [item]: v }))}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Match to..." />
                    </SelectTrigger>
                    <SelectContent>
                      {current.dragTargets?.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {answered && (current.correctMapping?.[item] === mapping[item] ? (
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
                  ) : (
                    <XCircle className="h-4 w-4 shrink-0 text-destructive" />
                  ))}
                </div>
              ))}
            </div>
          ) : null}

          {answered && (
            <div className={cn("rounded-md border p-3 text-sm", correct ? "border-success/40 bg-success/5" : "border-destructive/40 bg-destructive/5")}>
              <p className="mb-1 font-medium">{correct ? "Correct" : "Not quite"}</p>
              <p className="text-muted-foreground">{current.explanation}</p>
            </div>
          )}

          <div className="flex justify-end gap-2">
            {!answered ? (
              <Button onClick={submit}>Submit Answer</Button>
            ) : (
              <Button onClick={next}>{index + 1 >= order.length ? "Finish" : "Next Question"}</Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
