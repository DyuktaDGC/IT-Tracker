import { Link, useRouteError } from "react-router-dom";
import { Card } from "./Layout.jsx";

const Bar = ({ className = "" }) => <span className={`skeleton block h-3 ${className}`} aria-hidden="true" />;

const Shell = ({ tone = "grey", title, children }) => (
  <Card className={`mt-6 px-6 py-14 ${tone === "warn" ? "bg-warn-bg border-transparent" : ""}`}>
    <h2 className="text-base font-semibold">{title}</h2>
    <div className="text-muted mt-2 text-[13px]">{children}</div>
  </Card>
);

export const Loading = () => (
  <div role="status" aria-live="polite" aria-busy="true">
    <span className="sr-only">Loading the tracker</span>

    <div className="pt-7 pb-2">
      <Bar className="h-7 w-56" />
      <Bar className="mt-3 h-3 w-72" />
    </div>

    <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-5">
      {[0, 1, 2, 3, 4].map((index) => (
        <div key={index} className="bg-tile-slate rounded-2xl p-4">
          <Bar className="h-2.5 w-20" />
          <Bar className="mt-4 h-7 w-14" />
          <Bar className="mt-3 h-2.5 w-16" />
        </div>
      ))}
    </div>

    <div className="border-line bg-surface mt-8 overflow-hidden rounded-2xl border">
      {[0, 1, 2, 3, 4].map((index) => (
        <div
          key={index}
          className="border-line-2 grid gap-4 border-t px-5 py-4 first:border-t-0 lg:grid-cols-[minmax(0,1.5fr)_200px_minmax(0,1.2fr)]"
        >
          <div>
            <Bar className="h-3.5 w-48" />
            <Bar className="mt-2 h-2.5 w-32" />
          </div>
          <div className="hidden lg:block">
            <Bar className="h-3 w-16" />
            <Bar className="mt-2.5 h-2 w-full" />
          </div>
          <div className="hidden lg:block">
            <Bar className="h-2.5 w-full" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const Empty = ({ month, filtered = false }) => (
  <Shell title={filtered ? "Nothing matches these filters" : `No rows for ${month}`}>
    {filtered
      ? "Clear the search or widen the dropdowns in the filter bar above."
      : "Select another month from the filter bar."}
  </Shell>
);

export const Failed = ({ message, onRetry }) => (
  <Shell tone="warn" title="Could not load the tracker">
    <p>{message}</p>
    {onRetry && (
      <button type="button" onClick={onRetry} className="text-accent-ink mt-4 font-semibold underline">
        Try again
      </button>
    )}
  </Shell>
);

export const NotFound = () => (
  <Shell tone="warn" title="Not found">
    <p>That page does not exist.</p>
    <Link to="/" className="text-accent-ink mt-4 inline-block font-semibold underline">
      Back to Employee
    </Link>
  </Shell>
);

export function RouteError() {
  const error = useRouteError();
  return <Failed message={error?.message ?? "Something went wrong."} />;
}
