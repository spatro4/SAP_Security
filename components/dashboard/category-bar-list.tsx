const VIZ_COLORS = [
  "var(--viz-1)",
  "var(--viz-2)",
  "var(--viz-3)",
  "var(--viz-4)",
  "var(--viz-5)",
  "var(--viz-6)",
  "var(--viz-7)",
  "var(--viz-8)",
];

export interface CategoryBarDatum {
  label: string;
  value: number; // 0-100
}

export function CategoryBarList({ data }: { data: CategoryBarDatum[] }) {
  return (
    <div className="space-y-3" role="table" aria-label="Progress by category">
      {data.map((d, i) => (
        <div key={d.label} className="flex items-center gap-3 text-sm" role="row">
          <span className="w-40 shrink-0 truncate text-muted-foreground" role="cell">
            {d.label}
          </span>
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted" role="cell">
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${Math.max(2, d.value)}%`, backgroundColor: VIZ_COLORS[i % VIZ_COLORS.length] }}
            />
          </div>
          <span className="w-10 shrink-0 text-right tabular-nums text-foreground" role="cell">
            {Math.round(d.value)}%
          </span>
        </div>
      ))}
    </div>
  );
}
