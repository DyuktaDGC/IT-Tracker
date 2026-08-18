import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { TrackerProvider } from "./hooks/useTracker.js";
import router from "./routes.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <TrackerProvider>
      <RouterProvider router={router} />
    </TrackerProvider>
  </StrictMode>,
);
