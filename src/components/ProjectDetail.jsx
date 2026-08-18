import Donut from "./Donut.jsx";
import StageSteps from "./StageSteps.jsx";
import StatusPill from "./StatusPill.jsx";
import { Card, DateValue, Field, Section } from "./Layout.jsx";
import { plural } from "../lib/format.js";

const HEADERS = [
  "Requirement / Checklist Item",
  "Data Status",
  "Dashboard Status",
  "Final Status",
  "Start Date",
  "Delivery Date",
  "Remarks",
];

const groupByType = (items) =>
  items.reduce((groups, item) => {
    const last = groups.at(-1);
    if (last && last.type === item.type) last.items.push(item);
    else groups.push({ type: item.type ?? "Other", items: [item] });
    return groups;
  }, []);

// Summary card + stage steps + checklist for a single dashboard. Shared by the
// standalone dashboard page and the inline switcher on the client page.
export default function ProjectDetail({ project, showAssignee = true }) {
  const groups = groupByType(project.items ?? []);

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

      <Section title="Checklist" hint={plural(project.itemsTotal, "item")}>
        <Card className="overflow-x-auto">
          <table className="w-full border-collapse text-[14px]">
            <thead>
              <tr>
                {HEADERS.map((header) => (
                  <th
                    key={header}
                    scope="col"
                    className="border-line bg-surface-2 text-muted border-b px-4.5 py-3 text-left text-[11px] font-bold tracking-widest whitespace-nowrap uppercase"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            {groups.map((group, groupIndex) => (
              <tbody key={`${group.type}-${groupIndex}`}>
                <tr>
                  <th
                    scope="colgroup"
                    colSpan={HEADERS.length}
                    className="border-line-2 text-accent-ink border-t px-4.5 pt-4 pb-2 text-left text-[11px] font-bold tracking-widest uppercase"
                  >
                    {group.type}
                    <span className="text-muted ml-2 font-semibold tabular-nums">{group.items.length}</span>
                  </th>
                </tr>
                {group.items.map((item, index) => (
                  <tr key={`${item.item}-${index}`} className="border-line-2 hover:bg-surface-2 border-t align-top">
                    <td className="px-4.5 py-3.5">
                      <div className="font-semibold">{item.item}</div>
                    </td>
                    <td className="px-4.5 py-3.5">
                      <StatusPill value={item.dataStatus} />
                    </td>
                    <td className="px-4.5 py-3.5">
                      <StatusPill value={item.buildStatus} />
                    </td>
                    <td className="px-4.5 py-3.5">
                      <StatusPill value={item.finalStatus} />
                    </td>
                    <td className="px-4.5 py-3.5 whitespace-nowrap">
                      <DateValue value={item.startDate} />
                    </td>
                    <td className="px-4.5 py-3.5 whitespace-nowrap">
                      <DateValue value={item.deliveryDate} />
                    </td>
                    <td className="text-ink-2 px-4.5 py-3.5 text-[13px]">
                      {item.remarks || <span className="text-muted text-xs italic">—</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            ))}
          </table>
        </Card>
      </Section>
    </>
  );
}
