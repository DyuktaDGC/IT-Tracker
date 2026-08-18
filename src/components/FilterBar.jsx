import Dropdown from "./Dropdown.jsx";
import { businessOptions, employeeOptions } from "../lib/filter.js";
import { useTracker } from "../hooks/useTracker.js";

const MONTH_SHORT = new Intl.DateTimeFormat("en-GB", { month: "short", timeZone: "UTC" });

const Icon = ({ name }) => {
  const paths = {
    calendar: (
      <>
        <rect x="3" y="4.5" width="14" height="12.5" rx="2.5" />
        <path d="M3 8.5h14M7 2.5v3M13 2.5v3" />
      </>
    ),
    user: (
      <>
        <circle cx="10" cy="7" r="3.2" />
        <path d="M4 16.5c0-2.8 2.7-4.5 6-4.5s6 1.7 6 4.5" />
      </>
    ),
    building: (
      <>
        <rect x="4" y="3" width="12" height="14" rx="1.8" />
        <path d="M7.5 6.5h1.5M11 6.5h1.5M7.5 10h1.5M11 10h1.5M8.5 17v-3h3v3" />
      </>
    ),
    close: <path d="M6 6l8 8M14 6l-8 8" />,
    search: (
      <>
        <circle cx="9" cy="9" r="5.5" />
        <path d="M13.2 13.2L17 17" />
      </>
    ),
  };
  return (
    <svg
      viewBox="0 0 20 20"
      className="size-4 flex-none"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
};

export default function FilterBar() {
  const {
    rawData,
    years,
    year,
    setYear,
    monthsInYear,
    month,
    setMonth,
    filters,
    setFilter,
    clearFilters,
    filtersActive,
  } = useTracker();

  const employees = employeeOptions(rawData);
  const businesses = businessOptions(rawData);

  const monthOptions = monthsInYear.map((value) => ({
    value,
    label: MONTH_SHORT.format(new Date(`${value}-01T00:00:00Z`)),
  }));
  const yearOptions = years.map((value) => ({ value, label: value }));
  const employeeOpts = [{ value: "", label: "All employees" }, ...employees.map((name) => ({ value: name, label: name }))];
  const businessOpts = [{ value: "", label: "All clients" }, ...businesses.map(({ id, name }) => ({ value: id, label: name }))];

  return (
    <section aria-label="Filters" className="mt-5 flex flex-wrap items-center gap-2.5">
      <div className="border-line bg-surface focus-within:border-accent hover:border-accent flex min-w-0 basis-64 items-center gap-2 rounded-xl border py-2 pr-2 pl-3">
        <span className="text-muted">
          <Icon name="search" />
        </span>
        <label htmlFor="filter-query" className="sr-only">
          Search dashboards, clients and checklist rows
        </label>
        <input
          id="filter-query"
          type="search"
          value={filters.query}
          onChange={(event) => setFilter("query", event.target.value)}
          placeholder="Search dashboards, rows…"
          className="text-ink placeholder:text-muted min-w-0 flex-1 bg-transparent text-[12.5px] font-medium focus:outline-none [&::-webkit-search-cancel-button]:hidden"
        />
        {filters.query && (
          <button
            type="button"
            onClick={() => setFilter("query", "")}
            aria-label="Clear search"
            className="text-muted hover:text-ink rounded-md p-0.5"
          >
            <Icon name="close" />
          </button>
        )}
      </div>

      <Dropdown
        label="Month"
        icon={<Icon name="calendar" />}
        value={month ?? ""}
        options={monthOptions}
        onChange={setMonth}
        disabled={monthOptions.length === 0}
      />

      <Dropdown
        label="Year"
        icon={<Icon name="calendar" />}
        value={year}
        options={yearOptions}
        onChange={setYear}
        disabled={yearOptions.length === 0}
      />

      <Dropdown
        label="Employee"
        icon={<Icon name="user" />}
        value={filters.employee}
        options={employeeOpts}
        onChange={(value) => setFilter("employee", value)}
        disabled={employees.length === 0}
      />

      <Dropdown
        label="Client"
        icon={<Icon name="building" />}
        value={filters.business}
        options={businessOpts}
        onChange={(value) => setFilter("business", value)}
        disabled={businesses.length === 0}
      />

      {filtersActive && (
        <button
          type="button"
          onClick={clearFilters}
          className="border-line bg-surface text-ink-2 hover:border-accent hover:text-ink flex items-center gap-1.5 rounded-xl border py-2 pr-3 pl-2.5 text-[12.5px] font-bold tracking-wide uppercase"
        >
          <Icon name="close" />
          Clear
        </button>
      )}
    </section>
  );
}
