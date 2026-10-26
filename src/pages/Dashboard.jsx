import React from "react";
import {
  Server,
  CheckCircle2,
  XCircle,
  Activity,
  Radio,
  Clock,
  Cpu,

} from "../components/Icons";
import { useData } from "../contexts/DataContext";
import { Card, Stat, Header, Status, Button } from "../components/UI";

export default function Dashboard() {
  const {
    devices,
    incidents,
    liveTraffic,
    liveMetrics,
    activityLogs,
    resolveIncident,
  } = useData();

  const onlineDevices = devices.filter((d) => d.status === "Online");
  const onlineCount = onlineDevices.length;
  const offlineCount = devices.length - onlineCount;

  // Compute live average CPU load from stored devices
  const avgCpu = onlineDevices.length
    ? Math.round(
        onlineDevices.reduce((acc, d) => acc + (d.cpu || 20), 0) /
          onlineDevices.length
      )
    : 0;

  return (
    <>
      {/* Top Telemetry KPI Cards */}
      <div className="stats-grid">
        <Stat
          label="Total Devices"
          value={devices.length + 320}
          icon={Server}
          trend={`${onlineCount} active in current zone`}
        />
        <Stat
          label="Online Devices"
          value={onlineCount + 296}
          icon={CheckCircle2}
          trend="98.4% uptime"
        />
        <Stat
          label="Offline Devices"
          value={offlineCount + 24}
          icon={XCircle}
          trend={offlineCount > 0 ? `${offlineCount} attention required` : "All systems operational"}
          danger={offlineCount > 0}
        />
        <Stat
          label="Live Bandwidth"
          value={liveMetrics.bandwidth}
          icon={Activity}
          trend={`Latency: ${liveMetrics.latency}ms`}
        />
      </div>

      {/* Real-time Telemetry & Infrastructure Load Table Breakdown */}
      <div className="dash-grid">
        <Card>
          <Header
            title="Real-Time Network Telemetry"
            subtitle={`Updated every 3.5s • Latency: ${liveMetrics.latency}ms • Loss: ${liveMetrics.packetLoss}`}
            action={
              <span className="live">
                <i /> Live Feed
              </span>
            }
          />
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Throughput</th>
                  <th>Bandwidth Rate</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {liveTraffic.slice(-5).reverse().map((point, idx) => (
                  <tr key={idx}>
                    <td className="mono">{point.t}</td>
                    <td><b>{point.v} Mbps</b></td>
                    <td>
                      <div className="progress">
                        <i style={{ width: `${Math.min(100, (point.v / 110) * 100)}%` }} />
                      </div>
                    </td>
                    <td>
                      <span className="status success">Normal</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card>
          <Header
            title="Infrastructure Utilization"
            subtitle={`Average across ${onlineCount} active machines: ${avgCpu}%`}
            action={<Cpu size={18} color="var(--primary)" />}
          />
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", padding: "8px 0" }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px", fontSize: "12px" }}>
                <span>Average CPU Utilization</span>
                <b>{avgCpu}%</b>
              </div>
              <div className="progress" style={{ width: "100%", height: "8px" }}>
                <i
                  style={{
                    width: `${avgCpu}%`,
                    backgroundColor:
                      avgCpu > 75
                        ? "var(--danger)"
                        : avgCpu > 50
                        ? "var(--warning)"
                        : "var(--primary)",
                  }}
                />
              </div>
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px", fontSize: "12px" }}>
                <span>Memory Allocation</span>
                <b>64%</b>
              </div>
              <div className="progress" style={{ width: "100%", height: "8px" }}>
                <i style={{ width: "64%", backgroundColor: "var(--cyan)" }} />
              </div>
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px", fontSize: "12px" }}>
                <span>Interface Availability</span>
                <b>{((liveMetrics.interfacesUp / liveMetrics.totalInterfaces) * 100).toFixed(1)}%</b>
              </div>
              <div className="progress" style={{ width: "100%", height: "8px" }}>
                <i
                  style={{
                    width: `${(liveMetrics.interfacesUp / liveMetrics.totalInterfaces) * 100}%`,
                    backgroundColor: "var(--success)",
                  }}
                />
              </div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                paddingTop: "12px",
                borderTop: "1px solid var(--border)",
                fontSize: "11px",
                color: "var(--muted)",
              }}
            >
              <span>Available Cores: 32</span>
              <span>Allocated RAM: 128 GB</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Device Health & Recent Incidents */}
      <div className="dash-grid">
        <Card>
          <Header
            title="Live Device Telemetry"
            subtitle={`${devices.length} registered hardware nodes`}
          />
          <div className="mini-list">
            {devices.slice(0, 5).map((d) => (
              <div className="mini-row" key={d.id}>
                <div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span
                      className={`pulse-dot ${
                        d.status === "Online"
                          ? "online"
                          : d.status === "Rebooting"
                          ? "rebooting"
                          : "offline"
                      }`}
                    />
                    <b>{d.name}</b>
                  </div>
                  <small>
                    {d.ip} • {d.location} • CPU: {d.cpu}%
                  </small>
                </div>
                <Status value={d.status} />
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <Header
            title="Active Incidents"
            subtitle={`${incidents.filter((i) => i.status !== "Resolved").length} open tickets`}
          />
          <div className="mini-list">
            {incidents.slice(0, 4).map((i) => (
              <div className="mini-row" key={i.id}>
                <div>
                  <b>{i.title}</b>
                  <small>
                    {i.id} • {i.device} • {i.time}
                  </small>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <Status value={i.status} />
                  {i.status !== "Resolved" && (
                    <Button
                      variant="ghost"
                      onClick={() => resolveIncident(i.id)}
                      style={{ padding: "4px 8px", fontSize: "10px" }}
                    >
                      Resolve
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Live System Activity Feed */}
      <Card>
        <Header
          title="Live Network Event Log"
          subtitle="Streaming audit log of device events and diagnostic telemetry"
          action={
            <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--muted)", fontSize: "11px" }}>
              <Radio size={14} className="trend" /> Live feed
            </div>
          }
        />
        <div className="activity-ticker">
          {activityLogs.slice(0, 5).map((log) => (
            <div className="activity-item" key={log.id}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span
                  className={`pulse-dot ${
                    log.type === "danger"
                      ? "offline"
                      : log.type === "warning"
                      ? "rebooting"
                      : "online"
                  }`}
                />
                <span>{log.text}</span>
              </div>
              <small style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <Clock size={11} /> {log.time}
              </small>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}

export { Dashboard };
