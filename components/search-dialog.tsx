"use client";

import * as React from "react";
import Link from "next/link";
import Fuse from "fuse.js";
import { Search, FileText, MessagesSquare, FlaskConical, BookOpenText, Layers3 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { withBasePath } from "@/lib/utils";

interface SearchEntry {
  id: string;
  type: "chapter" | "question" | "scenario" | "glossary" | "flashcard";
  title: string;
  category: string;
  href: string;
  excerpt: string;
  difficulty?: string;
}

const TYPE_ICON: Record<SearchEntry["type"], React.ComponentType<{ className?: string }>> = {
  chapter: FileText,
  question: MessagesSquare,
  scenario: FlaskConical,
  glossary: BookOpenText,
  flashcard: Layers3,
};

export function SearchDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [query, setQuery] = React.useState("");
  const [entries, setEntries] = React.useState<SearchEntry[]>([]);
  const fuseRef = React.useRef<Fuse<SearchEntry> | null>(null);

  React.useEffect(() => {
    if (!open || entries.length > 0) return;
    fetch(withBasePath("/search-index.json"))
      .then((r) => r.json())
      .then((data: SearchEntry[]) => {
        setEntries(data);
        fuseRef.current = new Fuse(data, {
          keys: ["title", "excerpt", "category"],
          threshold: 0.35,
          ignoreLocation: true,
        });
      })
      .catch(() => {});
  }, [open, entries.length]);

  const results = React.useMemo(() => {
    if (!query.trim()) return entries.slice(0, 8);
    return (fuseRef.current?.search(query) ?? []).slice(0, 20).map((r) => r.item);
  }, [query, entries]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl p-0">
        <DialogHeader className="border-b border-border px-4 pt-4 pb-3">
          <DialogTitle className="sr-only">Search</DialogTitle>
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              autoFocus
              placeholder="Search chapters, questions, scenarios, glossary..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="border-0 px-0 shadow-none focus-visible:ring-0"
            />
          </div>
        </DialogHeader>
        <div className="max-h-[60vh] overflow-y-auto p-2">
          {results.length === 0 && (
            <p className="p-4 text-center text-sm text-muted-foreground">No results yet. Try another term.</p>
          )}
          {results.map((entry) => {
            const Icon = TYPE_ICON[entry.type];
            return (
              <Link
                key={entry.id}
                href={entry.href}
                onClick={() => onOpenChange(false)}
                className="flex items-start gap-3 rounded-md p-3 text-sm hover:bg-accent"
              >
                <Icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate font-medium text-foreground">{entry.title}</p>
                    {entry.difficulty && (
                      <Badge variant="outline" className="shrink-0 text-[10px]">
                        {entry.difficulty}
                      </Badge>
                    )}
                  </div>
                  <p className="truncate text-xs text-muted-foreground">{entry.excerpt}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
