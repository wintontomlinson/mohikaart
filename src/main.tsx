import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import React from "react";

// Disable browser scroll restoration globally — we manage scroll position
// ourselves on every route change. This kills the "phantom white gap"
// that some browsers paint at the top when restoring stale scroll
// positions on SPA navigation.
if ("scrollRestoration" in window.history) {
  window.history.scrollRestoration = "manual";
}

// Last-ditch safety net for completely uncaught errors that prevent
// React from mounting at all.
window.addEventListener("unhandledrejection", (e) => {
  // eslint-disable-next-line no-console
  console.error("Unhandled rejection:", e.reason);
});

const isDev = import.meta.env.DEV;

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { error: Error | null; showDetails: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { error: null, showDetails: false };
  }
  static getDerivedStateFromError(error: Error) {
    return { error, showDetails: false };
  }
  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error("App error:", error, info);
  }
  reload = () => window.location.reload();
  goHome = () => { window.location.href = "/"; };
  toggle  = () => this.setState((s) => ({ showDetails: !s.showDetails }));

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
          background:
            "radial-gradient(ellipse 80% 60% at 30% 10%, hsl(348 55% 93% / 0.7), transparent 60%)," +
            "radial-gradient(ellipse 60% 50% at 80% 90%, hsl(38 65% 91% / 0.65), transparent 60%)," +
            "linear-gradient(168deg, hsl(36 42% 99%) 0%, hsl(35 32% 96%) 100%)",
          fontFamily: "DM Sans, system-ui, sans-serif",
          color: "hsl(22 20% 16%)",
        }}
      >
        <div
          style={{
            maxWidth: 480,
            background: "hsl(36 45% 99% / 0.92)",
            borderRadius: 24,
            padding: 32,
            border: "1px solid hsl(34 28% 87% / 0.6)",
            boxShadow:
              "0 28px 72px -28px hsl(348 28% 38% / 0.22), 0 8px 28px -14px hsl(34 38% 28% / 0.09)",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: 64, height: 64, borderRadius: 18, margin: "0 auto 20px",
              background: "linear-gradient(135deg, hsl(34 58% 52%/0.12), hsl(348 55% 90%/0.5))",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 28,
            }}
            aria-hidden
          >✦</div>
          <h1
            style={{
              fontFamily: "Playfair Display, Cormorant Garamond, serif",
              fontWeight: 400,
              fontSize: 32,
              margin: 0,
              letterSpacing: "-0.02em",
            }}
          >
            Something went wrong
          </h1>
          <p style={{ color: "hsl(25 10% 44%)", marginTop: 12, lineHeight: 1.6 }}>
            Sorry — an unexpected error occurred. Try refreshing the page; if the issue
            persists, please reach out via WhatsApp or email and we'll look into it.
          </p>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 24, flexWrap: "wrap" }}>
            <button
              onClick={this.reload}
              style={{
                padding: "10px 22px",
                borderRadius: 9999,
                border: "none",
                cursor: "pointer",
                background: "hsl(22 20% 16%)",
                color: "hsl(36 45% 97%)",
                fontWeight: 600,
                fontSize: 13,
                letterSpacing: "0.06em",
              }}
            >
              Refresh
            </button>
            <button
              onClick={this.goHome}
              style={{
                padding: "10px 22px",
                borderRadius: 9999,
                border: "1px solid hsl(34 28% 87%)",
                background: "transparent",
                cursor: "pointer",
                fontWeight: 500,
                fontSize: 13,
                letterSpacing: "0.06em",
                color: "hsl(22 20% 16%)",
              }}
            >
              Back to home
            </button>
          </div>

          {isDev && (
            <>
              <button
                onClick={this.toggle}
                style={{
                  marginTop: 18,
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  fontSize: 11,
                  textDecoration: "underline",
                  color: "hsl(25 10% 50%)",
                }}
              >
                {this.state.showDetails ? "Hide" : "Show"} technical details
              </button>
              {this.state.showDetails && (
                <pre
                  style={{
                    marginTop: 12,
                    textAlign: "left",
                    fontFamily: "ui-monospace, monospace",
                    fontSize: 11,
                    background: "hsl(0 0% 0% / 0.04)",
                    padding: 12,
                    borderRadius: 12,
                    overflow: "auto",
                    maxHeight: 240,
                    color: "hsl(22 20% 24%)",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {String(this.state.error)}
                  {"\n\n"}
                  {this.state.error.stack}
                </pre>
              )}
            </>
          )}
        </div>
      </div>
    );
  }
}

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
