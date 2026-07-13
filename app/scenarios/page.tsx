import Link from "next/link";
import { FlaskConical, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getAllScenarios } from "@/lib/content";
import { CATEGORIES } from "@/lib/categories";
import { Icon } from "@/components/icon";

export const metadata = { title: "Scenario Labs" };

export default function ScenariosPage() {
  const scenarios = getAllScenarios();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <FlaskConical className="h-7 w-7 text-primary" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Scenario Labs</h1>
          <p className="mt-1 text-muted-foreground">
            {scenarios.length} real production-style troubleshooting scenarios &mdash; war-room style, tool by tool.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {CATEGORIES.map((c) => {
          const count = scenarios.filter((s) => s.category === c.slug).length;
          return (
            <Link key={c.slug} href={`/scenarios/${c.slug}`}>
              <Card className="h-full transition-colors hover:border-primary/50">
                <CardContent className="p-5">
                  <div className="mb-2 flex items-center gap-2">
                    <Icon name={c.icon} className="h-4 w-4 text-primary" />
                    <Badge variant="secondary">{count} scenarios</Badge>
                  </div>
                  <h3 className="font-semibold">{c.shortTitle}</h3>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{c.description}</p>
                  <span className="mt-3 inline-flex items-center gap-1 text-sm text-primary">
                    Enter lab <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
