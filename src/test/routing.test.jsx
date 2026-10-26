import React from "react";
import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import { AuthProvider } from "../contexts/AuthContext";
import { DataProvider } from "../contexts/DataContext";
import Layout from "../components/Layout";
import Devices from "../pages/Devices";

describe("React Router Navigation, Protected Routes, and Dynamic Parameters", () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it("redirects unauthenticated users from protected routes to /login", () => {
    render(
      <AuthProvider>
        <MemoryRouter initialEntries={["/"]}>
          <Routes>
            <Route path="/login" element={<div>Login Page Mock</div>} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <div>Protected Dashboard Shell</div>
                </ProtectedRoute>
              }
            />
          </Routes>
        </MemoryRouter>
      </AuthProvider>
    );

    expect(screen.getByText("Login Page Mock")).toBeInTheDocument();
    expect(screen.queryByText("Protected Dashboard Shell")).not.toBeInTheDocument();
  });

  it("renders protected shell when authenticated in sessionStorage", () => {
    sessionStorage.setItem("netflowLoggedIn", "true");
    sessionStorage.setItem(
      "netflowCurrentUser",
      JSON.stringify({ name: "Admin Test", email: "admin@test.com", role: "Administrator" })
    );

    render(
      <AuthProvider>
        <DataProvider>
          <MemoryRouter initialEntries={["/"]}>
            <Routes>
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <div>Welcome to NetFlow Protected Area</div>
                    </Layout>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </MemoryRouter>
        </DataProvider>
      </AuthProvider>
    );

    expect(screen.getByText("Welcome to NetFlow Protected Area")).toBeInTheDocument();
    expect(screen.getByText("NetFlow")).toBeInTheDocument();
  });

  it("handles dynamic route parameters correctly on /devices/:id", () => {
    sessionStorage.setItem("netflowLoggedIn", "true");
    sessionStorage.setItem(
      "netflowCurrentUser",
      JSON.stringify({ name: "Admin Test", email: "admin@test.com", role: "Administrator" })
    );

    // Initial seed device SW-001
    const testDevices = [
      { id: "SW-001", name: "Core Switch", type: "Switch", location: "Server Room", ip: "10.10.0.1", status: "Online", cpu: 42, uptime: "1d" },
    ];
    localStorage.setItem("netflow_devices", JSON.stringify(testDevices));

    render(
      <AuthProvider>
        <DataProvider>
          <MemoryRouter initialEntries={["/devices/SW-001"]}>
            <Routes>
              <Route path="devices" element={<Devices />} />
              <Route path="devices/:id" element={<Devices />} />
            </Routes>
          </MemoryRouter>
        </DataProvider>
      </AuthProvider>
    );

    // Should detect the dynamic parameter SW-001 and open or highlight the ping terminal modal
    expect(screen.getByText(/ICMP Ping Diagnostic/i)).toBeInTheDocument();
    expect(screen.getByText(/Target: 10.10.0.1/i)).toBeInTheDocument();
  });
});
