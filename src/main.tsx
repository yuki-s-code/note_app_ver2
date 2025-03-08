//main.tsx

import React, { Component } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./libs/app/store";
import App from "./App";
import "./index.css";

const container = document.getElementById("root")!;
const root = createRoot(container);

const showErrorOverlay = (err: Event) => {
  const ErrorOverlay = customElements.get("vite-error-overlay");
  if (!ErrorOverlay) {
    return;
  }
  const overlay = new ErrorOverlay(err);
  const body = document.body;
  if (body !== null) {
    body.appendChild(overlay);
  }
};

window.addEventListener("error", showErrorOverlay);
window.addEventListener("unhandledrejection", ({ reason }) =>
  showErrorOverlay(reason)
);
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);

postMessage({ payload: "removeLoading" }, "*");
