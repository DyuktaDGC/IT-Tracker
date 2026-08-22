import { Link, useRouteError } from "react-router-dom";
import { Card } from "./Layout.jsx";

const Bar = ({ className = "" }) => <span className={`skeleton block h-3 ${className}`} aria-hidden="true" />;

const Shell = ({ tone = "grey", title, children }) => (
  <Card className={`mt-6 px-6 py-14 ${tone === "warn" ? "bg-warn-bg border-transparent" : ""}`}>
    <h2 className="text-base font-semibold">{title}</h2>
    <div className="text-muted mt-2 text-[13px]">{children}</div>
  </Card>
);

// Mirrors the Employee page — stat tiles, the unassigned row list, then the
// person cards — so the real content lands in the same places the placeholders
// held instead of shuffling the page.
const SectionHead = () => (
  <div className="mt-8 mb-3.5 flex items-center gap-2.5">
    <span className="bar-fill h-4 w-1 flex-none rounded-full opacity-40" aria-hidden="true" />
    <Bar className="h-3.5 w-36" />
    <Bar className="h-4 w-12 rounded-full" />
  </div>
);

const RowSkeleton = () => (
  <div className="border-line-2 grid items-center gap-3 border-t px-5 py-4 first:border-t-0 sm:gap-5 lg:grid-cols-[minmax(0,1.4fr)_auto_minmax(220px,1fr)]">
    <div>
      <Bar className="h-3.5 w-44" />
      <Bar className="mt-2 h-2.5 w-28" />
    </div>
    <Bar className="hidden h-5 w-24 rounded-full lg:block" />
    <div className="hidden lg:block">
      <Bar className="h-2.5 w-full" />
    </div>
  </div>
);

const PersonSkeleton = () => (
  <Card className="p-5">
    <div className="mb-4 flex items-center gap-3.5">
      <Bar className="size-10 flex-none rounded-xl" />
      <div className="mr-auto">
        <Bar className="h-4 w-28" />
        <Bar className="mt-2 h-2.5 w-40" />
      </div>
      <Bar className="size-20 flex-none rounded-full" />
    </div>

    <div className="mt-4">
      <Bar className="h-2.5 w-28" />
      <Bar className="mt-2.5 h-2.5 w-full" />
    </div>

    <div className="border-line-2 mt-5 border-t pt-4">
      <Bar className="h-2.5 w-28" />
      {[0, 1, 2].map((index) => (
        <div key={index} className="mt-3 grid gap-2 px-2 sm:grid-cols-[minmax(0,1fr)_minmax(140px,1fr)] sm:items-center">
          <div>
            <Bar className="h-3.5 w-36" />
            <Bar className="mt-2 h-2.5 w-24" />
          </div>
          <div>
            <Bar className="h-2.5 w-24" />
            <Bar className="mt-2.5 h-2 w-full" />
          </div>
        </div>
      ))}
    </div>
  </Card>
);

export const Loading = () => (
  <div role="status" aria-live="polite" aria-busy="true">
    <span className="sr-only">Loading the tracker</span>

    {/* h-11 matches the rendered height of the PageHead title. */}
    <div className="pt-7 pb-1">
      <Bar className="h-11 w-64" />
    </div>

    <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:auto-cols-fr lg:grid-flow-col">
      {[0, 1, 2, 3, 4].map((index) => (
        <div key={index} className="tile tile-slate p-4">
          <Bar className="h-2.5 w-24" />
          <Bar className="mt-4 h-7 w-14" />
          <Bar className="mt-3 h-2.5 w-20" />
        </div>
      ))}
    </div>

    <SectionHead />
    <Card>
      {[0, 1, 2].map((index) => (
        <RowSkeleton key={index} />
      ))}
    </Card>

    <SectionHead />
    <div className="grid gap-3 lg:grid-cols-2">
      <PersonSkeleton />
      <PersonSkeleton />
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
