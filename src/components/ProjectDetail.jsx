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

const HEADERS = ["Step No", "Task", "Status", "Start Date", "Delivery Date"];

// Rows stay in sheet order — no grouping, no sorting.
function ChecklistCard({ title, hint, items, empty }) {
  return (
    <Card className="p-5">
      <div className="mb-3 flex items-center gap-2.5">
        <span className="bar-fill h-4 w-1 flex-none rounded-full" aria-hidden="true" />
        <h3 className="text-[15px] font-bold tracking-tight">{title}</h3>
        <span className="bg-accent-bg text-accent-ink rounded-full px-2 py-0.5 text-[11px] font-semibold tabular-nums">
          {hint}
        </span>
      </div>

      {items.length === 0 ? (
        <p className="text-muted py-6 text-center text-[13px] italic">{empty}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-[14px]">
            <thead>
              <tr>
                {HEADERS.map((header) => (
                  <th
                    key={header}
                    scope="col"
                    className="border-line text-muted border-b px-2 py-2 text-left text-[11px] font-bold tracking-widest whitespace-nowrap uppercase"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={`${item.item}-${index}`} className="border-line-2 hover:bg-surface-2 border-t">
                  <td className="text-muted px-2 py-3 text-[13px] font-semibold tabular-nums">{index + 1}</td>
                  <td className="px-2 py-3 font-semibold">{item.item}</td>
                  <td className="px-2 py-3">
                    <StatusPill value={item.finalStatus} />
                  </td>
                  <td className="px-2 py-3 whitespace-nowrap">
                    <DateValue value={item.startDate} />
                  </td>
                  <td className="px-2 py-3 whitespace-nowrap">
                    <DateValue value={item.deliveryDate} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
