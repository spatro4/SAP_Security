"use client";

import * as React from "react";
import Link from "next/link";
import { CheckCircle2, Circle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Icon } from "@/components/icon";
import { useAppStore } from "@/lib/store";
import { getCategory } from "@/lib/categories";
import type { ChapterSummary } from "@/lib/content-types";

export function LearningPathClient({ chapters }: { chapters: ChapterSummary[] }) {
  const { completedChapters, markChapterComplete, markChapterIncomplete } = useAppStore();
  const [hydrated, setHydrated] = React.useState(false);
  React.useEffect(() => setHydrated(true), []);

  const byCategory = React.useMemo(() => {
    const map = new Map<string, ChapterSummary[]>();
    for (const ch of chapters) {
      const arr = map.get(ch.category) ?? [];
      arr.push(ch);
      map.set(ch.category, arr);
    }
    return map;
  }, [chapters]);

  const totalDone = hydrated ? Object.keys(completedChapters).length : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Learning Path</h1>
        <p className="mt-1 text-muted-foreground">
          The recommended sequence from Consultant fundamentals to Principal Architect depth.
        </p>
        <div className="mt-4 flex items-center gap-3">
          <Progress value={chapters.length > 0 ? (totalDone / chapters.length) * 100 : 0} className="max-w-sm" />
          <span className="text-sm text-muted-foreground">
            {totalDone} / {chapters.length} chapters complete
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {Array.from(byCategory.entries()).map(([slug, chs]) => {
          const category = getCategory(slug);
          return (
            <Card key={slug}>
              <CardHeader className="flex flex-row items-center gap-2 pb-3">
                {category && <Icon name={category.icon} className="h-4 w-4 text-primary" />}
                <CardTitle className="text-base">{category?.title ?? slug}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 pt-0">
                {chs
                  .sort((a, b) => a.order - b.order)
                  .map((ch) => {
                    const done = hydrated && Boolean(completedChapters[ch.slug]);
                    return (
                      <div key={ch.slug} className="flex items-center gap-2 rounded-md px-1 py-1.5 hover:bg-accent">
                        <button
                          onClick={() => (done ? markChapterIncomplete(ch.slug) : markChapterComplete(ch.slug))}
                          aria-label={done ? "Mark incomplete" : "Mark complete"}
                        >
                          {done ? <CheckCircle2 className="h-4 w-4 text-success" /> : <Circle className="h-4 w-4 text-muted-foreground" />}
                        </button>
                        <Link href={ch.href} className={done ? "flex-1 text-sm text-muted-foreground line-through" : "flex-1 text-sm"}>
                          {ch.title}
                        </Link>
                        <span className="text-xs text-muted-foreground">{ch.estMinutes} min</span>
                      </div>
                    );
                  })}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
