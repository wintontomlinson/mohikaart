import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import React from "react";

// Global error catcher for debugging
window.addEventListener("error", (e) => {
  const root = document.getElementById("root");
  if (root && !root.innerHTML.trim()) {
    root.innerHTML = `<div style="padding:32px;font-family:monospace;background:#fff1f2;min-height:100vh"><h2 style="color:#b91c1c">Uncaught Error</h2><pre style="white-space:pre-wrap;color:#7f1d1d">${e.message}</pre><pre style="white-space:pre-wrap;color:#991b1b;font-size:12px">${e.filename}:${e.lineno}</pre></div>`;
  }
});
window.addEventListener("unhandledrejection", (e) => {
  console.error("Unhandled rejection:", e.reason);
});

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { error: Error | null }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 32, fontFamily: "monospace", background: "#fff1f2", minHeight: "100vh" }}>
          <h2 style={{ color: "#b91c1c" }}>App crashed</h2>
          <pre style={{ whiteSpace: "pre-wrap", color: "#7f1d1d" }}>{String(this.state.error)}</pre>
          <pre style={{ whiteSpace: "pre-wrap", color: "#991b1b", fontSize: 12 }}>{this.state.error?.stack}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
