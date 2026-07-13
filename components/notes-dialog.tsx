"use client";

import * as React from "react";
import { NotebookPen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAppStore } from "@/lib/store";

export function NotesDialog({ id, title, refHref }: { id: string; title: string; refHref: string }) {
  const { notes, upsertNote } = useAppStore();
  const [open, setOpen] = React.useState(false);
  const existing = notes.find((n) => n.id === id);
  const [draft, setDraft] = React.useState(existing?.body ?? "");

  React.useEffect(() => {
    if (open) setDraft(existing?.body ?? "");
  }, [open, existing?.body]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        <NotebookPen className="h-4 w-4" />
        <span>{existing ? "Edit Note" : "Add Note"}</span>
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Notes &mdash; {title}</DialogTitle>
        </DialogHeader>
        <Textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={8}
          placeholder="Capture your own explanation, war-stories, or things to remember before the interview..."
        />
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={() => {
              upsertNote({ id, title, body: draft, refHref });
              setOpen(false);
            }}
          >
            Save Note
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
