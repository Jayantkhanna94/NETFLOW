import React, { useState, useEffect, useRef } from "react";
import { useOutletContext } from "react-router-dom";
import { Plus, TriangleAlert, X, CheckCircle2 } from "../components/Icons";
import { useData } from "../contexts/DataContext";
import { Card, Header, Button, SearchBox, Status, FormField, Input, Select } from "../components/UI";
import { validateRequired } from "../services/validation";

export default function Incidents({ query = "" }) {
  const outletCtx = useOutletContext();
  const globalQuery = outletCtx?.query ?? query;

  const { incidents, resolveIncident, addIncident } = useData();

  const [q, setQ] = useState(globalQuery);
  const [add, setAdd] = useState(false);
  const [filter, setFilter] = useState("All");
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const titleInputRef = useRef(null);

  const [f, setF] = useState({
    title: "",
    severity: "Medium",
    status: "Open",
    device: "",
  });

  // Sync global search from topbar
  useEffect(() => {
    if (globalQuery !== undefined) {
      setQ(globalQuery);
    }
  }, [globalQuery]);

  // Focus first input on modal open (DOM manipulation via ref)
  useEffect(() => {
    if (add) {
      setTimeout(() => titleInputRef.current?.focus(), 100);
    }
  }, [add]);

  const list = incidents.filter((i) => {
    const matchesSearch = Object.values(i)
      .join(" ")
      .toLowerCase()
      .includes(q.toLowerCase());

    if (!matchesSearch) return false;
    if (filter === "All") return true;
    if (filter === "Open") return i.status !== "Resolved";
    if (filter === "Resolved") return i.status === "Resolved";
    return i.severity.toLowerCase() === filter.toLowerCase();
  });

  const validate = () => {
    const errs = {};
    const titleErr = validateRequired(f.title, "Incident Title");
    if (titleErr) errs.title = titleErr;
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validate();
  };

  function submit(e) {
    e.preventDefault();
    setTouched({ title: true });
    if (!validate()) return;

    addIncident({
      title: f.title,
      severity: f.severity,
      status: "Open",
      device: f.device || "General Network",
    });
    setAdd(false);
    setF({
      title: "",
      severity: "Medium",
      status: "Open",
      device: "",
    });
    setErrors({});
    setTouched({});
  }

  const filterOptions = [
    { label: "All", count: incidents.length },
    { label: "Open", count: incidents.filter((i) => i.status !== "Resolved").length },
    { label: "Resolved", count: incidents.filter((i) => i.status === "Resolved").length },
    { label: "High", count: incidents.filter((i) => i.severity === "High").length },
    { label: "Medium", count: incidents.filter((i) => i.severity === "Medium").length },
    { label: "Low", count: incidents.filter((i) => i.severity === "Low").length },
  ];

  return (
    <Card>
      <Header
        title="Incident & Alert Management"
        subtitle={`${incidents.length} logged incidents • Auto-correlated with device status telemetry`}
        action={
          <Button icon={<Plus size={15} />} onClick={() => setAdd(true)}>
            Report Incident
          </Button>
        }
      />

      <div className="filter-pills">
        {filterOptions.map((opt) => (
          <button
            key={opt.label}
            className={`filter-pill ${filter === opt.label ? "active" : ""}`}
            onClick={() => setFilter(opt.label)}
          >
            {opt.label} ({opt.count})
          </button>
        ))}
      </div>

      <SearchBox value={q} onChange={setQ} placeholder="Search incidents, devices..." />

      <div className="incident-list">
        {list.length === 0 ? (
          <div style={{ textAlign: "center", padding: "30px", color: "var(--muted)" }}>
            No incidents found matching current filter.
          </div>
        ) : (
          list.map((i) => (
            <div className="incident" key={i.id}>
              <div className={`incident-icon ${i.severity.toLowerCase()}`}>
                <TriangleAlert size={19} />
              </div>
              <div className="incident-main">
                <b>{i.title}</b>
                <small>
                  {i.id} • Target: {i.device} • {i.time}
                </small>
              </div>
              <strong className={`severity ${i.severity.toLowerCase()}`}>
                {i.severity}
              </strong>
              <Status value={i.status} />
              {i.status !== "Resolved" ? (
                <Button variant="ghost" onClick={() => resolveIncident(i.id)}>
                  Resolve
                </Button>
              ) : (
                <span style={{ color: "var(--success)", fontSize: "11px", display: "flex", alignItems: "center", gap: "4px" }}>
                  <CheckCircle2 size={14} /> Closed
                </span>
              )}
            </div>
          ))
        )}
      </div>

      {add && (
        <div className="modal-bg" role="dialog" aria-modal="true">
          <form className="modal" onSubmit={submit}>
            <div className="modal-head">
              <h2>Report Incident</h2>
              <button
                type="button"
                className="icon-btn"
                onClick={() => setAdd(false)}
                aria-label="Close report incident modal"
              >
                <X size={17} />
              </button>
            </div>

            <Input
              inputRef={titleInputRef}
              id="inc-title"
              label="Incident Title"
              required
              value={f.title}
              onChange={(val) => setF({ ...f, title: String(val) })}
              onBlur={() => handleBlur("title")}
              error={errors.title}
              touched={touched.title}
              placeholder="e.g. Core Switch link flapping"
            />

            <div className="two-col">
              <Select
                id="inc-severity"
                label="Severity"
                value={f.severity}
                onChange={(e) => setF({ ...f, severity: e.target.value })}
                options={["Low", "Medium", "High", "Critical"]}
              />

              <Input
                id="inc-device"
                label="Affected Device"
                value={f.device}
                onChange={(val) => setF({ ...f, device: String(val) })}
                placeholder="e.g. AP-118 or SW-001"
              />
            </div>

            <div className="modal-actions">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setAdd(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Log Incident</Button>
            </div>
          </form>
        </div>
      )}
    </Card>
  );
}

export { Incidents };
