import React, { useState } from "react";
import {
  FileText,
  Download,
  Database,
  TrendingUp,
  CalendarDays,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
} from "../components/Icons";
import { Card, Header, Button } from "../components/UI";

export default function Reports() {
  const initialReports = [
    ["Monthly Network Health Report", "Network", "Sep 2026", "2.4 MB"],
    ["Device Availability Report", "Devices", "Sep 2026", "1.1 MB"],
    ["Incident Summary", "Incidents", "Aug 2026", "840 KB"],
    ["Resource Utilization", "Resources", "Aug 2026", "1.7 MB"],
  ];

  const [reports, setReports] = useState(initialReports);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [downloading, setDownloading] = useState(null);

  // Asynchronous Report Generation with loading state & retry functionality
  const handleGenerateReport = async () => {
    setIsGenerating(true);
    setError(null);
    setSuccessMsg("");

    try {
      // Simulate asynchronous metric compilation
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newReportName = `Live Audit Telemetry — ${new Date().toLocaleDateString()}`;
      const newEntry = [
        newReportName,
        "Telemetry",
        new Date().toLocaleString("default", { month: "short", year: "numeric" }),
        "1.3 MB",
      ];

      setReports((prev) => [newEntry, ...prev]);
      setSuccessMsg("Audit report compiled and added to repository.");
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err) {
      setError("Failed to compile report metrics. Please retry.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Asynchronous Report Download with simulated packaging and DOM anchor click
  const handleDownloadReport = async (reportName, category) => {
    setDownloading(reportName);
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));

      // Generate downloadable audit text blob via DOM manipulation
      const content = `NetFlow Enterprise Infrastructure Audit\nReport: ${reportName}\nCategory: ${category}\nTimestamp: ${new Date().toISOString()}\nStatus: Verified Complete\n`;
      const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${reportName.toLowerCase().replace(/\s+/g, "-")}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      alert("Download failed. Please check network connection.");
    } finally {
      setDownloading(null);
    }
  };

  return (
    <>
      <Card>
        <Header
          title="Reports & Exports"
          subtitle="Generate operational reports for your project demo"
          action={
            <Button
              icon={
                isGenerating ? (
                  <RotateCcw size={15} className="trend" />
                ) : (
                  <FileText size={15} />
                )
              }
              onClick={handleGenerateReport}
              disabled={isGenerating}
            >
              {isGenerating ? "Compiling Report..." : "Generate Report"}
            </Button>
          }
        />

        {error && (
          <div
            style={{
              padding: "10px 14px",
              borderRadius: "8px",
              background: "rgba(255, 92, 101, 0.1)",
              border: "1px solid var(--danger)",
              color: "var(--danger)",
              fontSize: "11px",
              marginBottom: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <AlertTriangle size={15} />
              <span>{error}</span>
            </div>
            <Button
              variant="ghost"
              onClick={handleGenerateReport}
              style={{ padding: "4px 8px", fontSize: "10px" }}
            >
              <RotateCcw size={12} /> Retry
            </Button>
          </div>
        )}

        {successMsg && (
          <div
            style={{
              padding: "10px 14px",
              borderRadius: "8px",
              background: "rgba(50, 213, 131, 0.1)",
              border: "1px solid var(--success)",
              color: "var(--success)",
              fontSize: "11px",
              marginBottom: "16px",
              display: "flex",
              alignItems: "center",
              gap: "7px",
            }}
          >
            <CheckCircle2 size={15} />
            <span>{successMsg}</span>
          </div>
        )}

        <div className="report-grid">
          {reports.map((r) => (
            <div className="report" key={r[0]}>
              <div className="report-icon">
                <FileText size={19} />
              </div>
              <div>
                <b>{r[0]}</b>
                <small>
                  {r[1]} • {r[2]} • {r[3]}
                </small>
              </div>
              <button
                className="icon-btn"
                onClick={() => handleDownloadReport(r[0], r[1])}
                disabled={downloading === r[0]}
                aria-label={`Download ${r[0]}`}
                title="Download report audit file"
              >
                {downloading === r[0] ? (
                  <RotateCcw size={13} className="trend" />
                ) : (
                  <Download size={15} />
                )}
              </button>
            </div>
          ))}
        </div>
      </Card>

      <div className="three-grid">
        <Card>
          <Database size={20} />
          <h3>Network Report</h3>
          <p>Devices, interfaces, bandwidth and availability.</p>
        </Card>
        <Card>
          <TrendingUp size={20} />
          <h3>Performance Report</h3>
          <p>Traffic trends and utilization metrics.</p>
        </Card>
        <Card>
          <CalendarDays size={20} />
          <h3>Booking Report</h3>
          <p>Resource booking and occupancy summary.</p>
        </Card>
      </div>
    </>
  );
}

export { Reports };
