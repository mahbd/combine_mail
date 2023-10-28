import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { Theme } from "@radix-ui/themes";
import { RouterProvider } from "react-router-dom";
import router from "./services/router.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Theme>
      <RouterProvider router={router} />
    </Theme>
  </React.StrictMode>
);
