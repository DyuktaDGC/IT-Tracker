import { Outlet } from "react-router-dom";
import FilterBar from "./components/FilterBar.jsx";
import RefreshButton from "./components/RefreshButton.jsx";
import ThemeToggle from "./components/ThemeToggle.jsx";
import { Failed, Loading } from "./components/States.jsx";
import { useTracker } from "./hooks/useTracker.js";

export default function App() {
  const { data, loading, error, refetch } = useTracker();

  return (
    <>
      <header className="border-line bg-surface sticky top-0 z-20 border-b">
        <div className="mx-auto flex max-w-[1720px] flex-wrap items-center gap-3 px-3 py-4 sm:px-6">
          <span className="brand-mark text-accent-on grid size-9 flex-none place-items-center rounded-xl text-[13px] font-bold tracking-wider">
            DG
          </span>
          <div className="mr-auto">
            <div className="title-pop text-[17px] font-bold tracking-tight">IT Project &amp; Dashboard Tracker</div>
          </div>
          <RefreshButton />
          <ThemeToggle />
        </div>
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
