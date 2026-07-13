"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CATEGORIES } from "@/lib/categories";
import type { ArchitectureDiagram } from "@/lib/content-types";
import { mermaidHtml } from "@/lib/render-content";

export function ArchitectureGallery({ diagrams }: { diagrams: ArchitectureDiagram[] }) {
  const [category, setCategory] = React.useState<string>("all");
  const filtered = category === "all" ? diagrams : diagrams.filter((d) => d.category === category);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-1.5">
        <Badge variant={category === "all" ? "default" : "outline"} className="cursor-pointer" onClick={() => setCategory("all")}>
          All
        </Badge>
        {CATEGORIES.filter((c) => diagrams.some((d) => d.category === c.slug)).map((c) => (
          <Badge key={c.slug} variant={category === c.slug ? "default" : "outline"} className="cursor-pointer" onClick={() => setCategory(c.slug)}>
            {c.shortTitle}
          </Badge>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {filtered.map((d) => (
          <Card key={d.id} id={d.id} className="scroll-mt-24">
            <CardHeader>
              <CardTitle className="text-base">{d.title}</CardTitle>
              <CardDescription>{d.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div dangerouslySetInnerHTML={{ __html: mermaidHtml(d.mermaid) }} />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
