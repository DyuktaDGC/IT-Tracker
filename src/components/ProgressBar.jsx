export default function ProgressBar({ value, label }) {
  const width = Math.max(0, Math.min(100, value ?? 0));
  const fill = width >= 100 ? "bar-fill-good" : width === 0 ? "bg-idle/50" : "bar-fill";
  return (
    <div
      className="bg-track h-2 w-full overflow-hidden rounded-full"
      role="progressbar"
      aria-label={label}
      aria-valuenow={width}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div className={`h-full rounded-full transition-[width] duration-500 ease-out ${fill}`} style={{ width: `${width}%` }} />
    </div>
  );
}
