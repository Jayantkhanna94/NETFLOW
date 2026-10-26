import React from "react";
import { AlertTriangle, RotateCcw, Activity } from "./Icons";

/**
 * Reusable Loading Skeleton for asynchronous cards and tables
 */
export function SkeletonLoader({ lines = 3, type = "card" }) {
  if (type === "table") {
    return (
      <div className="skeleton-table" aria-label="Loading content...">
        {[...Array(lines)].map((_, i) => (
          <div key={i} className="skeleton-row">
            <div className="skeleton-block w-25" />
            <div className="skeleton-block w-40" />
            <div className="skeleton-block w-20" />
            <div className="skeleton-block w-15" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="skeleton-card" aria-label="Loading content...">
      <div className="skeleton-header">
        <div className="skeleton-avatar" />
        <div className="skeleton-lines">
          <div className="skeleton-block w-60 h-16" />
          <div className="skeleton-block w-40 h-12" />
        </div>
      </div>
      <div className="skeleton-body">
        {[...Array(lines)].map((_, i) => (
          <div
            key={i}
            className={`skeleton-block h-12 ${
              i === lines - 1 ? "w-50" : "w-100"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * Reusable Error State banner with Retry Action
 */
export function AsyncErrorBanner({ error, onRetry, title = "Data Fetch Failed" }) {
  return (
    <div
      role="alert"
      style={{
        background: "rgba(255, 92, 101, 0.08)",
        border: "1px solid rgba(255, 92, 101, 0.3)",
        borderRadius: "12px",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        margin: "12px 0",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "8px",
            background: "rgba(255, 92, 101, 0.15)",
            display: "grid",
            placeItems: "center",
            color: "var(--danger)",
            flexShrink: 0,
          }}
        >
          <AlertTriangle size={20} />
        </div>
        <div>
          <b style={{ color: "var(--danger)", fontSize: "14px" }}>{title}</b>
          <p
            style={{
              margin: "2px 0 0",
              color: "var(--text)",
              fontSize: "12px",
              opacity: 0.9,
            }}
          >
            {error || "An unexpected error occurred while communicating with the server."}
          </p>
        </div>
      </div>

      {onRetry && (
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "4px" }}>
          <button
            type="button"
            className="btn btn-primary"
            style={{
              height: "34px",
              fontSize: "12px",
              padding: "0 16px",
              background: "var(--danger)",
              borderColor: "var(--danger)",
            }}
            onClick={onRetry}
          >
            <RotateCcw size={14} /> Try Again
          </button>
        </div>
      )}
    </div>
  );
}

/**
 * High-level wrapper component for async views
 */
export default function AsyncBoundary({
  isLoading,
  isError,
  error,
  onRetry,
  loadingComponent,
  children,
  empty = false,
  emptyMessage = "No records found.",
}) {
  if (isLoading) {
    return loadingComponent || <SkeletonLoader lines={3} />;
  }

  if (isError) {
    return <AsyncErrorBanner error={error} onRetry={onRetry} />;
  }

  if (empty) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "48px 24px",
          color: "var(--muted)",
          border: "1px dashed var(--border)",
          borderRadius: "12px",
        }}
      >
        <Activity size={32} style={{ opacity: 0.35, marginBottom: "8px" }} />
        <p style={{ margin: 0, fontSize: "13px" }}>{emptyMessage}</p>
      </div>
    );
  }

  return children;
}
