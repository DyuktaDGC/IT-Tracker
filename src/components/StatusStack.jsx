import { CHART_FILL } from "./tone.js";

const fill = (tone) => CHART_FILL[tone] ?? CHART_FILL.grey;

const Segment = ({ rowLabel, label, value, total, tone }) => {
  const share = total === 0 ? 0 : (100 * value) / total;
  return (
    <div className="group/seg relative h-full" style={{ width: `${share}%` }}>
      <div className={`h-full w-full ${fill(tone)}`} />
      <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 hidden -translate-x-1/2 group-hover/seg:block">
        <div className="border-line bg-surface text-ink rounded-lg border px-2.5 py-1.5 text-[11.5px] whitespace-nowrap shadow-lg shadow-black/20">
          <span className="text-muted">{rowLabel} · </span>
          {label} <b className="font-semibold tabular-nums">{value}</b>
          <span className="text-muted tabular-nums"> ({Math.round(share)}%)</span>
        </div>
      </div>
    </div>
  );
};

export default function StatusStack({ rows }) {
  const visible = rows.filter((row) => row.segments.some((segment) => segment.value > 0));
  if (visible.length === 0) return null;

  return (
    <figure className="m-0">
      <div className="grid gap-4">
        {visible.map((row) => {
          const filled = row.segments.filter((segment) => segment.value > 0);
          const total = filled.reduce((sum, segment) => sum + segment.value, 0);
          return (
            <div key={row.label} className="grid gap-2 sm:grid-cols-[minmax(0,170px)_1fr] sm:gap-4">
              <div className="min-w-0 sm:pt-0.5">
                <div className="truncate text-[12.5px] font-semibold">{row.label}</div>
                {row.meta && <div className="text-muted truncate text-[11px] tabular-nums">{row.meta}</div>}
              </div>
              <div>
                <div
                  className="flex h-4 w-full gap-0.5 overflow-hidden rounded-[3px]"
                  role="img"
                  aria-label={`${row.label}: ${filled.map((s) => `${s.label} ${s.value}`).join(", ")}`}
                >
                  {filled.map((segment) => (
                    <Segment key={segment.key ?? segment.label} rowLabel={row.label} total={total} {...segment} />
                  ))}
                </div>
                <div className="text-ink-2 mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11.5px]">
                  {filled.map(({ key, label, tone, value }) => (
                    <span key={key ?? label} className="inline-flex items-center gap-1.5">
                      <span className={`inline-block size-2.5 rounded-[3px] ${fill(tone)}`} aria-hidden="true" />
                      {label}
                      <b className="font-semibold tabular-nums">{value}</b>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </figure>
  );
}
