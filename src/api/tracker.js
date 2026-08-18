import { z } from "zod";
import { request } from "./client.js";

const status = z.string().nullable();
const isoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "expected YYYY-MM-DD")
  .nullable();
const count = z.number().int().nonnegative();
const percent = z.number().min(0).max(100);
const pair = z.tuple([count, count]);

const mix = z.object({ completed: count, inProgress: count, onHold: count, notStarted: count });

const item = z.object({
  item: z.string(),
  type: z.string(),
  dataStatus: status,
  buildStatus: status,
  finalStatus: status,
  startDate: isoDate,
  deliveryDate: isoDate,
  complete: z.boolean(),
  gatesPassed: z.number().int().min(0).max(3),
  remarks: z.string().optional(),
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
  gates: z.object({ data: pair, build: pair, signoff: pair }),
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
