const SIZE = 100;
const RADIUS = 42;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function Donut({
  value,
  label,
  caption,
  className = "size-28",
  thickness = 10,
  figureClass = "text-[20px]",
}) {
  const pct = Math.max(0, Math.min(100, value ?? 0));
  const arc = (pct / 100) * CIRCUMFERENCE;
  const complete = pct >= 100;

  return (
    <figure className={`relative m-0 ${className}`}>
      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="size-full -rotate-90"
        role="img"
        aria-label={`${label}: ${Math.round(pct)}%`}
      >
        <circle cx={SIZE / 2} cy={SIZE / 2} r={RADIUS} fill="none" strokeWidth={thickness} className="stroke-track" />
        {pct > 0 && (
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            strokeWidth={thickness}
            strokeLinecap="round"
            strokeDasharray={`${arc} ${CIRCUMFERENCE - arc}`}
            className={complete ? "stroke-chart-good" : "stroke-accent-mark"}
          />
        )}
      </svg>

      <figcaption className="absolute inset-0 grid place-content-center text-center">
        <span className={`${figureClass} leading-none font-bold tracking-tight tabular-nums`}>{Math.round(pct)}%</span>
        {caption && <span className="text-muted mt-1 block text-[10px] tabular-nums">{caption}</span>}
      </figcaption>
    </figure>
  );
}
