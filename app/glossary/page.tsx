import { BookOpenText } from "lucide-react";
import { getAllGlossaryTerms } from "@/lib/content";
import { GlossaryClient } from "@/components/glossary/glossary-client";

export const metadata = { title: "Glossary" };

export default function GlossaryPage() {
  const terms = getAllGlossaryTerms();
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <BookOpenText className="h-7 w-7 text-primary" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Glossary</h1>
          <p className="mt-1 text-muted-foreground">Every acronym and term, defined the way an architect actually uses it.</p>
        </div>
      </div>
      <GlossaryClient terms={terms} />
    </div>
  );
}
