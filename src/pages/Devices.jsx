import React, { useState, useEffect, useRef } from "react";
import { useOutletContext, useParams, useNavigate } from "react-router-dom";
import {
  Download,
  Plus,
  Pencil,
  Trash2,
  X,
  Terminal,
  Power,
  RotateCcw,
  Activity,
  CheckCircle,
  AlertCircle,
} from "../components/Icons";
import { exportCSV } from "../services/storage";
import { useData } from "../contexts/DataContext";
import { Card, Header, Button, SearchBox, Status, FormField, Input, Select } from "../components/UI";
import { validateIP, validateRequired } from "../services/validation";

export function DeviceModal({ form, setForm, save, close, editing }) {
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const firstInputRef = useRef(null);

  useEffect(() => {
    setTimeout(() => firstInputRef.current?.focus(), 100);
  }, []);

  const validate = () => {
    const errs = {};
    const nameErr = validateRequired(form.name, "Device Name");
    if (nameErr) errs.name = nameErr;

    const locErr = validateRequired(form.location, "Location");
    if (locErr) errs.location = locErr;

    const ipErr = validateIP(form.ip);
    if (ipErr) errs.ip = ipErr;

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validate();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched({ name: true, location: true, ip: true });
    if (!validate()) return;
    save(e);
  };

  return (
    <div className="modal-bg" role="dialog" aria-modal="true">
      <form className="modal" onSubmit={handleSubmit}>
        <div className="modal-head">
          <h2>{editing ? "Edit Device" : "Add Device"}</h2>
          <button type="button" className="icon-btn" onClick={close} aria-label="Close device modal">
            <X size={17} />
          </button>
        </div>

        <Input
          inputRef={firstInputRef}
          id="dev-name"
          label="Device Name"
          required
          value={form.name}
          onChange={(val) => setForm({ ...form, name: String(val) })}
          onBlur={() => handleBlur("name")}
          error={errors.name}
          touched={touched.name}
          placeholder="e.g. Core Switch B"
        />

        <Input
          id="dev-location"
          label="Location"
          required
          value={form.location}
          onChange={(val) => setForm({ ...form, location: String(val) })}
          onBlur={() => handleBlur("location")}
          error={errors.location}
          touched={touched.location}
          placeholder="e.g. Main Server Room"
        />

        <Input
          id="dev-ip"
          label="IP Address"
          required
          value={form.ip}
          onChange={(val) => setForm({ ...form, ip: String(val) })}
          onBlur={() => handleBlur("ip")}
          error={errors.ip}
          touched={touched.ip}
          placeholder="e.g. 10.10.0.1"
          helperText="Format: IPv4 address"
        />

        <div className="two-col">
          <Select
            id="dev-type"
            label="Type"
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            options={["Switch", "Router", "Access Point", "Server", "Printer"]}
          />
          <Select
            id="dev-status"
            label="Status"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            options={["Online", "Offline"]}
          />
        </div>

        <div className="modal-actions">
          <Button type="button" variant="ghost" onClick={close}>
            Cancel
          </Button>
          <Button type="submit">Save Device</Button>
        </div>
      </form>
    </div>
  );
}

// Live ICMP Ping Diagnostic Modal
function PingTerminalModal({ device, close, executePing }) {
  const [lines, setLines] = useState([]);
  const [running, setRunning] = useState(false);
  const terminalRef = useRef(null);

  const startPing = async () => {
    setLines([
      `PING ${device.name} (${device.ip}): 32 data bytes`,
      "Simulating ICMP echo requests...",
    ]);
    setRunning(true);

    await executePing(device.ip, (newLine) => {
      setLines((prev) => [...prev, newLine]);
    });

    setRunning(false);
  };

  useEffect(() => {
    startPing();
  }, [device.ip]);

  // DOM auto-scroll on new terminal line
  useEffect(() => {
    if (terminalRef.current) {
      if (typeof terminalRef.current.scrollTo === "function") {
        terminalRef.current.scrollTo({
          top: terminalRef.current.scrollHeight,
          behavior: "smooth",
        });
      } else {
        terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
      }
    }
  }, [lines]);

  return (
    <div className="modal-bg" role="dialog" aria-modal="true">
      <div className="modal" style={{ width: "min(600px, 95vw)" }}>
        <div className="modal-head">
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Terminal size={20} color="var(--primary)" />
            <div>
              <h2 style={{ fontSize: "16px", margin: 0 }}>
                ICMP Ping Diagnostic — {device.name}
              </h2>
              <small style={{ color: "var(--muted)" }}>Target: {device.ip}</small>
            </div>
          </div>
          <button type="button" className="icon-btn" onClick={close} aria-label="Close terminal">
            <X size={17} />
          </button>
        </div>

        <div className="terminal-window" ref={terminalRef}>
          <div className="terminal-header">
            <span className="terminal-dot" style={{ background: "#ff5f56" }} />
            <span className="terminal-dot" style={{ background: "#ffbd2e" }} />
            <span className="terminal-dot" style={{ background: "#27c93f" }} />
            <span style={{ marginLeft: "6px" }}>netflow-diagnostics v2.4 (icmp)</span>
          </div>
          {lines.map((l, i) => (
            <div
              key={i}
              className={`terminal-line ${
                l.includes("timed out")
                  ? "err"
                  : l.includes("statistics")
                  ? "dim"
                  : ""
              }`}
            >
              {l}
            </div>
          ))}
          {running && (
            <div>
              <span>Transmitting packet...</span>
              <span className="terminal-cursor" />
            </div>
          )}
        </div>

        <div className="modal-actions">
          <Button
            type="button"
            variant="ghost"
            onClick={startPing}
            disabled={running}
            icon={<RotateCcw size={14} />}
          >
            {running ? "Pinging..." : "Re-run Test"}
          </Button>
          <Button type="button" onClick={close}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function Devices({ query = "" }) {
  const outletCtx = useOutletContext();
  const globalQuery = outletCtx?.query ?? query;
  const { id: paramDeviceId } = useParams();
  const navigate = useNavigate();

  const {
    devices,
    addDevice,
    updateDevice,
    deleteDevice,
    toggleDeviceStatus,
    rebootDevice,
    executePing,
  } = useData();

  const [q, setQ] = useState(globalQuery);
  const [activeFilter, setActiveFilter] = useState("All");
  const [edit, setEdit] = useState(null);
  const [pingTarget, setPingTarget] = useState(null);

  const [form, setForm] = useState({
    name: "",
    type: "Switch",
    location: "",
    ip: "",
    status: "Online",
    cpu: 20,
    uptime: "1d",
  });

  // Handle dynamic route parameter :id (e.g. /devices/SW-001 or /devices/AP-118)
  useEffect(() => {
    if (paramDeviceId && devices.length > 0) {
      const target = devices.find(
        (d) =>
          d.id.toLowerCase() === paramDeviceId.toLowerCase() ||
          d.name.toLowerCase() === paramDeviceId.toLowerCase()
      );
      if (target) {
        setPingTarget(target);
      }
    }
  }, [paramDeviceId, devices]);

  useEffect(() => {
    if (globalQuery !== undefined) {
      setQ(globalQuery);
    }
  }, [globalQuery]);

  // Filter chips logic
  const filteredList = devices.filter((d) => {
    const matchesSearch = Object.values(d)
      .join(" ")
      .toLowerCase()
      .includes(q.toLowerCase());

    if (!matchesSearch) return false;

    if (activeFilter === "All") return true;
    if (activeFilter === "Online") return d.status === "Online";
    if (activeFilter === "Offline") return d.status !== "Online";
    return d.type.toLowerCase() === activeFilter.toLowerCase();
  });

  const save = (e) => {
    e.preventDefault();
    if (edit?.new) {
      addDevice(form);
    } else if (edit) {
      updateDevice(edit.id, form);
    }
    setEdit(null);
  };

  const filterOptions = [
    { label: "All", count: devices.length },
    { label: "Online", count: devices.filter((d) => d.status === "Online").length },
    { label: "Offline", count: devices.filter((d) => d.status !== "Online").length },
    { label: "Switch", count: devices.filter((d) => d.type === "Switch").length },
    { label: "Router", count: devices.filter((d) => d.type === "Router").length },
    { label: "Access Point", count: devices.filter((d) => d.type === "Access Point").length },
    { label: "Server", count: devices.filter((d) => d.type === "Server").length },
  ];

  return (
    <Card>
      <Header
        title="Network Devices & Hardware"
        subtitle={`${devices.length} registered hardware nodes with real-time ping telemetry`}
        action={
          <div className="actions">
            <Button
              variant="ghost"
              icon={<Download size={15} />}
              onClick={() => exportCSV("netflow-devices.csv", filteredList)}
            >
              Export CSV
            </Button>
            <Button
              icon={<Plus size={15} />}
              onClick={() => {
                setForm({
                  name: "",
                  type: "Switch",
                  location: "",
                  ip: "10.10.",
                  status: "Online",
                  cpu: 20,
                  uptime: "1d",
                });
                setEdit({ new: true });
              }}
            >
              Add Device
            </Button>
          </div>
        }
      />

      {/* Filter Chips */}
      <div className="filter-pills">
        {filterOptions.map((opt) => (
          <button
            key={opt.label}
            className={`filter-pill ${activeFilter === opt.label ? "active" : ""}`}
            onClick={() => setActiveFilter(opt.label)}
          >
            {opt.label} ({opt.count})
          </button>
        ))}
      </div>

      <SearchBox
        value={q}
        onChange={setQ}
        placeholder="Search devices by name, IP, location, or type..."
      />

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Device</th>
              <th>Type</th>
              <th>Location</th>
              <th>IP Address</th>
              <th>CPU Load</th>
              <th>Status</th>
              <th>Interactive Operations</th>
            </tr>
          </thead>
          <tbody>
            {filteredList.map((d) => (
              <tr key={d.id}>
                <td>
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
                    <div>
                      <b>{d.name}</b>
                      <small>{d.id} • Uptime: {d.uptime}</small>
                    </div>
                  </div>
                </td>
                <td>{d.type}</td>
                <td>{d.location}</td>
                <td className="mono">{d.ip}</td>
                <td>
                  <div className="progress">
                    <i
                      style={{
                        width: `${d.cpu}%`,
                        backgroundColor:
                          d.cpu > 80
                            ? "var(--danger)"
                            : d.cpu > 60
                            ? "var(--warning)"
                            : "var(--primary)",
                      }}
                    />
                  </div>{" "}
                  {d.cpu}%
                </td>
                <td>
                  <Status value={d.status} />
                </td>
                <td>
                  <div className="device-actions">
                    {/* Live Ping Test Action */}
                    <button
                      className="btn-action"
                      onClick={() => {
                        setPingTarget(d);
                        navigate(`/devices/${d.id}`);
                      }}
                      title="Run Live ICMP Ping Diagnostic"
                    >
                      <Terminal size={13} /> Ping
                    </button>

                    {/* Quick Power Toggle */}
                    <button
                      className={`btn-action ${d.status === "Online" ? "danger" : "success"}`}
                      onClick={() => toggleDeviceStatus(d.id)}
                      title={d.status === "Online" ? "Turn Device Offline" : "Turn Device Online"}
                    >
                      <Power size={13} /> {d.status === "Online" ? "Stop" : "Start"}
                    </button>

                    {/* Reboot Action */}
                    <button
                      className="btn-action"
                      onClick={() => rebootDevice(d.id)}
                      disabled={d.status === "Rebooting"}
                      title="Simulate Device Reboot Cycle"
                    >
                      <RotateCcw size={13} />
                    </button>

                    {/* Edit */}
                    <button
                      className="icon-btn sm"
                      onClick={() => {
                        setEdit(d);
                        setForm(d);
                      }}
                      title="Edit Configuration"
                    >
                      <Pencil size={13} />
                    </button>

                    {/* Delete */}
                    <button
                      className="icon-btn sm"
                      onClick={() => {
                        if (confirm(`Remove ${d.name} from inventory?`)) {
                          deleteDevice(d.id);
                        }
                      }}
                      title="Delete Device"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit / Add Modal */}
      {edit && (
        <DeviceModal
          form={form}
          setForm={setForm}
          save={save}
          close={() => setEdit(null)}
          editing={!edit.new}
        />
      )}

      {/* Live ICMP Ping Modal */}
      {pingTarget && (
        <PingTerminalModal
          device={pingTarget}
          close={() => {
            setPingTarget(null);
            if (paramDeviceId) navigate("/devices");
          }}
          executePing={executePing}
        />
      )}
    </Card>
  );
}

export { Devices };
