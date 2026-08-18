import { useTracker } from "../hooks/useTracker.js";

const RefreshIcon = ({ spinning }) => (
  <svg
    viewBox="0 0 20 20"
    className={`size-4 flex-none ${spinning ? "animate-spin" : ""}`}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M16.5 10a6.5 6.5 0 1 1-1.9-4.6" />
    <path d="M16.8 2.8v3.4h-3.4" />
  </svg>
);

export default function RefreshButton() {
  const { refetch, loading } = useTracker();

  return (
    <button
      type="button"
      onClick={refetch}
      disabled={loading}
      aria-label={loading ? "Syncing data" : "Refresh data"}
      title={loading ? "Syncing…" : "Refresh data"}
      className="bg-accent text-accent-on hover:bg-accent-2 flex h-[2.375rem] items-center gap-2 rounded-full px-4 text-[12.5px] font-bold tracking-wide uppercase transition-colors disabled:opacity-60"
    >
      <RefreshIcon spinning={loading} />
      <span className="hidden sm:inline">{loading ? "Syncing" : "Refresh"}</span>
    </button>
  );
}
