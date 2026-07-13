"use client";

import * as React from "react";
import Link from "next/link";
import { NotebookPen, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAppStore } from "@/lib/store";
import { formatDate } from "@/lib/utils";

export default function NotesPage() {
  const { notes, upsertNote, removeNote } = useAppStore();
  const [hydrated, setHydrated] = React.useState(false);
  React.useEffect(() => setHydrated(true), []);
  const [editing, setEditing] = React.useState<string | null>(null);
  const [draft, setDraft] = React.useState("");

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <NotebookPen className="h-7 w-7 text-primary" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Notes</h1>
          <p className="mt-1 text-muted-foreground">Everything you&rsquo;ve captured across chapters and questions, stored locally on this device.</p>
        </div>
      </div>

      {hydrated && notes.length === 0 && <p className="text-sm text-muted-foreground">No notes yet. Add one from any chapter or question.</p>}

      <div className="space-y-3">
        {hydrated &&
          notes.map((n) => (
            <Card key={n.id}>
              <CardContent className="p-4">
                <div className="mb-2 flex items-center justify-between gap-2">
                  {n.refHref ? (
                    <Link href={n.refHref} className="font-medium hover:text-primary">
                      {n.title}
                    </Link>
                  ) : (
                    <span className="font-medium">{n.title}</span>
                  )}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{formatDate(n.updatedAt)}</span>
                    <Button variant="ghost" size="icon" onClick={() => removeNote(n.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
                {editing === n.id ? (
                  <div className="space-y-2">
                    <Textarea value={draft} onChange={(e) => setDraft(e.target.value)} rows={5} />
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => setEditing(null)}>
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => {
                          upsertNote({ id: n.id, title: n.title, body: draft, refHref: n.refHref });
                          setEditing(null);
                        }}
                      >
                        Save
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p
                    className="cursor-pointer whitespace-pre-wrap text-sm text-muted-foreground hover:text-foreground"
                    onClick={() => {
                      setEditing(n.id);
                      setDraft(n.body);
                    }}
                  >
                    {n.body || "Click to add content..."}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  );
}
