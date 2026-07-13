"use client";

import * as React from "react";
import Link from "next/link";
import { Bookmark, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAppStore, type BookmarkType } from "@/lib/store";
import { formatDate } from "@/lib/utils";

const TYPE_LABEL: Record<BookmarkType, string> = {
  chapter: "Chapter",
  question: "Question",
  scenario: "Scenario",
  flashcard: "Flashcard",
};

export default function BookmarksPage() {
  const { bookmarks, removeBookmark } = useAppStore();
  const [hydrated, setHydrated] = React.useState(false);
  React.useEffect(() => setHydrated(true), []);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Bookmark className="h-7 w-7 text-primary" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Bookmarks</h1>
          <p className="mt-1 text-muted-foreground">Everything you&rsquo;ve saved for later, stored locally on this device.</p>
        </div>
      </div>

      {hydrated && bookmarks.length === 0 && <p className="text-sm text-muted-foreground">No bookmarks yet.</p>}

      <div className="space-y-2">
        {hydrated &&
          bookmarks.map((b) => (
            <Card key={b.id}>
              <CardContent className="flex items-center justify-between gap-3 p-4">
                <div className="min-w-0">
                  <div className="mb-1 flex items-center gap-2">
                    <Badge variant="outline">{TYPE_LABEL[b.type]}</Badge>
                    <span className="text-xs text-muted-foreground">{formatDate(b.createdAt)}</span>
                  </div>
                  <Link href={b.href} className="truncate font-medium hover:text-primary">
                    {b.title}
                  </Link>
                </div>
                <Button variant="ghost" size="icon" onClick={() => removeBookmark(b.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  );
}
