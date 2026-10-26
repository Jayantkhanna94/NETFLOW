import React from "react";
import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act, render, screen, fireEvent, waitFor } from "@testing-library/react";
import { DataProvider, useData } from "../contexts/DataContext";
import { useCartStore } from "../store/useCartStore";
import Reports from "../pages/Reports";

describe("Asynchronous Operations, Loading States, Error Handling, and Retry", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("handles async network ICMP ping execution with packet streams and retry", async () => {
    const wrapper = ({ children }) => <DataProvider>{children}</DataProvider>;
    const { result } = renderHook(() => useData(), { wrapper });

    const receivedLines = [];
    let pingStats;

    await act(async () => {
      pingStats = await result.current.executePing("10.10.0.1", (line) => {
        receivedLines.push(line);
      });
    });

    expect(receivedLines.length).toBeGreaterThan(0);
    expect(pingStats.packets.length).toBe(4);
    expect(receivedLines.some((l) => l.includes("statistics"))).toBe(true);
  });

  it("manages async checkout loading, error state, and retry in Zustand store", async () => {
    // 1. Checkout with empty cart should fail asynchronously
    let errorResult;
    await act(async () => {
      errorResult = await useCartStore.getState().checkout({});
    });

    expect(errorResult.success).toBe(false);
    expect(useCartStore.getState().checkoutStatus).toBe("error");
    expect(useCartStore.getState().checkoutError).toBe("Cannot checkout with an empty reservation cart.");

    // 2. Retry with items in cart should succeed
    act(() => {
      useCartStore.getState().addItem({
        id: "LAB-03",
        name: "Embedded Systems Lab",
      });
    });

    let successResult;
    await act(async () => {
      successResult = await useCartStore.getState().checkout({
        applicantName: "Aman Gupta",
      });
    });

    expect(successResult.success).toBe(true);
    expect(useCartStore.getState().checkoutStatus).toBe("success");
    expect(useCartStore.getState().receipt).toBeDefined();
  });

  it("displays loading state and updates UI asynchronously on report generation", async () => {
    render(<Reports />);

    const generateBtn = screen.getByText("Generate Report");
    expect(generateBtn).toBeInTheDocument();

    fireEvent.click(generateBtn);

    // Should indicate asynchronous compiling state
    expect(screen.getByText("Compiling Report...")).toBeInTheDocument();

    // After async resolution
    await waitFor(
      () => {
        expect(screen.getByText("Generate Report")).toBeInTheDocument();
      },
      { timeout: 2500 }
    );

    expect(screen.getByText(/Audit report compiled and added to repository/i)).toBeInTheDocument();
  });
});
