import { createBrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import Employee from "./pages/Employee.jsx";
import Clients from "./pages/Clients.jsx";
import ClientDetail from "./pages/ClientDetail.jsx";
import ProjectTracker from "./pages/ProjectTracker.jsx";
import { NotFound, RouteError } from "./components/States.jsx";

export default createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <RouteError />,
    children: [
      { index: true, element: <Employee /> },
      { path: "clients", element: <Clients /> },
      { path: "clients/:clientId", element: <ClientDetail /> },
      { path: "clients/:clientId/:projectId", element: <ProjectTracker /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);
