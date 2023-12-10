// main.tsx or main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { NextUIProvider } from "@nextui-org/react";
import App from "./App";
import { Toaster } from "react-hot-toast";
import { RecoilRoot } from "recoil";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RecoilRoot>
      <NextUIProvider>
        <App />
        <Toaster position="top-right" reverseOrder={false} />
      </NextUIProvider>
    </RecoilRoot>
  </React.StrictMode>
);
