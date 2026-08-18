import { STAGES } from "../lib/status.js";

export default function StageSteps({ stage }) {
  const current = STAGES.indexOf(stage);

  return (
    <ol className="border-line bg-surface grid grid-cols-1 gap-y-6 rounded-2xl border p-5 sm:grid-cols-4 sm:gap-y-0">
      {STAGES.map((name, index) => {
        const done = index < current;
        const active = index === current;
        const state = done ? "Done" : active ? "Current" : "Upcoming";
        return (
          <li key={name} className="relative flex flex-col items-center text-center">
            {index > 0 && (
              <span
                className={`absolute top-[9px] left-[calc(-50%+1rem)] right-[calc(50%+1rem)] hidden h-0.5 sm:block ${
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
              <div className={`text-[13.5px] ${active ? "text-ink font-bold" : done ? "text-ink-2" : "text-muted"}`}>
                {name}
              </div>
              <div
                className={`mt-0.5 text-[10.5px] font-bold tracking-widest uppercase ${
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
  );
}
