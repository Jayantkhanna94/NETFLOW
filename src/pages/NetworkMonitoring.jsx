import React, { useState } from "react";
import {
  Globe,
  Server,
  Wifi,
  Database,
  Activity,
  ShieldCheck,
  X,
} from "../components/Icons";
import { useData } from "../contexts/DataContext";
import { Card, Header, Status, Button } from "../components/UI";

export default function NetworkMonitoring() {
  const { liveMetrics, devices } = useData();

  // Topology node mapping with device links
  const nodes = [
    {
      name: "Internet Gateway",
      type: "Gateway",
      ip: "10.10.0.254",
      x: 50,
      y: 10,
      icon: Globe,
      status: "Online",
    },
    {
      name: "Core Router",
      type: "Router",
      ip: "10.10.0.2",
      x: 50,
      y: 36,
      icon: Server,
      status: "Online",
    },
    {
      name: "Core Switch",
      type: "Switch",
      ip: "10.10.0.1",
      x: 50,
      y: 62,
      icon: Server,
      status: "Online",
    },
    {
      name: "Computer Labs",
      type: "Access Point",
      ip: "10.10.4.18",
      x: 16,
      y: 88,
      icon: Wifi,
      status: "Offline",
    },
    {
      name: "Library",
      type: "Access Point",
      ip: "10.10.3.21",
      x: 39,
      y: 88,
      icon: Wifi,
      status: "Online",
    },
    {
      name: "Admin Block",
      type: "Access Point",
      ip: "10.10.6.1",
      x: 62,
      y: 88,
      icon: Wifi,
      status: "Online",
    },
    {
      name: "Data Center",
      type: "Servers",
      ip: "10.10.5.11",
      x: 85,
      y: 88,
      icon: Database,
      status: "Online",
    },
  ];

  const [selectedNode, setSelectedNode] = useState(null);

  return (
    <>
      {/* Live Metrics Row */}
      <div className="three-grid">
        <Card>
          <div className="metric">
            <Activity size={18} />
            Live Network Latency
          </div>
          <strong className="big">
            {liveMetrics.latency}
            <small> ms</small>
          </strong>
          <span className="good">Real-time telemetry stream</span>
        </Card>

        <Card>
          <div className="metric">
            <ShieldCheck size={18} />
            Global Packet Loss
          </div>
          <strong className="big">{liveMetrics.packetLoss}</strong>
          <span className="good">Healthy operational bounds</span>
        </Card>

        <Card>
          <div className="metric">
            <Wifi size={18} />
            Active Physical Interfaces
          </div>
          <strong className="big">
            {liveMetrics.interfacesUp}
            <small> / {liveMetrics.totalInterfaces}</small>
          </strong>
          <span className="good">
            {(
              (liveMetrics.interfacesUp / liveMetrics.totalInterfaces) *
              100
            ).toFixed(1)}
            % availability
          </span>
        </Card>
      </div>

      {/* Interactive Topology Card */}
      <Card className="topology-card">
        <Header
          title="Interactive Campus Topology"
          subtitle="Campus infrastructure map with live device status correlation"
          action={
            <span className="live">
              <i /> Real-time status
            </span>
          }
        />
        <div className="topology">
          <div className="vline a" />
          <div className="vline b" />

          {nodes.map((node) => {
            const Icon = node.icon;
            // Match with live device if exists
            const matchedDev = devices.find(
              (d) => d.name === node.name || d.ip === node.ip
            );
            const currentStatus = matchedDev ? matchedDev.status : node.status;

            return (
              <div
                key={node.name}
                className="node"
                style={{
                  left: `${node.x}%`,
                  top: `${node.y}%`,
                  cursor: "pointer",
                  border:
                    selectedNode?.name === node.name
                      ? "2px solid var(--primary)"
                      : undefined,
                }}
                onClick={() =>
                  setSelectedNode({ ...node, status: currentStatus })
                }
                title={`Click to inspect ${node.name}`}
              >
                <div className="node-icon">
                  <Icon size={19} />
                </div>
                <b>{node.name}</b>
                <small>{node.ip}</small>
                <Status value={currentStatus} />
              </div>
            );
          })}
        </div>
      </Card>

      {/* Node Inspector Modal */}
      {selectedNode && (
        <div className="modal-bg">
          <div className="modal" style={{ width: "min(480px, 95vw)" }}>
            <div className="modal-head">
              <h2>Node Details: {selectedNode.name}</h2>
              <button
                type="button"
                className="icon-btn"
                onClick={() => setSelectedNode(null)}
              >
                <X size={17} />
              </button>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                marginBottom: "20px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  borderBottom: "1px solid var(--border)",
                  paddingBottom: "8px",
                }}
              >
                <span style={{ color: "var(--muted)", fontSize: "12px" }}>
                  Status
                </span>
                <Status value={selectedNode.status} />
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  borderBottom: "1px solid var(--border)",
                  paddingBottom: "8px",
                }}
              >
                <span style={{ color: "var(--muted)", fontSize: "12px" }}>
                  IP Address
                </span>
                <b className="mono">{selectedNode.ip}</b>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  borderBottom: "1px solid var(--border)",
                  paddingBottom: "8px",
                }}
              >
                <span style={{ color: "var(--muted)", fontSize: "12px" }}>
                  Device Type
                </span>
                <b>{selectedNode.type}</b>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  borderBottom: "1px solid var(--border)",
                  paddingBottom: "8px",
                }}
              >
                <span style={{ color: "var(--muted)", fontSize: "12px" }}>
                  Round Trip Latency
                </span>
                <b>
                  {selectedNode.status === "Online"
                    ? `${liveMetrics.latency} ms`
                    : "Unreachable"}
                </b>
              </div>
            </div>

            <div className="modal-actions">
              <Button variant="primary" onClick={() => setSelectedNode(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export { NetworkMonitoring, NetworkMonitoring as Network };
