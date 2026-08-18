import Donut from "./Donut.jsx";
import StageSteps from "./StageSteps.jsx";
import StatusPill from "./StatusPill.jsx";
import { Card, DateValue, Field, Section } from "./Layout.jsx";
import { plural } from "../lib/format.js";

const blank = (value) => {
  const text = typeof value === "string" ? value.trim().toLowerCase() : "";
  return !text || text === "none" || text === "not started";
};

// A row is "future scope" while none of its three gates has been recorded.
const isFutureScope = (item) => blank(item.dataStatus) && blank(item.buildStatus) && blank(item.finalStatus);

function ChecklistCard({ title, hint, items, tone = "accent", empty }) {
  const accent = tone === "muted" ? "text-muted" : "text-accent-ink";

  return (
    <Card className="p-5">
      <div className="mb-3.5 flex items-center gap-2.5">
        <span className="bar-fill h-4 w-1 flex-none rounded-full" aria-hidden="true" />
        <h3 className="text-[15px] font-bold tracking-tight">{title}</h3>
        <span className="bg-accent-bg text-accent-ink rounded-full px-2 py-0.5 text-[11px] font-semibold tabular-nums">
          {hint}
        </span>
      </div>

      {items.length === 0 ? (
        <p className="text-muted py-6 text-center text-[13px] italic">{empty}</p>
      ) : (
        <ol className="grid gap-1">
          {items.map((item, index) => (
            <li
              key={`${item.item}-${index}`}
              className="border-line-2 hover:bg-surface-2 grid gap-2 rounded-xl border-t px-2 py-3 first:border-t-0"
            >
              <div className="flex items-baseline gap-2.5">
                <span className={`text-[12.5px] font-bold tabular-nums ${accent}`}>{index + 1}.</span>
                <div className="min-w-0">
                  <div className="text-[14.5px] font-semibold">{item.item}</div>
                  {item.type && (
                    <div className="text-muted mt-0.5 text-[11.5px] font-semibold tracking-wide uppercase">
                      {item.type}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-1.5 pl-6">
                <StatusPill value={item.dataStatus} />
                <StatusPill value={item.buildStatus} />
                <StatusPill value={item.finalStatus} />
              </div>

              <div className="text-muted flex flex-wrap gap-x-5 gap-y-1 pl-6 text-[12px]">
                <span>
                  Start: <DateValue value={item.startDate} />
                </span>
                <span>
                  Delivery: <DateValue value={item.deliveryDate} />
                </span>
              </div>

              {item.remarks && <div className="text-ink-2 pl-6 text-[12.5px]">{item.remarks}</div>}
            </li>
          ))}
        </ol>
      )}
    </Card>
  );
}

// Summary card + stage steps + checklist for a single dashboard. Shared by the
// standalone dashboard page and the inline switcher on the client page.
export default function ProjectDetail({ project, showAssignee = true }) {
  const items = project.items ?? [];
  const future = items.filter(isFutureScope);
  const active = items.filter((item) => !isFutureScope(item));

  return (
    <>
      <Card className="mt-4 grid gap-6 p-5 lg:grid-cols-[auto_1fr] lg:gap-10 lg:p-6">
        <div className="flex items-center gap-5">
          <Donut
            value={project.completionPct}
            label={`${project.dashboard} completion`}
            caption={`${project.itemsDone}/${project.itemsTotal}`}
            className="size-32 flex-none"
            thickness={11}
          />
          <div>
            <div className="text-muted text-[12.5px] tabular-nums">
              {project.itemsDone} of {plural(project.itemsTotal, "checklist item")} cleared
            </div>
            <div className="mt-2.5">
              <StatusPill value={project.status} />
            </div>
          </div>
        </div>

        <dl className="grid grid-cols-2 gap-x-6 gap-y-4 self-start sm:grid-cols-3">
          {showAssignee && <Field label="Assigned To">{project.employee || "not recorded"}</Field>}
          <Field label="Stage">{project.stage ?? "not recorded"}</Field>
          <Field label="Pending With">{project.pendingWith ?? "not recorded"}</Field>
          <Field label="Follow Up Status">{project.followUp ?? "not recorded"}</Field>
          <Field label="Start Date">
            <DateValue value={project.startDate} />
          </Field>
          <Field label="Delivery Date">
            <DateValue value={project.deliveryDate} />
          </Field>
        </dl>
      </Card>

      <div className="mt-3.5">
        <StageSteps stage={project.stage} />
      </div>

      <Section title="Checklist" hint={plural(items.length, "item")}>
        <div className="grid gap-3 xl:grid-cols-2">
          <ChecklistCard
            title="Checklist"
            hint={active.length}
            items={active}
            empty="Nothing has been started on this dashboard yet."
          />
          <ChecklistCard
            title="Future Scope"
            hint={future.length}
            items={future}
            tone="muted"
            empty="Every row has a status recorded — nothing pending."
          />
        </div>
      </Section>
    </>
  );
}
