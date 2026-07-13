"use client";

import * as React from "react";
import { ListChecks } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { QuizEngine } from "@/components/quiz/quiz-engine";
import { CATEGORIES, DIFFICULTIES } from "@/lib/categories";
import type { QuizQuestion } from "@/lib/content-types";

export function QuizSetup({ questions }: { questions: QuizQuestion[] }) {
  const [category, setCategory] = React.useState<string>("all");
  const [difficulty, setDifficulty] = React.useState<string>("all");
  const [started, setStarted] = React.useState(false);

  const filtered = questions.filter(
    (q) => (category === "all" || q.category === category) && (difficulty === "all" || q.difficulty === difficulty)
  );

  if (started) {
    return (
      <QuizEngine
        questions={filtered}
        categoryLabel={category === "all" ? "Mixed" : CATEGORIES.find((c) => c.slug === category)?.shortTitle ?? category}
      />
    );
  }

  return (
    <Card className="mx-auto max-w-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ListChecks className="h-5 w-5 text-primary" /> Quiz Setup
        </CardTitle>
        <CardDescription>MCQ, True/False, Scenario, and Drag-Drop questions. Choose your focus area.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="mb-1.5 text-sm font-medium">Category</p>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {CATEGORIES.map((c) => (
                <SelectItem key={c.slug} value={c.slug}>
                  {c.shortTitle}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <p className="mb-1.5 text-sm font-medium">Difficulty</p>
          <Select value={difficulty} onValueChange={setDifficulty}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Difficulties</SelectItem>
              {DIFFICULTIES.map((d) => (
                <SelectItem key={d} value={d}>
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <p className="text-sm text-muted-foreground">{filtered.length} question(s) match your filters.</p>
        <Button className="w-full" disabled={filtered.length === 0} onClick={() => setStarted(true)}>
          Start Quiz
        </Button>
      </CardContent>
    </Card>
  );
}
