const DATE = new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" });
const ISO = /^\d{4}-\d{2}-\d{2}$/;

export const formatDate = (value) => (ISO.test(value ?? "") ? DATE.format(new Date(`${value}T00:00:00Z`)) : null);

export const formatPercent = (value) => `${Math.max(0, Math.min(100, Math.round(value ?? 0)))}%`;

export const initials = (name) => (name ?? "").trim().slice(0, 2).toUpperCase();

export const plural = (count, one, many = `${one}s`) => `${count} ${count === 1 ? one : many}`;
