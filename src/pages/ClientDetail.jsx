import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProjectDetail from "../components/ProjectDetail.jsx";
import StatCard from "../components/StatCard.jsx";
import Breadcrumbs from "../components/Breadcrumbs.jsx";
import { Note, PageHead } from "../components/Layout.jsx";
import { NotFound } from "../components/States.jsx";
import { formatPercent } from "../lib/format.js";
import { useTracker } from "../hooks/useTracker.js";

function DashboardSwitcher({ projects, value, onChange }) {
  return (
    <div
      role="tablist"
      aria-label="Dashboard"
      className="border-line bg-surface-2 mt-5 inline-flex w-fit max-w-full flex-wrap gap-1 rounded-2xl border p-1"
    >
      {projects.map((project) => {
        const active = project.id === value;
        return (
          <button
            key={project.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(project.id)}
            className={`rounded-xl px-3.5 py-2 text-[13.5px] font-semibold tracking-tight transition-colors ${
              active ? "bg-accent-bg text-accent-ink" : "text-ink-2 hover:bg-surface hover:text-ink"
            }`}
          >
            {project.dashboard}
          </button>
        );
      })}
    </div>
  );
}

export default function ClientDetail() {
  const { clientId } = useParams();
  const { data } = useTracker();
  const [selected, setSelected] = useState(null);

  // Reset the switcher when the client changes.
  useEffect(() => setSelected(null), [clientId]);

  const client = data.clients.find((entry) => entry.id === clientId);
  if (!client) return <NotFound />;

  const projects = data.projects.filter((project) => project.clientId === clientId);
  const open = client.statusMix.inProgress + client.statusMix.onHold;
  const items = projects.flatMap((project) => project.items);
  const unrecorded = items.filter((item) => !item.dataStatus && !item.buildStatus && !item.finalStatus).length;

  // Default to the first dashboard; fall back if a filter drops the selected one.
  const active = projects.find((project) => project.id === selected) ?? projects[0] ?? null;

  return (
    <>
      <Breadcrumbs trail={[{ label: "Client", to: "/clients" }, { label: client.name }]} />
      <PageHead tight title={client.name} />

      {active && <DashboardSwitcher projects={projects} value={active.id} onChange={setSelected} />}

      <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
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

      {active && <ProjectDetail key={active.id} project={active} />}
    </>
  );
}
