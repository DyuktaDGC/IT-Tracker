import { formatDate } from "../lib/format.js";

export const Card = ({ className = "", children }) => (
  <div className={`border-line bg-surface overflow-hidden rounded-2xl border ${className}`}>{children}</div>
);

export const PageHead = ({ title, subtitle, tight = false }) => (
  <header className={`pb-1 ${tight ? "pt-5" : "pt-7"}`}>
    <h1 className="title-pop text-[28px] font-bold tracking-tight sm:text-[30px]">{title}</h1>
    {subtitle && <p className="text-ink-2 mt-1.5 text-[13px]">{subtitle}</p>}
  </header>
);

export const Section = ({ title, hint, children }) => (
  <section>
    <div className="mt-8 mb-3.5 flex items-center gap-2.5">
      <span className="bar-fill h-4 w-1 flex-none rounded-full" aria-hidden="true" />
      <h2 className="text-[15px] font-bold tracking-tight">{title}</h2>
      {hint != null && (
        <span className="bg-accent-bg text-accent-ink rounded-full px-2 py-0.5 text-[11px] font-semibold tabular-nums">
          {hint}
        </span>
      )}
    </div>
    {children}
  </section>
);

export const Note = ({ tone = "accent", label = "Note", children }) => {
  const panel = tone === "warn" ? "bg-warn-bg ring-warn/30" : "bg-accent-bg ring-accent/30";
  const ink = tone === "warn" ? "text-warn-ink" : "text-accent-ink";
  return (
    <div className={`text-ink-2 mt-4 rounded-2xl p-4 text-[13px] ring-1 ${panel}`}>
      <div className={`mb-1.5 text-[11px] font-bold tracking-widest uppercase ${ink}`}>{label}</div>
      <div>{children}</div>
    </div>
  );
};

export const DateValue = ({ value }) => {
  const formatted = formatDate(value);
  return formatted ? (
    <span className="text-ink-2 font-medium tabular-nums">{formatted}</span>
  ) : (
    <span className="text-muted text-xs italic">not recorded</span>
  );
};

export const Field = ({ label, children }) => (
  <div>
    <div className="text-muted text-[10.5px] leading-none font-semibold tracking-wider uppercase">{label}</div>
    <div className="mt-1.5 text-[13px]">{children}</div>
  </div>
);
