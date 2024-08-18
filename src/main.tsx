import { NextUIProvider } from "@nextui-org/react";
import React from "react";
import ReactDOM from "react-dom/client";
import { Toaster } from "react-hot-toast";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { RecoilRoot } from "recoil";
import App from "./App";
import "./index.css";
import Verify from "./Verify";

const router = createBrowserRouter([
  {
    path: "/verify",
    element: <Verify />,
  },
  {
    path: "*",
    element: <App />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RecoilRoot>
      <NextUIProvider>
        <RouterProvider router={router} />
        <Toaster position="top-right" />
      </NextUIProvider>
    </RecoilRoot>
  </React.StrictMode>
);
