import { Link } from "react-router-dom";

const BASE =
  "border-line-2 hover:bg-surface-2 group grid items-center gap-3 border-t px-4 py-4 first:border-t-0 sm:gap-5 sm:px-5";

export default function Row({ to, onClick, className = "", children }) {
  if (!to && onClick) {
    return (
      <button type="button" onClick={onClick} className={`w-full text-left ${BASE} ${className}`}>
        {children}
      </button>
    );
  }

  return (
    <Link to={to} onClick={onClick} className={`${BASE} ${className}`}>
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
