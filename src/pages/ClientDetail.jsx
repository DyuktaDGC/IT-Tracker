import { useParams } from "react-router-dom";
import ProgressBar from "../components/ProgressBar.jsx";
import Row, { RowTitle } from "../components/Row.jsx";
import StatCard from "../components/StatCard.jsx";
import StatusPill from "../components/StatusPill.jsx";
import Breadcrumbs from "../components/Breadcrumbs.jsx";
import { Card, DateValue, Field, Note, PageHead, Section } from "../components/Layout.jsx";
import { NotFound } from "../components/States.jsx";
import { formatPercent, plural } from "../lib/format.js";
import { useTracker } from "../hooks/useTracker.js";

export default function ClientDetail() {
  const { clientId } = useParams();
  const { data } = useTracker();
  const client = data.clients.find((entry) => entry.id === clientId);
  if (!client) return <NotFound />;

  const projects = data.projects.filter((project) => project.clientId === clientId);
  const open = client.statusMix.inProgress + client.statusMix.onHold;
  const items = projects.flatMap((project) => project.items);
  const unrecorded = items.filter((item) => !item.dataStatus && !item.buildStatus && !item.finalStatus).length;

  return (
    <>
      <Breadcrumbs trail={[{ label: "Client", to: "/clients" }, { label: client.name }]} />
      <PageHead
        tight
        title={client.name}
        subtitle={`Assigned to ${client.handledBy.join(", ")} · ${plural(client.dashboardCount, "dashboard")} · ${plural(client.itemsTotal, "checklist item")}`}
      />

      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard tone="violet" label="Dashboards" value={client.dashboardCount} />
        <StatCard
          tone={client.completionPct === 100 ? "mint" : "blue"}
          label="Completion"
          value={formatPercent(client.completionPct)}
          foot={`${client.itemsDone}/${client.itemsTotal} checklist items`}
        />
        <StatCard tone="mint" label="Delivered" value={client.statusMix.completed} />
        <StatCard tone={open ? "rose" : "slate"} label="Open" value={open} />
      </div>

      {client.completionPct === 0 && (
        <Note label="Why this reads 0%">
          <b className="text-ink font-semibold">Nothing has cleared all three gates yet.</b> {unrecorded} of{" "}
          {items.length} checklist rows have no status recorded in the sheet.
        </Note>
      )}

      <Section title="Dashboards" hint={client.dashboardCount}>
        <Card>
          {projects.map((project) => (
            <Row
              key={project.id}
              to={`/clients/${clientId}/${project.id}`}
              className="lg:grid-cols-[minmax(0,1.4fr)_150px_130px_minmax(160px,1fr)_220px]"
            >
              <RowTitle title={project.dashboard} meta={plural(project.itemsTotal, "checklist item")} />
              <div>
                <StatusPill value={project.status} />
              </div>
              <div className="hidden lg:block">
                <Field label="Stage">{project.stage ?? "not recorded"}</Field>
              </div>
              <div>
                <div className="mb-1.5 flex items-baseline justify-between gap-2">
                  <span className="text-[15px] font-semibold tracking-tight tabular-nums">
                    {formatPercent(project.completionPct)}
                  </span>
                  <span className="text-muted text-xs tabular-nums">
                    {project.itemsDone}/{project.itemsTotal}
                  </span>
                </div>
                <ProgressBar value={project.completionPct} label={`${project.dashboard} completion`} />
              </div>
              <div className="hidden gap-8 lg:flex">
                <Field label="Start Date">
                  <DateValue value={project.startDate} />
                </Field>
                <Field label="Delivery Date">
                  <DateValue value={project.deliveryDate} />
                </Field>
              </div>
            </Row>
          ))}
        </Card>
      </Section>
    </>
  );
}
