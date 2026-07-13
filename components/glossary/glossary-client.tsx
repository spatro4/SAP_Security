"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { slugify } from "@/lib/utils";
import type { GlossaryTerm } from "@/lib/content-types";

export function GlossaryClient({ terms }: { terms: GlossaryTerm[] }) {
  const [query, setQuery] = React.useState("");
  const filtered = terms.filter(
    (t) => t.term.toLowerCase().includes(query.toLowerCase()) || t.definition.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <Input placeholder="Search glossary..." value={query} onChange={(e) => setQuery(e.target.value)} className="max-w-sm" />
      <p className="text-sm text-muted-foreground">{filtered.length} term(s)</p>
      <div className="grid gap-3 sm:grid-cols-2">
        {filtered.map((t) => (
          <Card key={t.term} id={slugify(t.term)} className="scroll-mt-24">
            <CardContent className="p-4">
              <div className="mb-1 flex items-center justify-between gap-2">
                <h3 className="font-semibold">{t.term}</h3>
                <Badge variant="outline">{t.category}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">{t.definition}</p>
              {t.related && t.related.length > 0 && (
                <p className="mt-2 text-xs text-muted-foreground">Related: {t.related.join(", ")}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
