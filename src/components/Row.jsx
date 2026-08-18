import { Link } from "react-router-dom";

export default function Row({ to, className = "", children }) {
  return (
    <Link
      to={to}
      className={`border-line-2 hover:bg-surface-2 group grid items-center gap-3 border-t px-4 py-4 first:border-t-0 sm:gap-5 sm:px-5 ${className}`}
    >
      {children}
    </Link>
  );
}

export const RowTitle = ({ title, meta }) => (
  <div className="min-w-0">
    <div className="group-hover:text-accent-ink truncate text-[14.5px] font-semibold tracking-tight">{title}</div>
    {meta && <div className="text-muted mt-0.5 truncate text-xs">{meta}</div>}
  </div>
);
