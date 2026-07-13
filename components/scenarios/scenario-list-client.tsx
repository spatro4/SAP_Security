"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DIFFICULTIES } from "@/lib/categories";
import { ScenarioCard } from "@/components/scenarios/scenario-card";
import type { RenderedScenario } from "@/lib/render-content";

export function ScenarioListClient({ scenarios }: { scenarios: RenderedScenario[] }) {
  const [query, setQuery] = React.useState("");
  const [difficulty, setDifficulty] = React.useState<string | null>(null);

  const filtered = scenarios.filter((s) => {
    if (difficulty && s.difficulty !== difficulty) return false;
    if (query && !s.title.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Input placeholder="Search scenarios..." value={query} onChange={(e) => setQuery(e.target.value)} className="max-w-sm" />
        <div className="flex flex-wrap gap-1.5">
          <Badge variant={difficulty === null ? "default" : "outline"} className="cursor-pointer" onClick={() => setDifficulty(null)}>
            All
          </Badge>
          {DIFFICULTIES.map((d) => (
            <Badge key={d} variant={difficulty === d ? "default" : "outline"} className="cursor-pointer" onClick={() => setDifficulty(d)}>
              {d}
            </Badge>
          ))}
        </div>
      </div>
      <p className="text-sm text-muted-foreground">{filtered.length} scenario(s)</p>
      <div className="space-y-3">
        {filtered.map((s) => (
          <ScenarioCard key={s.id} scenario={s} />
        ))}
      </div>
    </div>
  );
}
