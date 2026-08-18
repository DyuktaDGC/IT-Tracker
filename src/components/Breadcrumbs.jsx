import { Link } from "react-router-dom";

export default function Breadcrumbs({ trail }) {
  return (
    <nav aria-label="Breadcrumb" className="text-muted flex flex-wrap items-center gap-2 pt-6 text-[11.5px] tracking-wide">
      {trail.map(({ label, to }, index) => (
        <span key={label} className="flex items-center gap-2">
          {index > 0 && <span aria-hidden="true">/</span>}
          {to ? (
            <Link to={to} className="hover:text-accent-ink underline underline-offset-2">
              {label}
            </Link>
          ) : (
            <span className="text-ink-2 font-semibold">{label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
