import Breadcrumbs from "../components/Breadcrumbs.jsx";
import Row, { RowTitle } from "../components/Row.jsx";
import ProgressBar from "../components/ProgressBar.jsx";
import StatCard from "../components/StatCard.jsx";
import { Card, PageHead, Section } from "../components/Layout.jsx";
import { Empty } from "../components/States.jsx";
import { formatPercent, plural } from "../lib/format.js";
import { useTracker } from "../hooks/useTracker.js";

const sumMix = (clients, key) => clients.reduce((total, client) => total + (client.statusMix?.[key] ?? 0), 0);

export default function Clients() {
  const { data, filtersActive } = useTracker();
  const { kpis, clients } = data;

  if (clients.length === 0) {
    return (
      <>
        <Breadcrumbs trail={[{ label: "Overview", to: "/" }, { label: "All clients" }]} />
        <PageHead tight title="Client overview" />
        <Empty month={data.month} filtered={filtersActive} />
      </>
    );
  }

  const completed = sumMix(clients, "completed");

  return (
    <>
      <Breadcrumbs trail={[{ label: "Overview", to: "/" }, { label: "All clients" }]} />
      <PageHead tight title="Client overview" />

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:auto-cols-fr lg:grid-flow-col">
        <StatCard tone="violet" label="Total clients" value={kpis.totalClients} />
        <StatCard tone="neutral" label="Total dashboards" value={kpis.totalProjects} />
        <StatCard tone="mint" label="Completed" value={completed} />
        <StatCard tone="blue" label="In progress" value={kpis.inProgress} />
        <StatCard tone="rose" label="On hold" value={kpis.onHold} />
        <StatCard tone="slate" label="Not started" value={kpis.notStarted} />
      </div>

      <Section title="Clients" hint={clients.length}>
        <Card>
          {clients.map((client) => (
            <Row
              key={client.id}
              to={`/clients/${client.id}`}
              className="lg:grid-cols-[minmax(0,1.6fr)_minmax(240px,1fr)]"
            >
              <RowTitle
                title={client.name}
                meta={`${plural(client.dashboardCount, "dashboard")} · ${client.handledBy.join(", ")}`}
              />
              <div>
                <div className="mb-1.5 flex items-baseline justify-between gap-2">
                  <span className="text-[15px] font-semibold tracking-tight tabular-nums">
                    {formatPercent(client.completionPct)}
                  </span>
                  <span className="text-muted text-xs tabular-nums">
                    {client.itemsDone}/{client.itemsTotal} checklist items
                  </span>
                </div>
                <ProgressBar value={client.completionPct} label={`${client.name} completion`} />
              </div>
            </Row>
          ))}
        </Card>
      </Section>
    </>
  );
}
