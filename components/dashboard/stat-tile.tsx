import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatTileProps {
  icon: LucideIcon;
  label: string;
  value: string;
  hint?: string;
  tone?: "default" | "good" | "warning" | "critical";
}

const TONE_CLASS: Record<NonNullable<StatTileProps["tone"]>, string> = {
  default: "text-primary",
  good: "text-success",
  warning: "text-warning",
  critical: "text-destructive",
};

export function StatTile({ icon: Icon, label, value, hint, tone = "default" }: StatTileProps) {
  return (
    <Card>
      <CardContent className="flex items-start gap-3 p-4">
        <div className={cn("mt-0.5 rounded-lg bg-muted p-2", TONE_CLASS[tone])}>
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-medium text-muted-foreground">{label}</p>
          <p className="mt-0.5 text-xl font-bold tabular-nums text-foreground">{value}</p>
          {hint && <p className="mt-0.5 truncate text-xs text-muted-foreground">{hint}</p>}
        </div>
      </CardContent>
    </Card>
  );
}
