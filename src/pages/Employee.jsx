import { Link } from "react-router-dom";
import Donut from "../components/Donut.jsx";
import ProgressBar from "../components/ProgressBar.jsx";
import StatCard from "../components/StatCard.jsx";
import StatusStack from "../components/StatusStack.jsx";
import { Card, PageHead, Section } from "../components/Layout.jsx";
import { Empty } from "../components/States.jsx";
import { formatPercent, initials, plural } from "../lib/format.js";
import { MIX_KEYS } from "../lib/status.js";
import { useTracker } from "../hooks/useTracker.js";

const PERSON_TONES = ["mint", "slate", "violet", "blue", "rose"];

// Average performance per client = checklist items done / total across every
// dashboard that employee owns for the client. Falls back to the mean of the
// dashboard percentages when a client has no checklist items recorded yet.
function clientsOf(employee, projects) {
  const byClient = new Map();

  for (const project of projects) {
    if (project.employee !== employee.name) continue;
    const entry = byClient.get(project.clientId) ?? {
      id: project.clientId,
      name: project.client,
      dashboardCount: 0,
      itemsDone: 0,
      itemsTotal: 0,
      pctSum: 0,
    };
    entry.dashboardCount += 1;
    entry.itemsDone += project.itemsDone ?? 0;
    entry.itemsTotal += project.itemsTotal ?? 0;
    entry.pctSum += project.completionPct ?? 0;
    byClient.set(project.clientId, entry);
  }

  return [...byClient.values()]
    .map((entry) => ({
      ...entry,
      avgPct:
        entry.itemsTotal > 0
          ? (entry.itemsDone / entry.itemsTotal) * 100
          : entry.dashboardCount > 0
            ? entry.pctSum / entry.dashboardCount
            : 0,
    }))
    .sort((a, b) => b.avgPct - a.avgPct || a.name.localeCompare(b.name));
}

export default function Employee() {
  const { data, filtersActive } = useTracker();
  const { employees, kpis, projects } = data;

  if (employees.length === 0) {
    return (
      <>
        <PageHead title="Employee performance" />
        <Empty month={data.month} filtered={filtersActive} />
      </>
    );
  }

  return (
    <>
      <PageHead title="Employee performance" />

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:auto-cols-fr lg:grid-flow-col">
        <StatCard tone="violet" label="Total employees" value={employees.length} />
        <StatCard tone="blue" label="Total clients" value={kpis.totalClients} />
        {employees.map((employee, index) => (
          <StatCard
            key={employee.name}
            tone={PERSON_TONES[index % PERSON_TONES.length]}
            label={`${employee.name} clients`}
            value={employee.clientCount}
            foot={`${formatPercent(employee.completionPct)} avg performance`}
          />
        ))}
      </div>

      <Section title="Employee" hint={plural(employees.length, "person", "people")}>
        <div className="grid gap-3 lg:grid-cols-2">
          {employees.map((employee) => {
            const clients = clientsOf(employee, projects ?? []);

            return (
              <Card key={employee.name} className="p-5">
                <div className="mb-4 flex flex-wrap items-center gap-3.5">
                  <span className="bg-accent-bg text-accent-ink grid size-10 flex-none place-items-center rounded-xl text-[13px] font-semibold tracking-wider">
                    {initials(employee.name)}
                  </span>
                  <div className="mr-auto">
                    <div className="text-base font-semibold tracking-tight">{employee.name}</div>
                    <div className="text-muted text-xs">
                      {plural(employee.clientCount, "client")} · {plural(employee.projectCount, "dashboard")}
                    </div>
                  </div>
                  <Donut
                    value={employee.completionPct}
                    label={`${employee.name} completion`}
                    caption={`${employee.itemsDone}/${employee.itemsTotal}`}
                    className="size-20 flex-none"
                    thickness={12}
                    figureClass="text-[15px]"
                  />
                </div>

                <div className="mt-4">
                  <StatusStack
                    rows={[
                      {
                        label: "Dashboard status",
                        meta: plural(employee.projectCount, "dashboard"),
                        segments: MIX_KEYS.map(([key, label, tone]) => ({
                          key,
                          label,
                          tone,
                          value: employee.statusMix?.[key] ?? 0,
                        })),
                      },
                    ]}
                  />
                </div>

                {clients.length > 0 && (
                  <div className="border-line-2 mt-5 border-t pt-4">
                    <div className="text-muted mb-2.5 text-[10.5px] font-bold tracking-widest uppercase">
                      Clients handled
                    </div>
                    <ul className="grid gap-1">
                      {clients.map((client) => (
                        <li key={client.id}>
                          <Link
                            to={`/clients/${client.id}`}
                            className="hover:bg-surface-2 group grid gap-2 rounded-lg px-2 py-2 sm:grid-cols-[minmax(0,1fr)_minmax(140px,1fr)] sm:items-center"
                          >
                            <span className="min-w-0">
                              <span className="block truncate text-[13.5px] font-medium group-hover:underline">
                                {client.name}
                              </span>
                              <span className="text-muted block truncate text-[11.5px]">
                                {plural(client.dashboardCount, "dashboard")} · {client.itemsDone}/
                                {client.itemsTotal} items
                              </span>
                            </span>
                            <span className="block">
                              <span className="mb-1 flex items-baseline justify-between gap-2">
                                <span className="text-[13px] font-semibold tracking-tight tabular-nums">
                                  {formatPercent(client.avgPct)}
                                </span>
                                <span className="text-muted text-[11px]">avg performance</span>
                              </span>
                              <ProgressBar
                                value={client.avgPct}
                                label={`${employee.name} average performance for ${client.name}`}
                              />
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </Section>
    </>
  );
}
