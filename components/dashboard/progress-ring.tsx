"use client";

interface ProgressRingProps {
  value: number; // 0-100
  size?: number;
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
  tone?: "sequential" | "good" | "warning" | "critical";
}

const TONE_VAR: Record<NonNullable<ProgressRingProps["tone"]>, string> = {
  sequential: "var(--viz-1)",
  good: "var(--viz-good)",
  warning: "var(--viz-warning)",
  critical: "var(--viz-critical)",
};

export function ProgressRing({
  value,
  size = 120,
  strokeWidth = 10,
  label,
  sublabel,
  tone = "sequential",
}: ProgressRingProps) {
  const clamped = Math.max(0, Math.min(100, value));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;
  const color = TONE_VAR[tone];

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" role="img" aria-label={`${label ?? "Progress"}: ${clamped}%`}>
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="var(--viz-track)" strokeWidth={strokeWidth} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.6s ease" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center text-center">
        <span className="text-2xl font-bold tabular-nums" style={{ color: "var(--viz-ink)" }}>
          {clamped}
          {label ? "" : "%"}
        </span>
        {sublabel && <span className="text-xs" style={{ color: "var(--viz-ink-muted)" }}>{sublabel}</span>}
      </div>
    </div>
  );
}
