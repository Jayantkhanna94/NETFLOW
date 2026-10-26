import React, { createContext, useContext, useState, useEffect } from "react";
import { getData, saveData, newId } from "../services/storage";

const DataContext = createContext(null);

export function DataProvider({ children }) {
  // Devices state
  const [devices, setDevices] = useState(() => getData("devices"));

  // Incidents state
  const [incidents, setIncidents] = useState(() => getData("incidents"));

  // Notifications state
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem("netflow_notifications");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return [
      {
        id: "notif-1",
        title: "Lab AP (AP-118) disconnected",
        type: "danger",
        time: "10m ago",
        read: false,
      },
      {
        id: "notif-2",
        title: "High CPU threshold on ERP Server (67%)",
        type: "warning",
        time: "38m ago",
        read: false,
      },
      {
        id: "notif-3",
        title: "Gateway Router firmware verified",
        type: "success",
        time: "2h ago",
        read: true,
      },
      {
        id: "notif-4",
        title: "Core Switch link aggregation active",
        type: "info",
        time: "4h ago",
        read: true,
      },
    ];
  });

  // Activity logs state
  const [activityLogs, setActivityLogs] = useState(() => {
    const saved = localStorage.getItem("netflow_activity_logs");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return [
      {
        id: "log-1",
        text: "Core Switch ping telemetry stable at 14ms",
        time: "Just now",
        type: "success",
      },
      {
        id: "log-2",
        text: "Global throughput peaked at 0.91 Gbps",
        time: "1m ago",
        type: "info",
      },
      {
        id: "log-3",
        text: "ERP Server backup synchronisation completed",
        time: "8m ago",
        type: "success",
      },
      {
        id: "log-4",
        text: "Lab AP packet loss detected (100% outage)",
        time: "10m ago",
        type: "danger",
      },
    ];
  });

  // Live telemetry metrics
  const [liveMetrics, setLiveMetrics] = useState({
    bandwidth: "0.88 Gbps",
    bandwidthVal: 88,
    latency: 24,
    packetLoss: "0.08%",
    interfacesUp: 324,
    totalInterfaces: 376,
  });

  // Rolling real-time traffic history
  const [liveTraffic, setLiveTraffic] = useState(() => {
    const now = new Date();
    const points = [];
    for (let i = 7; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 15000);
      points.push({
        t: d.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
        v: Math.floor(65 + Math.random() * 25),
      });
    }
    return points;
  });

  // Persist notifications & logs
  useEffect(() => {
    localStorage.setItem(
      "netflow_notifications",
      JSON.stringify(notifications)
    );
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem("netflow_activity_logs", JSON.stringify(activityLogs));
  }, [activityLogs]);

  // Real-time telemetry simulation interval (every 3.5 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      // 1. Advance traffic history
      const timeStr = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      const newThroughput = Math.floor(68 + Math.random() * 26);

      setLiveTraffic((prev) => {
        const next = [...prev.slice(1), { t: timeStr, v: newThroughput }];
        return next;
      });

      // 2. Fluctuate global metrics
      setLiveMetrics((prev) => ({
        bandwidth: `${(0.82 + Math.random() * 0.12).toFixed(2)} Gbps`,
        bandwidthVal: newThroughput,
        latency: Math.max(
          16,
          Math.min(36, Math.round(24 + (Math.random() * 6 - 3)))
        ),
        packetLoss: `${(0.05 + Math.random() * 0.05).toFixed(2)}%`,
        interfacesUp: prev.interfacesUp,
        totalInterfaces: prev.totalInterfaces,
      }));

      // 3. Fluctuate online devices CPU slightly
      setDevices((prevDevices) => {
        return prevDevices.map((d) => {
          if (d.status === "Online") {
            const jitter = Math.floor((Math.random() - 0.5) * 6);
            const nextCpu = Math.max(8, Math.min(96, (d.cpu || 30) + jitter));
            return { ...d, cpu: nextCpu };
          }
          return d;
        });
      });
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  // Sync devices with localStorage
  const persistDevices = (newDevs) => {
    setDevices(newDevs);
    saveData("devices", newDevs);
  };

  // Sync incidents with localStorage
  const persistIncidents = (newIncs) => {
    setIncidents(newIncs);
    saveData("incidents", newIncs);
  };

  const addLog = (text, type = "info") => {
    const log = {
      id: newId("LOG"),
      text,
      time: "Just now",
      type,
    };
    setActivityLogs((prev) => [log, ...prev.slice(0, 19)]);
  };

  const addNotification = (title, type = "info") => {
    const notif = {
      id: newId("NOTIF"),
      title,
      type,
      time: "Just now",
      read: false,
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  // Device CRUD
  const addDevice = (dev) => {
    const created = {
      ...dev,
      id: dev.id || newId("DEV"),
      cpu: Number(dev.cpu) || 20,
      uptime: dev.uptime || "1d 00h",
    };
    const next = [...devices, created];
    persistDevices(next);
    addLog(`Device added: ${created.name} (${created.ip})`, "success");
    addNotification(`New device registered: ${created.name}`, "info");
    return created;
  };

  const updateDevice = (id, form) => {
    const next = devices.map((d) => (d.id === id ? { ...d, ...form } : d));
    persistDevices(next);
    addLog(`Device configuration updated: ${form.name || id}`, "info");
  };

  const deleteDevice = (id) => {
    const target = devices.find((d) => d.id === id);
    const next = devices.filter((d) => d.id !== id);
    persistDevices(next);
    addLog(`Device deleted: ${target?.name || id}`, "warning");
    addNotification(
      `Device ${target?.name || id} removed from registry`,
      "warning"
    );
  };

  // Instant Power toggle Online <-> Offline
  const toggleDeviceStatus = (id) => {
    const target = devices.find((d) => d.id === id);
    if (!target) return;

    const isGoingOffline = target.status === "Online";
    const nextStatus = isGoingOffline ? "Offline" : "Online";
    const nextCpu = isGoingOffline ? 0 : 25;

    const next = devices.map((d) =>
      d.id === id ? { ...d, status: nextStatus, cpu: nextCpu } : d
    );
    persistDevices(next);

    if (isGoingOffline) {
      addLog(`ALERT: ${target.name} (${target.ip}) went Offline!`, "danger");
      addNotification(`ALERT: ${target.name} is Offline!`, "danger");

      // Auto-raise high priority incident
      const newInc = {
        id: newId("INC"),
        title: `${target.name} connection dropped`,
        severity: "High",
        status: "Open",
        device: target.name,
        time: "Just now",
      };
      persistIncidents([newInc, ...incidents]);
    } else {
      addLog(`${target.name} (${target.ip}) restored to Online.`, "success");
      addNotification(`${target.name} restored to Online.`, "success");

      // Resolve matching open incidents
      const updatedIncs = incidents.map((inc) =>
        inc.device === target.name || inc.device === target.id
          ? { ...inc, status: "Resolved" }
          : inc
      );
      persistIncidents(updatedIncs);
    }
  };

  // Reboot Device Simulation
  const rebootDevice = (id) => {
    const target = devices.find((d) => d.id === id);
    if (!target) return;

    // 1. Set to Rebooting
    const rebootingList = devices.map((d) =>
      d.id === id ? { ...d, status: "Rebooting", cpu: 5 } : d
    );
    persistDevices(rebootingList);
    addLog(`Rebooting ${target.name}...`, "warning");
    addNotification(`Reboot initiated for ${target.name}`, "warning");

    // 2. Restore after 3 seconds
    setTimeout(() => {
      setDevices((curDevs) => {
        const restored = curDevs.map((d) =>
          d.id === id
            ? { ...d, status: "Online", cpu: 32, uptime: "0d 00h 01m" }
            : d
        );
        saveData("devices", restored);
        return restored;
      });
      addLog(`${target.name} reboot completed. System operational.`, "success");
      addNotification(
        `${target.name} reboot completed successfully.`,
        "success"
      );
    }, 3000);
  };

  // Simulated live ICMP ping test
  const executePing = async (ip, onPacket) => {
    const dev = devices.find((d) => d.ip === ip || d.name === ip);
    const isOffline = dev?.status === "Offline";

    const packets = [];
    for (let seq = 1; seq <= 4; seq++) {
      await new Promise((res) => setTimeout(res, 450));
      if (isOffline) {
        const line = `Request timed out. (seq=${seq})`;
        packets.push({ seq, success: false, text: line });
        onPacket?.(line);
      } else {
        const ms = Math.floor(10 + Math.random() * 18);
        const ttl = 64;
        const line = `Reply from ${ip}: bytes=32 time=${ms}ms TTL=${ttl}`;
        packets.push({ seq, success: true, ms, ttl, text: line });
        onPacket?.(line);
      }
    }

    const lost = packets.filter((p) => !p.success).length;
    const lossRate = (lost / 4) * 100;
    const summary = `Ping statistics for ${ip}: Packets: Sent = 4, Received = ${
      4 - lost
    }, Lost = ${lost} (${lossRate}% loss)`;
    onPacket?.(summary);
    return { packets, lossRate };
  };

  // Incident Actions
  const resolveIncident = (id) => {
    const next = incidents.map((i) =>
      i.id === id ? { ...i, status: "Resolved" } : i
    );
    persistIncidents(next);
    addLog(`Incident ${id} marked as Resolved.`, "success");
    addNotification(`Incident ${id} has been resolved.`, "info");
  };

  const addIncident = (inc) => {
    const newInc = {
      ...inc,
      id: newId("INC"),
      time: "Just now",
      status: inc.status || "Open",
    };
    persistIncidents([newInc, ...incidents]);
    addLog(`New incident reported: ${newInc.title}`, "danger");
    addNotification(`New incident: ${newInc.title}`, "danger");
  };

  // Notification actions
  const markNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <DataContext.Provider
      value={{
        devices,
        incidents,
        notifications,
        unreadCount,
        activityLogs,
        liveTraffic,
        liveMetrics,
        addDevice,
        updateDevice,
        deleteDevice,
        toggleDeviceStatus,
        rebootDevice,
        executePing,
        resolveIncident,
        addIncident,
        markNotificationsRead,
        clearNotifications,
        addLog,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};
