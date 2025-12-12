import React from "react";
import ReactDOM from "react-dom/client";
import App from "@/App";
import "@/index.css";

import QueryProvider from "@/providers/QueryProvider";
import ThemeProvider from "@/providers/ThemeProvider";

import { Toaster } from "react-hot-toast";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider>
      <QueryProvider>
        <App />
        <Toaster position="top-right" />
      </QueryProvider>
    </ThemeProvider>
  </React.StrictMode>
);
