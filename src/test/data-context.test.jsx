import React from "react";
import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { DataProvider, useData } from "../contexts/DataContext";

describe("DataContext Telemetry, Device CRUD, and Incident State", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  const wrapper = ({ children }) => <DataProvider>{children}</DataProvider>;

  it("loads seed devices and allows adding a new device", () => {
    const { result } = renderHook(() => useData(), { wrapper });

    const initialCount = result.current.devices.length;
    expect(initialCount).toBeGreaterThan(0);

    let created;
    act(() => {
      created = result.current.addDevice({
        name: "Test Aggregation Switch",
        type: "Switch",
        location: "Block D",
        ip: "10.10.9.1",
        status: "Online",
      });
    });

    expect(result.current.devices.length).toBe(initialCount + 1);
    expect(created.name).toBe("Test Aggregation Switch");
  });

  it("toggles device status between Online and Offline and auto-creates incident", () => {
    const { result } = renderHook(() => useData(), { wrapper });

    const initialIncidentsCount = result.current.incidents.length;
    const testDev = result.current.devices[0];

    act(() => {
      result.current.toggleDeviceStatus(testDev.id);
    });

    const updatedDev = result.current.devices.find((d) => d.id === testDev.id);
    expect(updatedDev.status).toBe(testDev.status === "Online" ? "Offline" : "Online");

    if (testDev.status === "Online") {
      // Auto-raised an incident for connection drop
      expect(result.current.incidents.length).toBe(initialIncidentsCount + 1);
    }
  });

  it("resolves an incident ticket and updates status", () => {
    const { result } = renderHook(() => useData(), { wrapper });

    const openIncident = result.current.incidents.find((i) => i.status !== "Resolved");
    expect(openIncident).toBeDefined();

    act(() => {
      result.current.resolveIncident(openIncident.id);
    });

    const resolved = result.current.incidents.find((i) => i.id === openIncident.id);
    expect(resolved.status).toBe("Resolved");
  });

  it("tracks unread notifications and marks them as read", () => {
    const { result } = renderHook(() => useData(), { wrapper });

    expect(result.current.unreadCount).toBeGreaterThanOrEqual(0);

    act(() => {
      result.current.markNotificationsRead();
    });

    expect(result.current.unreadCount).toBe(0);
  });
});
