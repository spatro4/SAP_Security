"use client";

import * as React from "react";
import Link from "next/link";
import { CheckCircle2, Circle, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookmarkButton } from "@/components/bookmark-button";
import { NotesDialog } from "@/components/notes-dialog";
import { PrintButton } from "@/components/print-button";
import { useAppStore } from "@/lib/store";
import { getCategory } from "@/lib/categories";
import type { Chapter } from "@/lib/content-types";

export function ChapterRenderer({ chapter }: { chapter: Chapter }) {
  const { completedChapters, markChapterComplete, markChapterIncomplete } = useAppStore();
  const [hydrated, setHydrated] = React.useState(false);
  React.useEffect(() => setHydrated(true), []);

  const done = hydrated && Boolean(completedChapters[chapter.slug]);
  const category = getCategory(chapter.category);
  const href = `/chapters/${chapter.category}/${chapter.slug}`;
  const bookmarkId = `chapter:${chapter.category}:${chapter.slug}`;

  return (
    <div className="grid gap-8 xl:grid-cols-[1fr_240px]">
      <article className="min-w-0">
        <div className="no-print mb-4 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <Link href="/learning-path" className="hover:text-foreground">
            Learning Path
          </Link>
          <span>/</span>
          <Link href={`/chapters/${chapter.category}`} className="hover:text-foreground">
            {category?.shortTitle ?? chapter.category}
          </Link>
        </div>

        <div className="mb-2 flex flex-wrap items-center gap-2">
          <Badge>{chapter.level}</Badge>
          <Badge variant="outline" className="gap-1">
            <Clock className="h-3 w-3" /> {chapter.estMinutes} min
          </Badge>
          {chapter.tags.slice(0, 4).map((t) => (
            <Badge key={t} variant="secondary">
              {t}
            </Badge>
          ))}
        </div>

        <h1 className="text-3xl font-bold tracking-tight">{chapter.title}</h1>
        <p className="mt-2 text-muted-foreground">{chapter.summary}</p>

        <div className="no-print mt-4 flex flex-wrap gap-2">
          <Button
            variant={done ? "secondary" : "default"}
            size="sm"
            onClick={() => (done ? markChapterIncomplete(chapter.slug) : markChapterComplete(chapter.slug))}
          >
            {done ? <CheckCircle2 className="h-4 w-4 text-success" /> : <Circle className="h-4 w-4" />}
            {done ? "Completed" : "Mark as Complete"}
          </Button>
          <BookmarkButton id={bookmarkId} type="chapter" title={chapter.title} href={href} category={chapter.category} />
          <NotesDialog id={bookmarkId} title={chapter.title} refHref={href} />
          <PrintButton />
        </div>

        <div className="prose-sap mt-8" dangerouslySetInnerHTML={{ __html: chapter.html }} />
      </article>

      <aside className="no-print hidden xl:block">
        <div className="sticky top-20 space-y-1 rounded-lg border border-border p-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">On this page</p>
          <nav className="max-h-[70vh] space-y-1 overflow-y-auto text-sm">
            {chapter.sections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="block truncate text-muted-foreground hover:text-primary"
                style={{ paddingLeft: (s.depth - 1) * 10 }}
              >
                {s.title}
              </a>
            ))}
          </nav>
        </div>
      </aside>
    </div>
  );
}
