"use client";

import * as React from "react";
import { RotateCcw, Clock, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAppStore, type RevisionCard } from "@/lib/store";
import { formatDate } from "@/lib/utils";

function label(id: string) {
  const [type, ...rest] = id.split(":");
  return { type, ref: rest.join(":") };
}

export default function RevisionPage() {
  const { revisionCards } = useAppStore();
  const [hydrated, setHydrated] = React.useState(false);
  React.useEffect(() => setHydrated(true), []);

  const cards = Object.values(revisionCards);
  const now = new Date();
  const due = cards.filter((c) => new Date(c.dueAt) <= now).sort((a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime());
  const upcoming = cards.filter((c) => new Date(c.dueAt) > now).sort((a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime());

  function renderCard(c: RevisionCard) {
    const { type, ref } = label(c.id);
    return (
      <Card key={c.id}>
        <CardContent className="flex items-center justify-between gap-3 p-4">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <Badge variant="outline">{type}</Badge>
              <span className="text-xs text-muted-foreground">Reviewed {c.reviewCount}x</span>
            </div>
            <p className="truncate text-sm font-medium">{ref}</p>
          </div>
          <div className="text-right text-xs text-muted-foreground">
            <p>Due {formatDate(c.dueAt)}</p>
            <p>Interval: {c.interval}d</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <RotateCcw className="h-7 w-7 text-primary" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Revision (Spaced Repetition)</h1>
          <p className="mt-1 text-muted-foreground">
            Rate any question or flashcard as you review it, and it will resurface here on an increasing interval &mdash; the SM2-style
            algorithm behind long-term retention.
          </p>
        </div>
      </div>

      <div>
        <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold">
          <Clock className="h-4 w-4 text-warning" /> Due Now ({hydrated ? due.length : "—"})
        </h2>
        {hydrated && due.length === 0 && <p className="text-sm text-muted-foreground">Nothing due. Review a question or flashcard to seed this list.</p>}
        <div className="space-y-2">{hydrated && due.map(renderCard)}</div>
      </div>

      <div>
        <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold">
          <CheckCircle2 className="h-4 w-4 text-success" /> Upcoming ({hydrated ? upcoming.length : "—"})
        </h2>
        <div className="space-y-2">{hydrated && upcoming.map(renderCard)}</div>
      </div>
    </div>
  );
}
