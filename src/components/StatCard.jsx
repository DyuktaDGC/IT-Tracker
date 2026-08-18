const TILE = {
  violet: "tile-violet",
  blue: "tile-blue",
  rose: "tile-rose",
  mint: "tile-mint",
  slate: "tile-slate",
  neutral: "tile-neutral",
};

// `size="sm"` is for word values (a status, a stage name) that would overflow
// at the numeric display size.
export default function StatCard({ tone = "violet", label, value, foot, size = "lg" }) {
  const valueClass = size === "sm" ? "text-[19px] leading-tight" : "text-[30px] leading-none";
  return (
    <div className={`tile p-4 ${TILE[tone] ?? TILE.violet}`}>
      <div className="text-ink-2 text-[11.5px] leading-none font-semibold tracking-wide">{label}</div>
      <div className={`mt-3 font-bold tracking-tight tabular-nums ${valueClass}`}>{value}</div>
      {foot && <div className="text-muted mt-2.5 text-[11.5px] tabular-nums">{foot}</div>}
    </div>
  );
}
