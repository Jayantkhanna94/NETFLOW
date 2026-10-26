
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  RefreshCcw,
  Settings as SettingsIcon,
  Bell,
  Mail,
  ShieldCheck,
  Database,
  Save,
  LogOut,
} from "../components/Icons";
import { useAuth } from "../contexts/AuthContext";
import { Card, Header, Button } from "../components/UI";

function Setting({ icon: Icon, title, desc, value, onChange, disabled }) {
  return (
    <div className="setting">
      <div className="setting-icon">
        <Icon size={17} />
      </div>
      <div>
        <b>{title}</b>
        <small>{desc}</small>
      </div>
      <label className="switch">
        <input
          type="checkbox"
          checked={value}
          disabled={disabled}
          onChange={(e) => onChange?.(e.target.checked)}
        />
        <i />
      </label>
    </div>
  );
}

export default function Settings() {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const [saved, setSaved] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };
  const [s, sets] = useState(() => {
    try {
      const stored = localStorage.getItem("netflow_settings");
      return stored
        ? JSON.parse(stored)
        : {
            alerts: true,
            email: true,
            refresh: true,
            compact: false,
            interval: "30",
          };
    } catch {
      return {
        alerts: true,
        email: true,
        refresh: true,
        compact: false,
        interval: "30",
      };
    }
  });

  const set = (k, v) => {
    sets((prev) => ({ ...prev, [k]: v }));
    setSaved(false);
  };

  const handleSave = () => {
    localStorage.setItem("netflow_settings", JSON.stringify(s));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="settings-grid">
      <Card>
        <Header
          title="General Settings"
          subtitle="Configure dashboard behavior"
        />
        <Setting
          icon={RefreshCcw}
          title="Auto refresh"
          desc="Refresh device status automatically."
          value={s.refresh}
          onChange={(v) => set("refresh", v)}
        />
        <Setting
          icon={SettingsIcon}
          title="Compact interface"
          desc="Reduce spacing across tables and cards."
          value={s.compact}
          onChange={(v) => set("compact", v)}
        />
        <div className="setting-inline">
          <div>
            <b>Refresh interval</b>
            <small>Seconds between refreshes</small>
          </div>
          <select
            value={s.interval}
            onChange={(e) => set("interval", e.target.value)}
          >
            <option value="10">10s</option>
            <option value="30">30s</option>
            <option value="60">60s</option>
          </select>
        </div>
      </Card>

      <Card>
        <Header
          title="Notifications"
          subtitle="Choose how NetFlow alerts you"
        />
        <Setting
          icon={Bell}
          title="Dashboard alerts"
          desc="Show incident notifications."
          value={s.alerts}
          onChange={(v) => set("alerts", v)}
        />
        <Setting
          icon={Mail}
          title="Email notifications"
          desc="Send incident summaries to administrators."
          value={s.email}
          onChange={(v) => set("email", v)}
        />
      </Card>

      <Card>
        <Header title="Security" subtitle="System security preferences" />
        <Setting
          icon={ShieldCheck}
          title="Secure session"
          desc="Authentication is required for the dashboard."
          value={true}
          disabled
        />
        <Setting
          icon={Database}
          title="Demo local storage"
          desc="Prototype data is stored in browser localStorage."
          value={true}
          disabled
        />
      </Card>

      {/* Account Session & Sign Out Card */}
      <Card>
        <Header
          title="Active Session & Account"
          subtitle="Signed in as active platform user"
        />
        <div className="security-box" style={{ borderBottom: 0 }}>
          <LogOut size={20} color="var(--danger)" />
          <div>
            <b>{currentUser?.name || "System User"}</b>
            <small>{currentUser?.email || "No email"} • Role: {currentUser?.role || "Student"}</small>
          </div>
          <Button
            variant="ghost"
            onClick={handleLogout}
            style={{
              color: "var(--danger)",
              borderColor: "rgba(255, 92, 101, 0.3)",
              background: "rgba(255, 92, 101, 0.06)",
            }}
          >
            Logout
          </Button>
        </div>
      </Card>

      <div className="settings-save">
        <Button
          icon={<Save size={15} />}
          onClick={handleSave}
        >
          {saved ? "Saved" : "Save Settings"}
        </Button>
      </div>
    </div>
  );
}
export { Settings, Settings as SettingsPage };
