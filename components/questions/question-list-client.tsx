"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DIFFICULTIES } from "@/lib/categories";
import { QuestionCard } from "@/components/questions/question-card";
import type { RenderedQuestion } from "@/lib/render-content";
import { cn } from "@/lib/utils";

export function QuestionListClient({ questions }: { questions: RenderedQuestion[] }) {
  const [query, setQuery] = React.useState("");
  const [difficulty, setDifficulty] = React.useState<string | null>(null);

  const filtered = questions.filter((q) => {
    if (difficulty && q.difficulty !== difficulty) return false;
    if (query && !q.question.toLowerCase().includes(query.toLowerCase()) && !q.tags.some((t) => t.toLowerCase().includes(query.toLowerCase())))
      return false;
    return true;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Input placeholder="Search questions or tags..." value={query} onChange={(e) => setQuery(e.target.value)} className="max-w-sm" />
        <div className="flex flex-wrap gap-1.5">
          <Badge
            variant={difficulty === null ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setDifficulty(null)}
          >
            All
          </Badge>
          {DIFFICULTIES.map((d) => (
            <Badge
              key={d}
              variant={difficulty === d ? "default" : "outline"}
              className={cn("cursor-pointer")}
              onClick={() => setDifficulty(d)}
            >
              {d}
            </Badge>
          ))}
        </div>
      </div>
      <p className="text-sm text-muted-foreground">{filtered.length} question(s)</p>
      <div className="space-y-3">
        {filtered.map((q) => (
          <QuestionCard key={q.id} question={q} />
        ))}
      </div>
    </div>
  );
}
