// Status tones. `accent` = In Progress (blue), `grey` = Not Started / unrecorded
// (muted violet). The chart fills are the validated 4-slot status palette.
export const TONE = {
  good: "bg-good-bg text-good-ink ring-1 ring-good/30",
  accent: "bg-info-bg text-info-ink ring-1 ring-info/30",
  warn: "bg-warn-bg text-warn-ink ring-1 ring-warn/30",
  grey: "bg-idle-bg text-idle-ink ring-1 ring-idle/25",
};

export const FILL = {
  good: "bg-good",
  accent: "bg-info",
  warn: "bg-warn",
  grey: "bg-idle",
};

export const CHART_FILL = {
  good: "bg-chart-good",
  accent: "bg-chart-progress",
  warn: "bg-chart-hold",
  grey: "bg-chart-none",
};
