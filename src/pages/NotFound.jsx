import React from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, Home, ArrowLeft } from "../components/Icons";
import { Card, Button } from "../components/UI";

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "70vh",
        display: "grid",
        placeItems: "center",
        padding: "24px",
      }}
    >
      <Card
        style={{
          maxWidth: "480px",
          width: "100%",
          textAlign: "center",
          padding: "40px 24px",
        }}
      >
        <div
          style={{
            width: "64px",
            height: "64px",
            borderRadius: "50%",
            background: "rgba(255, 92, 101, 0.12)",
            color: "var(--danger)",
            display: "grid",
            placeItems: "center",
            margin: "0 auto 16px",
          }}
        >
          <AlertTriangle size={32} />
        </div>
        <h1 style={{ fontSize: "28px", margin: "0 0 8px" }}>404 — Page Not Found</h1>
        <p style={{ color: "var(--muted)", fontSize: "14px", margin: "0 0 24px" }}>
          The requested SPA route does not exist or has been relocated. Check the URL or return to the main dashboard.
        </p>

        <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
          <Link to="/" className="btn btn-primary">
            <Home size={15} /> Dashboard Home
          </Link>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => window.history.back()}
          >
            <ArrowLeft size={15} /> Go Back
          </button>
        </div>
      </Card>
    </div>
  );
}
