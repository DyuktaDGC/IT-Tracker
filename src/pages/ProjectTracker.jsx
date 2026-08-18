import { useParams } from "react-router-dom";
import Breadcrumbs from "../components/Breadcrumbs.jsx";
import ProjectDetail from "../components/ProjectDetail.jsx";
import { PageHead } from "../components/Layout.jsx";
import { NotFound } from "../components/States.jsx";
import { useTracker } from "../hooks/useTracker.js";

export default function ProjectTracker() {
  const { clientId, projectId } = useParams();
  const { data } = useTracker();
  const project = data.projects.find((entry) => entry.id === projectId && entry.clientId === clientId);
  if (!project) return <NotFound />;

  return (
    <>
      <Breadcrumbs
        trail={[
          { label: "Client", to: "/clients" },
          { label: project.client, to: `/clients/${clientId}` },
          { label: project.dashboard },
        ]}
      />
      <PageHead tight title={project.dashboard} subtitle={project.client} />
      <ProjectDetail project={project} />
    </>
  );
}
