import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { DataProvider } from "./contexts/DataContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";

// Authentication Pages
import Login from "./pages/Login";
import Signup from "./pages/Signup";

// Core Dashboard Pages matching Sidebar tree
import Dashboard from "./pages/Dashboard";
import Devices from "./pages/Devices";
import NetworkMonitoring from "./pages/NetworkMonitoring";
import Resources from "./pages/Resources";
import Bookings from "./pages/Bookings";
import Incidents from "./pages/Incidents";
import Reports from "./pages/Reports";
import Users from "./pages/Users";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <Routes>
          {/* Public Authentication Pages */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Application Shell & Pages */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="devices" element={<Devices />} />
            <Route path="devices/:id" element={<Devices />} />
            <Route path="network" element={<NetworkMonitoring />} />
            <Route path="resources" element={<Resources />} />
            <Route path="bookings" element={<Bookings />} />
            <Route path="incidents" element={<Incidents />} />
            <Route path="reports" element={<Reports />} />
            <Route path="users" element={<Users />} />
            <Route path="settings" element={<Settings />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          {/* Fallback Catch-all Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </DataProvider>
    </AuthProvider>
  );
}

// Re-exports for backward compatibility
export {
  Login,
  Signup,
  Dashboard,
  Devices,
  NetworkMonitoring as Network,
  Resources,
  Bookings,
  Incidents,
  Reports,
  Users as UsersPage,
  Settings as SettingsPage,
  Profile,
  Layout as Shell,
};
