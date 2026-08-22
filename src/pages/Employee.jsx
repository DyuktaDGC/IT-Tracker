import { Link } from "react-router-dom";
import Donut from "../components/Donut.jsx";
import ProgressBar from "../components/ProgressBar.jsx";
import Row, { RowTitle } from "../components/Row.jsx";
import StatCard from "../components/StatCard.jsx";
import StatusPill from "../components/StatusPill.jsx";
import StatusStack from "../components/StatusStack.jsx";
import { Card, PageHead, Section } from "../components/Layout.jsx";
import { Empty } from "../components/States.jsx";
import { formatPercent, initials, plural } from "../lib/format.js";
import { isUnassigned } from "../lib/filter.js";
import { MIX_KEYS } from "../lib/status.js";
import { useTracker } from "../hooks/useTracker.js";

const PERSON_TONES = ["mint", "slate", "violet", "blue", "rose"];

// Average performance per client = checklist items done / total across every
// dashboard that employee owns for the client. A client with no checklist rows
// yet is flagged rather than shown as 0%, so "no data" doesn't read as "no
// progress". Sorted worst-first: whatever is stalling sits at the top.
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
      tracked: entry.itemsTotal > 0,
      avgPct: entry.itemsTotal > 0 ? (entry.itemsDone / entry.itemsTotal) * 100 : 0,
    }))
    // Untracked clients last — they are a data gap, not a performance problem.
    .sort((a, b) => Number(a.tracked) - Number(b.tracked) || a.avgPct - b.avgPct || a.name.localeCompare(b.name));
}

function NoChecklist() {
  return (
    <span className="bg-surface-2 text-muted inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-semibold">
      <span className="bg-idle inline-block size-1.5 rounded-full" aria-hidden="true" />
      No checklist yet
    </span>
  );
}

export default function Employee() {
  const { data, filtersActive } = useTracker();
  const { kpis, projects } = data;

  // Unassigned work is a gap in the sheet, not a person: no person card, no
  // headcount — it lists as plain rows instead. Filtered here as well as in the
  // payload so an older workflow deployment still renders correctly.
  const people = (data.employees ?? []).filter((employee) => !isUnassigned(employee.name));
  const unassigned = (projects ?? []).filter((project) => isUnassigned(project.employee));

  if (people.length === 0 && unassigned.length === 0) {
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
        <StatCard tone="violet" label="Total employees" value={people.length} />
        <StatCard tone="blue" label="Total clients" value={kpis.totalClients} />
        {unassigned.length > 0 && (
          <StatCard
            tone="neutral"
            label="Unassigned dashboards"
            value={unassigned.length}
            foot="no owner in the sheet"
          />
        )}
        {people.map((employee, index) => (
          <StatCard
            key={employee.name}
            tone={PERSON_TONES[index % PERSON_TONES.length]}
            label={`${employee.name} clients`}
            value={employee.clientCount}
            foot={`${formatPercent(employee.completionPct)} avg performance`}
          />
        ))}
      </div>

      {unassigned.length > 0 && (
        <Section title="Unassigned dashboards" hint={unassigned.length}>
          <Card>
            {unassigned.map((project) => (
              <Row
                key={project.id}
                to={`/clients/${project.clientId}/${project.id}`}
                className="sm:grid-cols-[minmax(0,1.4fr)_auto] lg:grid-cols-[minmax(0,1.4fr)_auto_minmax(220px,1fr)]"
              >
                <RowTitle title={project.client} meta={project.dashboard} />
                <div className="justify-self-start sm:justify-self-end lg:justify-self-center">
                  <StatusPill value={project.status} />
                </div>
                <div className="sm:col-span-2 lg:col-span-1">
                  {project.itemsTotal > 0 ? (
                    <>
                      <div className="mb-1.5 flex items-baseline justify-between gap-2">
                        <span className="text-[15px] font-semibold tracking-tight tabular-nums">
                          {formatPercent(project.completionPct)}
                        </span>
                        <span className="text-muted text-xs tabular-nums">
                          {project.itemsDone}/{project.itemsTotal} checklist items
                        </span>
                      </div>
                      <ProgressBar value={project.completionPct} label={`${project.dashboard} completion`} />
                    </>
                  ) : (
                    <NoChecklist />
                  )}
                </div>
              </Row>
            ))}
          </Card>
        </Section>
      )}

      {people.length > 0 && (
        <Section title="Employee" hint={plural(people.length, "person", "people")}>
          <div className="grid gap-3 lg:grid-cols-2">
            {people.map((employee) => {
              const clients = clientsOf(employee, projects ?? []);

              return (
                <Card key={employee.name} className="p-5">
                  <div className="mb-4 flex flex-wrap items-center gap-3.5">
                    <span className="bg-accent-bg text-accent-ink grid size-10 flex-none place-items-center rounded-xl text-[14.5px] font-semibold tracking-wider">
                      {initials(employee.name)}
                    </span>
                    <div className="mr-auto">
                      <div className="text-lg font-semibold tracking-tight">{employee.name}</div>
                      <div className="text-muted text-[13px]">
                        {plural(employee.clientCount, "client")} · {plural(employee.projectCount, "dashboard")}
                      </div>
                    </div>
                    <Donut
                      value={employee.completionPct}
                      label={`${employee.name} completion`}
                      caption={`${employee.itemsDone}/${employee.itemsTotal}`}
                      className="size-20 flex-none"
                      thickness={12}
                      figureClass="text-[17px]"
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
                      <div className="text-muted mb-2.5 text-[12px] font-bold tracking-widest uppercase">
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
                                <span className="block truncate text-[15px] font-medium group-hover:underline">
                                  {client.name}
                                </span>
                                <span className="text-muted block truncate text-[13px]">
                                  {plural(client.dashboardCount, "dashboard")}
                                  {client.tracked && ` · ${client.itemsDone}/${client.itemsTotal} items`}
                                </span>
                              </span>
                              {client.tracked ? (
                                <span className="block">
                                  <span className="mb-1 flex items-baseline justify-between gap-2">
                                    <span className="text-[15px] font-semibold tracking-tight tabular-nums">
                                      {formatPercent(client.avgPct)}
                                    </span>
                                    <span className="text-muted text-[12.5px]">avg performance</span>
                                  </span>
                                  <ProgressBar
                                    value={client.avgPct}
                                    label={`${employee.name} average performance for ${client.name}`}
                                  />
                                </span>
                              ) : (
                                <NoChecklist />
                              )}
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
      )}
    </>
  );
}
