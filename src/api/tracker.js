import { z } from "zod";
import { request } from "./client.js";

// The sheet is hand-typed, so a single junk cell must never blank the whole
// dashboard: every leaf falls back instead of failing the parse.
const status = z.string().nullable().catch(null);
const isoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "expected YYYY-MM-DD")
  .nullable()
  .catch(null);
const count = z.number().int().nonnegative().catch(0);
const percent = z.number().min(0).max(100).catch(0);

const mix = z.object({ completed: count, inProgress: count, onHold: count, notStarted: count });

// Sheet layout: Client | Assigned To | Dashboard Name | Checklist |
// Start Date | Delivery Date | Status | Remarks | Future scope
const item = z.object({
  item: z.string(),
  status: status,
  startDate: isoDate,
  deliveryDate: isoDate,
  remarks: z.string().nullable().optional(),
  futureScope: z.string().nullable().optional(),
});

const project = z.object({
  id: z.string(),
  clientId: z.string(),
  client: z.string(),
  dashboard: z.string(),
  employee: z.string(),
  stage: status,
  status: status,
  pendingWith: status,
  followUp: status,
  startDate: isoDate,
  deliveryDate: isoDate,
  itemsDone: count,
  itemsTotal: count,
  completionPct: percent,
  items: z.array(item),
});

const client = z.object({
  id: z.string(),
  name: z.string(),
  handledBy: z.array(z.string()),
  dashboardCount: count,
  itemsDone: count,
  itemsTotal: count,
  completionPct: percent,
  statusMix: mix,
});

const employee = z.object({
  name: z.string(),
  projectCount: count,
  clientCount: count,
  completionPct: percent,
  itemsDone: count,
  itemsTotal: count,
  statusMix: mix,
  projects: z.array(
    z.object({
      clientId: z.string(),
      client: z.string(),
      projectId: z.string(),
      dashboard: z.string(),
      status: status,
    }),
  ),
});

const trackerSchema = z.object({
  schemaVersion: z.literal(1),
  month: z.string().regex(/^\d{4}-\d{2}$/),
  kpis: z.object({
    totalClients: count,
    totalProjects: count,
    activeProjects: count,
    inProgress: count,
    notStarted: count,
    onHold: count,
  }),
  employees: z.array(employee),
  clients: z.array(client),
  projects: z.array(project),
});

const monthKey = z.string().regex(/^\d{4}-\d{2}$/);

const monthsSchema = z.object({
  months: z.array(monthKey),
  // Months that actually contain rows, and the newest of them. Optional so an
  // older deployment of the workflow keeps working.
  monthsWithRecords: z.array(monthKey).optional(),
  defaultMonth: monthKey.optional(),
});

class TrackerError extends Error {
  constructor(message, cause) {
    super(message);
    this.name = "TrackerError";
    this.cause = cause;
  }
}

const parse = (schema, data, label) => {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new TrackerError(`The ${label} payload did not match the expected shape.`, result.error);
  }
  return result.data;
};

const load = async (path, schema, label) => {
  const response = await request(path);
  if (!response.ok) throw new TrackerError(response.error);
  return parse(schema, response.data, label);
};

export const getMonths = () => load("/webhook/months", monthsSchema, "months");

export const getTracker = (month) =>
  load(`/webhook/tracker?month=${encodeURIComponent(month)}`, trackerSchema, "tracker");
