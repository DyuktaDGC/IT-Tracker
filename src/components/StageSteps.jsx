import { STAGES } from "../lib/status.js";

// Eight stages don't fit a phone, so the strip scrolls sideways instead of
// wrapping — that keeps every step on one row, which the connector lines assume.
export default function StageSteps({ stage }) {
  const current = STAGES.indexOf(stage);

  return (
    <div className="border-line bg-surface overflow-x-auto rounded-2xl border">
      <ol className="flex min-w-[42rem] p-5">
        {STAGES.map((name, index) => {
          const done = index < current;
          const active = index === current;
          const state = done ? "Done" : active ? "Current" : "Upcoming";
          return (
            <li key={name} className="relative flex flex-1 flex-col items-center px-1 text-center">
              {index > 0 && (
                <span
                  className={`absolute top-[9px] left-[calc(-50%+1rem)] right-[calc(50%+1rem)] h-0.5 ${
                    done || active ? "bg-chart-good" : "bg-track"
                  }`}
                  aria-hidden="true"
                />
              )}
              <span className="relative z-10 block size-5 flex-none">
                {active && (
                  <>
                    <span className="stage-pulse bg-accent-mark absolute inset-0 rounded-full" aria-hidden="true" />
                    <span className="stage-pulse-2 bg-accent-mark absolute inset-0 rounded-full" aria-hidden="true" />
                  </>
                )}
                <span
                  className={`relative block size-5 rounded-full border-2 ${
                    done
                      ? "bg-chart-good border-transparent"
                      : active
                        ? "bg-accent-mark stage-dot border-transparent"
                        : "bg-surface border-line"
                  }`}
                  aria-hidden="true"
                />
              </span>
              <div className="mt-3">
                <div
                  className={`text-[13px] leading-tight ${active ? "text-ink font-bold" : done ? "text-ink-2" : "text-muted"}`}
                >
                  {name}
                </div>
                <div
                  className={`mt-1 text-[10.5px] font-bold tracking-widest uppercase ${
                    active ? "text-accent-ink" : "text-muted"
                  }`}
                >
                  {state}
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
