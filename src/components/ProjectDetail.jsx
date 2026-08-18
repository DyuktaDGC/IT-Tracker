import Donut from "./Donut.jsx";
import StageSteps from "./StageSteps.jsx";
import StatusPill from "./StatusPill.jsx";
import { Card, DateValue, Field } from "./Layout.jsx";
import { plural } from "../lib/format.js";

const blank = (value) => {
  const text = typeof value === "string" ? value.trim().toLowerCase() : "";
  return !text || text === "none" || text === "not started";
};

// A row is "future scope" while none of its three gates has been recorded.
const isFutureScope = (item) => blank(item.dataStatus) && blank(item.buildStatus) && blank(item.finalStatus);

const hasDate = (value) => typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);

// Group consecutive rows that share a type, keeping the sheet's order.
const groupByType = (items) =>
  items.reduce((groups, item) => {
    const type = item.type || "Other";
    const last = groups.at(-1);
    if (last && last.type === type) last.items.push(item);
    else groups.push({ type, items: [item] });
    return groups;
  }, []);

function ChecklistCard({ title, hint, items, empty }) {
  const groups = groupByType(items);

  return (
    <Card className="p-5">
      <div className="mb-1 flex items-center gap-2.5">
        <span className="bar-fill h-4 w-1 flex-none rounded-full" aria-hidden="true" />
        <h3 className="text-[15px] font-bold tracking-tight">{title}</h3>
        <span className="bg-accent-bg text-accent-ink rounded-full px-2 py-0.5 text-[11px] font-semibold tabular-nums">
          {hint}
        </span>
      </div>

      {items.length === 0 ? (
        <p className="text-muted py-6 text-center text-[13px] italic">{empty}</p>
      ) : (
        groups.map((group, groupIndex) => (
          <div key={`${group.type}-${groupIndex}`}>
            <div className="text-accent-ink mt-4 mb-1 flex items-baseline gap-2 text-[11.5px] font-bold tracking-widest uppercase">
              <span className="tabular-nums">{groupIndex + 1}.</span>
              <span>{group.type}</span>
              <span className="text-muted tabular-nums">{group.items.length}</span>
            </div>
            <ol className="grid">
              {group.items.map((item, index) => {
                const dates = [
                  hasDate(item.startDate) && ["Start", item.startDate],
                  hasDate(item.deliveryDate) && ["Delivery", item.deliveryDate],
                ].filter(Boolean);

                return (
                  <li
                    key={`${item.item}-${index}`}
                    className="border-line-2 hover:bg-surface-2 flex flex-wrap items-center gap-x-3 gap-y-1.5 border-t px-2 py-2.5 first:border-t-0"
                  >
                    <span className="text-muted w-9 flex-none text-right text-[12.5px] font-semibold tabular-nums">
                      {groupIndex + 1}.{index + 1}
                    </span>
                    <span className="min-w-0 flex-1 text-[14.5px] font-semibold">{item.item}</span>
                    <span className="flex flex-none flex-wrap items-center gap-1.5">
                      <StatusPill value={item.dataStatus} />
                      <StatusPill value={item.buildStatus} />
                      <StatusPill value={item.finalStatus} />
                    </span>
                    {(dates.length > 0 || item.remarks) && (
                      <span className="text-muted flex w-full flex-wrap gap-x-4 pl-12 text-[12px]">
                        {dates.map(([label, value]) => (
                          <span key={label}>
                            {label}: <DateValue value={value} />
                          </span>
                        ))}
                        {item.remarks && <span className="text-ink-2">{item.remarks}</span>}
                      </span>
                    )}
                  </li>
                );
              })}
            </ol>
          </div>
        ))
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

      <div className="mt-3.5 grid gap-3 xl:grid-cols-2">
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
          empty="Every row has a status recorded — nothing pending."
        />
      </div>
    </>
  );
}
