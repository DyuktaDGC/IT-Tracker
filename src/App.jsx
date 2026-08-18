import { NavLink, Outlet } from "react-router-dom";
import FilterBar from "./components/FilterBar.jsx";
import RefreshButton from "./components/RefreshButton.jsx";
import ThemeToggle from "./components/ThemeToggle.jsx";
import { Failed, Loading } from "./components/States.jsx";
import { useTracker } from "./hooks/useTracker.js";

const TABS = [
  { to: "/", label: "Employee", end: true, count: (data) => data.employees.length },
  { to: "/clients", label: "Client", count: (data) => data.clients.length },
];

const tabClass = ({ isActive }) =>
  `-mb-px flex items-center gap-2 border-b-2 px-1 pt-2 pb-3 text-[13.5px] font-semibold ${
    isActive ? "border-accent text-ink" : "border-transparent text-muted hover:text-ink-2"
  }`;

const countClass = ({ isActive }) =>
  `rounded-full px-1.5 py-0.5 text-[10.5px] font-semibold tabular-nums ${
    isActive ? "bg-accent text-accent-on" : "bg-surface-2 text-muted"
  }`;

export default function App() {
  const { data, loading, error, refetch } = useTracker();

  return (
    <>
      <header className="border-line bg-surface sticky top-0 z-20 border-b">
        <div className="mx-auto flex max-w-[1720px] flex-wrap items-center gap-3 px-3 pt-4 sm:px-6">
          <span className="brand-mark text-accent-on grid size-9 flex-none place-items-center rounded-xl text-[13px] font-bold tracking-wider">
            DG
          </span>
          <div className="mr-auto">
            <div className="title-pop text-[17px] font-bold tracking-tight">IT Project &amp; Dashboard Tracker</div>
          </div>
          <RefreshButton />
          <ThemeToggle />
        </div>
        <nav className="mx-auto flex max-w-[1720px] flex-wrap gap-6 px-3 pt-4 sm:px-6">
          {TABS.map(({ to, label, end, count }) => (
            <NavLink key={to} to={to} end={end} className={tabClass}>
              {({ isActive }) => (
                <>
                  {label}
                  {data && <span className={countClass({ isActive })}>{count(data)}</span>}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-[1720px] px-3 pb-16 sm:px-6">
        <FilterBar />
        {error ? (
          <Failed message={error} onRetry={refetch} />
        ) : loading || !data ? (
          <Loading />
        ) : (
          <Outlet />
        )}
      </main>
    </>
  );
}
