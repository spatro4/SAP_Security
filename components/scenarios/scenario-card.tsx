"use client";

import * as React from "react";
import { ChevronDown, ListOrdered, Wrench, Table2, KeyRound, ShieldAlert, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookmarkButton } from "@/components/bookmark-button";
import { DIFFICULTY_BADGE } from "@/lib/difficulty";
import type { RenderedScenario } from "@/lib/render-content";

export function ScenarioCard({ scenario }: { scenario: RenderedScenario }) {
  const [open, setOpen] = React.useState(false);
  const href = `/scenarios/${scenario.category}#${scenario.id}`;

  return (
    <Card id={scenario.id} className="scroll-mt-24">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <Badge variant={DIFFICULTY_BADGE[scenario.difficulty]}>{scenario.difficulty}</Badge>
            </div>
            <button className="text-left font-semibold hover:text-primary" onClick={() => setOpen((o) => !o)}>
              {scenario.title}
            </button>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setOpen((o) => !o)} aria-label="Expand">
            <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
          </Button>
        </div>

        <div className="prose-sap mt-2 text-sm" dangerouslySetInnerHTML={{ __html: scenario.situationHtml }} />

        {open && (
          <div className="mt-4 space-y-4 border-t border-border pt-4">
            <BookmarkButton id={`scenario:${scenario.id}`} type="scenario" title={scenario.title} href={href} category={scenario.category} />

            <div>
              <p className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <ListOrdered className="h-3.5 w-3.5" /> Troubleshooting Steps
              </p>
              <ol className="list-decimal space-y-1 pl-5 text-sm">
                {scenario.troubleshootingSteps.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ol>
            </div>

            {scenario.diagramHtml && <div dangerouslySetInnerHTML={{ __html: scenario.diagramHtml }} />}

            <div className="flex flex-wrap gap-4 text-xs">
              {scenario.toolsUsed.length > 0 && (
                <span className="flex items-center gap-1.5">
                  <Wrench className="h-3.5 w-3.5 text-primary" />
                  {scenario.toolsUsed.map((t) => (
                    <code key={t} className="rounded bg-muted px-1.5 py-0.5">
                      {t}
                    </code>
                  ))}
                </span>
              )}
              {scenario.tablesChecked.length > 0 && (
                <span className="flex items-center gap-1.5">
                  <Table2 className="h-3.5 w-3.5 text-primary" />
                  {scenario.tablesChecked.map((t) => (
                    <code key={t} className="rounded bg-muted px-1.5 py-0.5">
                      {t}
                    </code>
                  ))}
                </span>
              )}
              {scenario.authObjects.length > 0 && (
                <span className="flex items-center gap-1.5">
                  <KeyRound className="h-3.5 w-3.5 text-primary" />
                  {scenario.authObjects.map((t) => (
                    <code key={t} className="rounded bg-muted px-1.5 py-0.5">
                      {t}
                    </code>
                  ))}
                </span>
              )}
            </div>

            <div>
              <p className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <ShieldAlert className="h-3.5 w-3.5" /> Root Cause
              </p>
              <p className="text-sm text-muted-foreground">{scenario.rootCause}</p>
            </div>

            <div>
              <p className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <CheckCircle2 className="h-3.5 w-3.5 text-success" /> Resolution
              </p>
              <div className="prose-sap text-sm" dangerouslySetInnerHTML={{ __html: scenario.resolutionHtml }} />
            </div>

            {scenario.preventiveMeasures.length > 0 && (
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Preventive Measures</p>
                <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                  {scenario.preventiveMeasures.map((m, i) => (
                    <li key={i}>{m}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
