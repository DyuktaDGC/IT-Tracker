import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

// Reloading a deep link on a static host 404s with a browser router, because no
// file sits at /clients/x/y. The hash router is what keeps reloads working.
describe("routing", () => {
  it("uses the hash router", () => {
    expect(readFileSync("src/routes.jsx", "utf8")).toContain("createHashRouter");
  });
});

// A typo in one sheet cell used to fail the whole parse and blank the dashboard.
describe("tracker payload", () => {
  it("survives junk in a single cell", async () => {
    const { getTracker } = await import("./tracker.js");
    globalThis.fetch = async () =>
      new Response(JSON.stringify(payload), { headers: { "content-type": "application/json" } });

    const data = await getTracker("2026-08");
    expect(data.projects[0].deliveryDate).toBeNull();
    expect(data.projects[0].completionPct).toBe(0);
    expect(data.kpis.totalProjects).toBe(1);
  });
});

const project = {
  id: "acme--sales",
  clientId: "acme",
  client: "Acme",
  dashboard: "Sales",
  employee: "Pavan",
  stage: "Development",
  status: "In Progress",
  pendingWith: null,
  followUp: null,
  startDate: "2026-08-01",
  deliveryDate: "31st of never", // junk date
  itemsDone: 0,
  itemsTotal: 1,
  completionPct: 4000, // junk percentage
  items: [{ item: "Data", status: "Pending", startDate: null, deliveryDate: null }],
};

const payload = {
  schemaVersion: 1,
  month: "2026-08",
  kpis: { totalClients: 1, totalProjects: 1, activeProjects: 1, inProgress: 1, notStarted: 0, onHold: 0 },
  employees: [],
  clients: [],
  projects: [project],
};
