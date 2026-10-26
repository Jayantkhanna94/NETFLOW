import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate, Outlet } from "react-router-dom";
import {
  Menu,
  Search,
  Sun,
  Moon,
  Bell,
  AlertTriangle,
  CheckCircle2,
  Info,
  XCircle,
  X,
  LogOut,
  UserCircle,
  Settings as SettingsIcon,
} from "./Icons";
import Sidebar, { navItems } from "./Sidebar";
import { useAuth } from "../contexts/AuthContext";
import { useData } from "../contexts/DataContext";

export default function Layout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const {
    notifications,
    unreadCount,
    markNotificationsRead,
    clearNotifications,
  } = useData();

  const [collapsed, setCollapsed] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [dark, setDark] = useState(
    () => localStorage.getItem("netflowTheme") !== "light"
  );
  const [q, setQ] = useState("");
  const [showNotifs, setShowNotifs] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const notifRef = useRef(null);
  const userMenuRef = useRef(null);

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? "dark" : "light";
    localStorage.setItem("netflowTheme", dark ? "dark" : "light");
  }, [dark]);

  // Click outside to close notification & user dropdowns
  useEffect(() => {
    function handleClickOutside(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifs(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const currentNav =
    navItems.find(
      (item) => item.path !== "/" && location.pathname.startsWith(item.path)
    ) || navItems[0];

  const title =
    location.pathname === "/profile"
      ? "Profile"
      : currentNav
      ? currentNav.label
      : "Dashboard";

  const getInitials = (name) => {
    if (!name) return "SA";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  const getNotifIcon = (type) => {
    switch (type) {
      case "danger":
        return <XCircle size={15} color="var(--danger)" />;
      case "warning":
        return <AlertTriangle size={15} color="var(--warning)" />;
      case "success":
        return <CheckCircle2 size={15} color="var(--success)" />;
      default:
        return <Info size={15} color="var(--primary)" />;
    }
  };

  return (
    <div className={`app ${collapsed ? "collapsed" : ""}`}>
      <Sidebar mobile={mobile} setMobile={setMobile} />

      {mobile && (
        <div className="backdrop" onClick={() => setMobile(false)} />
      )}

      <main className="main">
        <header className="topbar">
          <button
            className="icon-btn menu"
            onClick={() =>
              window.innerWidth < 900
                ? setMobile(!mobile)
                : setCollapsed(!collapsed)
            }
            aria-label="Toggle Navigation"
          >
            <Menu />
          </button>

          <div className="global-search">
            <Search size={18} />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search Devices, IP, incidents, resources..."
            />
            {q && (
              <button
                style={{ background: "none", border: 0, color: "var(--muted)", cursor: "pointer" }}
                onClick={() => setQ("")}
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="top-actions">
            <button
              className="icon-btn theme"
              onClick={() => setDark(!dark)}
              aria-label="Toggle Theme"
            >
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Notification Bell with interactive dropdown */}
            <div className="notif-wrapper" ref={notifRef}>
              <button
                className="icon-btn notif"
                onClick={() => {
                  setShowNotifs((prev) => !prev);
                  if (!showNotifs && unreadCount > 0) {
                    markNotificationsRead();
                  }
                }}
                aria-label="Notifications"
              >
                <Bell size={18} />
                {unreadCount > 0 && <b>{unreadCount}</b>}
              </button>

              {showNotifs && (
                <div className="notif-dropdown">
                  <div className="notif-dropdown-head">
                    <span>Notifications ({notifications.length})</span>
                    <div style={{ display: "flex", gap: "10px" }}>
                      {unreadCount > 0 && (
                        <button onClick={markNotificationsRead}>Mark all read</button>
                      )}
                      {notifications.length > 0 && (
                        <button onClick={clearNotifications} style={{ color: "var(--muted)" }}>
                          Clear
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="notif-list">
                    {notifications.length === 0 ? (
                      <div className="notif-empty">No new notifications</div>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          className={`notif-item ${!n.read ? "unread" : ""}`}
                          onClick={() => {
                            if (n.title.toLowerCase().includes("incident")) {
                              navigate("/incidents");
                            } else if (n.title.toLowerCase().includes("device") || n.title.includes("(")) {
                              const match = n.title.match(/\(([^)]+)\)/);
                              if (match && match[1]) {
                                navigate(`/devices/${match[1]}`);
                              } else {
                                navigate("/devices");
                              }
                            }
                            setShowNotifs(false);
                          }}
                        >
                          <div style={{ marginTop: "2px" }}>{getNotifIcon(n.type)}</div>
                          <div style={{ flex: 1 }}>
                            <b>{n.title}</b>
                            <small>{n.time}</small>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <button
              className="icon-btn logout-btn"
              onClick={handleLogout}
              title="Sign Out / Logout"
              aria-label="Logout"
              style={{
                color: "var(--danger)",
                borderColor: "rgba(255, 92, 101, 0.3)",
                background: "rgba(255, 92, 101, 0.08)",
              }}
            >
              <LogOut size={17} />
            </button>

            <div className="user-menu-wrapper" ref={userMenuRef} style={{ position: "relative" }}>
              <button
                className="avatar"
                onClick={() => setShowUserMenu(!showUserMenu)}
                title={`${currentUser?.name || "User"} (${currentUser?.role || "Student"}) - Click for menu`}
              >
                {getInitials(currentUser?.name)}
              </button>

              {showUserMenu && (
                <div className="user-dropdown">
                  <div className="user-dropdown-head">
                    <div className="table-avatar" style={{ width: "38px", height: "38px", fontSize: "12px" }}>
                      {getInitials(currentUser?.name)}
                    </div>
                    <div style={{ overflow: "hidden" }}>
                      <b style={{ display: "block", fontSize: "13px", whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden" }}>
                        {currentUser?.name || "System User"}
                      </b>
                      <small style={{ color: "var(--muted)", fontSize: "10px", display: "block", whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden" }}>
                        {currentUser?.email || "No email"}
                      </small>
                    </div>
                  </div>
                  <div style={{ padding: "8px 16px 6px" }}>
                    <span className="role">{currentUser?.role || "Student"}</span>
                  </div>
                  <div className="user-dropdown-divider" />
                  <button
                    className="user-dropdown-item"
                    onClick={() => {
                      setShowUserMenu(false);
                      navigate("/profile");
                    }}
                  >
                    <UserCircle size={16} />
                    <span>My Profile</span>
                  </button>
                  <button
                    className="user-dropdown-item"
                    onClick={() => {
                      setShowUserMenu(false);
                      navigate("/settings");
                    }}
                  >
                    <SettingsIcon size={16} />
                    <span>Settings</span>
                  </button>
                  <div className="user-dropdown-divider" />
                  <button
                    className="user-dropdown-item danger"
                    onClick={() => {
                      setShowUserMenu(false);
                      handleLogout();
                    }}
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="content">
          <div className="page-heading">
            <div>
              <small>NETFLOW / {title.toUpperCase()}</small>
              <h1>{title}</h1>
            </div>
            {location.pathname === "/" && (
              <span className="live">
                <i /> Live monitoring
              </span>
            )}
          </div>

          {children || <Outlet context={{ query: q, searchQuery: q }} />}
        </div>
      </main>
    </div>
  );
}

export { Layout };
