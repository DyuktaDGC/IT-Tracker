const MIX_BUCKET = {
  completed: "completed",
  approved: "completed",
  "in progress": "inProgress",
  "on hold": "onHold",
  "not started": "notStarted",
};

const emptyMix = () => ({ completed: 0, inProgress: 0, onHold: 0, notStarted: 0 });

const bucketOf = (status) => MIX_BUCKET[(status ?? "").trim().toLowerCase()] ?? "notStarted";

const pct = (done, total) => (total > 0 ? Math.round((100 * done) / total) : 0);

const addTo = (mix, status) => {
  mix[bucketOf(status)] += 1;
  return mix;
};

const rollUp = (projects) =>
  projects.reduce(
    (acc, project) => {
      acc.itemsDone += project.itemsDone;
      acc.itemsTotal += project.itemsTotal;
      addTo(acc.statusMix, project.status);
      return acc;
    },
    { itemsDone: 0, itemsTotal: 0, statusMix: emptyMix() },
  );

const groupBy = (projects, key) => {
  const groups = new Map();
  for (const project of projects) {
    const value = key(project);
    if (!groups.has(value)) groups.set(value, []);
    groups.get(value).push(project);
  }
  return groups;
};

const FILTER_KEYS = ["employee", "business", "query"];

const matchesQuery = (project, query) => {
  if (!query) return true;
  const needle = query.trim().toLowerCase();
  if (!needle) return true;
  const haystack = [
    project.dashboard,
    project.client,
    project.employee,
    project.stage,
    project.status,
    ...(project.items ?? []).flatMap((item) => [item.item, item.remarks, item.futureScope]),
  ];
  return haystack.some((value) => typeof value === "string" && value.toLowerCase().includes(needle));
};

export const hasActiveFilter = (filters) =>
  FILTER_KEYS.some((key) => Boolean(typeof filters?.[key] === "string" ? filters[key].trim() : filters?.[key]));

export const employeeOptions = (data) =>
  [...new Set((data?.projects ?? []).map((project) => project.employee).filter(Boolean))].sort();

export const businessOptions = (data) =>
  [...new Map((data?.clients ?? []).map((client) => [client.id, client.name])).entries()]
    .map(([id, name]) => ({ id, name }))
    .sort((a, b) => a.name.localeCompare(b.name));

export function filterTracker(data, filters) {
  if (!data || !hasActiveFilter(filters)) return data;

  const { employee, business, query } = filters;
  const projects = data.projects.filter(
    (project) =>
      (!employee || project.employee === employee) &&
      (!business || project.clientId === business) &&
      matchesQuery(project, query),
  );

  const clientsById = new Map(data.clients.map((client) => [client.id, client]));
  const clients = [...groupBy(projects, (project) => project.clientId)].map(([clientId, group]) => {
    const source = clientsById.get(clientId);
    const { itemsDone, itemsTotal, statusMix } = rollUp(group);
    return {
      ...source,
      id: clientId,
      name: source?.name ?? group[0].client,
      handledBy: [...new Set(group.map((project) => project.employee).filter(Boolean))],
      dashboardCount: group.length,
      itemsDone,
      itemsTotal,
      completionPct: pct(itemsDone, itemsTotal),
      statusMix,
    };
  });

  const employees = [...groupBy(projects, (project) => project.employee)].map(([name, group]) => {
    const { itemsDone, itemsTotal, statusMix } = rollUp(group);
    return {
      name,
      projectCount: group.length,
      clientCount: new Set(group.map((project) => project.clientId)).size,
      completionPct: pct(itemsDone, itemsTotal),
      itemsDone,
      itemsTotal,
      statusMix,
      projects: group.map((project) => ({
        clientId: project.clientId,
        client: project.client,
        projectId: project.id,
        dashboard: project.dashboard,
        status: project.status,
      })),
    };
  });

  const mix = projects.reduce((acc, project) => addTo(acc, project.status), emptyMix());

  return {
    ...data,
    clients: clients.sort((a, b) => a.name.localeCompare(b.name)),
    employees: employees.sort((a, b) => a.name.localeCompare(b.name)),
    projects,
    kpis: {
      ...data.kpis,
      totalClients: clients.length,
      totalProjects: projects.length,
      activeProjects: mix.inProgress + mix.onHold,
      inProgress: mix.inProgress,
      notStarted: mix.notStarted,
      onHold: mix.onHold,
    },
  };
}
