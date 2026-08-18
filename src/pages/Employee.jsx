import { Link } from "react-router-dom";
import Donut from "../components/Donut.jsx";
import StatCard from "../components/StatCard.jsx";
import StatusStack from "../components/StatusStack.jsx";
import StatusPill from "../components/StatusPill.jsx";
import { Card, PageHead, Section } from "../components/Layout.jsx";
import { Empty } from "../components/States.jsx";
import { formatPercent, initials, plural } from "../lib/format.js";
import { MIX_KEYS } from "../lib/status.js";
import { useTracker } from "../hooks/useTracker.js";

const PERSON_TONES = ["mint", "slate", "violet", "blue", "rose"];

export default function Employee() {
  const { data, filtersActive } = useTracker();
  const { employees, kpis } = data;

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
            label={`${employee.name} dashboards`}
            value={employee.projectCount}
            foot={`${formatPercent(employee.completionPct)} complete`}
          />
        ))}
      </div>

      <Section title="Employee" hint={plural(employees.length, "person", "people")}>
        <div className="grid gap-3 lg:grid-cols-2">
          {employees.map((employee) => (
            <Card key={employee.name} className="p-5">
              <div className="mb-4 flex flex-wrap items-center gap-3.5">
                <span className="bg-accent-bg text-accent-ink grid size-10 flex-none place-items-center rounded-xl text-[13px] font-semibold tracking-wider">
                  {initials(employee.name)}
                </span>
                <div className="mr-auto">
                  <div className="text-base font-semibold tracking-tight">{employee.name}</div>
                  <div className="text-muted text-xs">
                    {plural(employee.projectCount, "dashboard")} · {plural(employee.clientCount, "client")}
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

              {(employee.projects ?? []).length > 0 && (
                <div className="border-line-2 mt-5 border-t pt-4">
                  <div className="text-muted mb-2.5 text-[10.5px] font-bold tracking-widest uppercase">
                    Dashboards
                  </div>
                  <ul className="grid gap-1.5">
                    {employee.projects.map((assignment) => (
                      <li key={`${assignment.clientId}-${assignment.projectId}`}>
                        <Link
                          to={`/clients/${assignment.clientId}/${assignment.projectId}`}
                          className="hover:bg-surface-2 group flex items-center gap-3 rounded-lg px-2 py-2"
                        >
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-[13.5px] font-medium group-hover:underline">
                              {assignment.dashboard}
                            </span>
                            <span className="text-muted block truncate text-[11.5px]">{assignment.client}</span>
                          </span>
                          <StatusPill value={assignment.status} />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Card>
          ))}
        </div>
      </Section>
    </>
  );
}
