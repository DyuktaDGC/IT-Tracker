const KNOWN = {
  completed: { label: "Completed", tone: "good" },
  approved: { label: "Approved", tone: "good" },
  // Counts as a cleared step (the data came in and was signed off), so it reads
  // green like the other finished states.
  "data approved": { label: "Data Approved", tone: "good" },
  "data pending": { label: "Data Pending", tone: "warn" },
  "data needs correction": { label: "Data Needs Correction", tone: "warn" },
  "in progress": { label: "In Progress", tone: "accent" },
  "on hold": { label: "On Hold", tone: "warn" },
  pending: { label: "Pending", tone: "warn" },
  "under review": { label: "Under Review", tone: "warn" },
  "not started": { label: "Not Started", tone: "grey" },
};

const BLANK = { label: "Not recorded", tone: "grey" };

export const STAGES = ["Client Contact", "Development", "Client Review", "Maintenance"];

export const MIX_KEYS = [
  ["completed", "Completed", "good"],
  ["inProgress", "In Progress", "accent"],
  ["onHold", "On Hold", "warn"],
  ["notStarted", "Not Started", "grey"],
];

export function statusOf(value) {
  const text = typeof value === "string" ? value.trim() : "";
  if (!text || text.toLowerCase() === "none") return BLANK;
  return KNOWN[text.toLowerCase()] ?? { label: text, tone: "grey" };
}
