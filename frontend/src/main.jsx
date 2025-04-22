import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// import './index.css'
import "./assets/all.scss";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

import App from "./App.jsx";

//TODO remove if this doesn't make the error go away

// import "./lal-vite-env.js";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>
);
