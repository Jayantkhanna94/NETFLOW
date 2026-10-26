import React from "react";
import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { AuthProvider, useAuth } from "../contexts/AuthContext";

describe("AuthContext State Architecture & Persistence", () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;

  it("authenticates demo user with correct credentials and persists to session", () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.loggedIn).toBe(false);
    expect(result.current.currentUser).toBeNull();

    act(() => {
      const res = result.current.login("admin@netflow.com", "admin123", true);
      expect(res.success).toBe(true);
    });

    expect(result.current.loggedIn).toBe(true);
    expect(result.current.currentUser?.name).toBe("System Administrator");
    expect(result.current.currentUser?.role).toBe("Administrator");

    expect(localStorage.getItem("netflowRemember")).toBe("true");
    expect(sessionStorage.getItem("netflowLoggedIn")).toBe("true");
  });

  it("rejects invalid login credentials with an error message", () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    act(() => {
      const res = result.current.login("unknown@college.edu", "short");
      expect(res.success).toBe(false);
      expect(res.error).toBeDefined();
    });

    expect(result.current.loggedIn).toBe(false);
  });

  it("registers a new user with signup and enables login", () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    act(() => {
      const res = result.current.signup({
        name: "Test Scholar",
        email: "scholar@college.edu",
        role: "Student",
        password: "securepassword123",
      });
      expect(res.success).toBe(true);
      expect(res.user?.name).toBe("Test Scholar");
    });

    // Now test login with new user
    act(() => {
      const loginRes = result.current.login("scholar@college.edu", "securepassword123");
      expect(loginRes.success).toBe(true);
    });

    expect(result.current.loggedIn).toBe(true);
    expect(result.current.currentUser?.name).toBe("Test Scholar");
  });

  it("clears session and credentials on logout", () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    act(() => {
      result.current.login("admin@netflow.com", "admin123");
    });
    expect(result.current.loggedIn).toBe(true);

    act(() => {
      result.current.logout();
    });

    expect(result.current.loggedIn).toBe(false);
    expect(result.current.currentUser).toBeNull();
    expect(sessionStorage.getItem("netflowLoggedIn")).toBeNull();
  });
});
