import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useAsync } from "../hooks/useAsync";

describe("Async State & Loading / Error Handling (useAsync hook)", () => {
  it("initializes with idle status", () => {
    const asyncFn = vi.fn();
    const { result } = renderHook(() => useAsync(asyncFn));

    expect(result.current.status).toBe("idle");
    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it("handles successful asynchronous data flow", async () => {
    const mockData = { id: "REP-001", title: "Network Audit" };
    const asyncFn = vi.fn().mockResolvedValue(mockData);

    const { result } = renderHook(() => useAsync(asyncFn));

    let promise;
    act(() => {
      promise = result.current.execute();
    });

    expect(result.current.isLoading).toBe(true);

    await act(async () => {
      await promise;
    });

    expect(result.current.status).toBe("success");
    expect(result.current.isSuccess).toBe(true);
    expect(result.current.data).toEqual(mockData);
    expect(result.current.error).toBeNull();
  });

  it("handles error state and provides retry action", async () => {
    let callCount = 0;
    const asyncFn = vi.fn().mockImplementation(() => {
      callCount++;
      if (callCount === 1) {
        return Promise.reject(new Error("503 Gateway Timeout"));
      }
      return Promise.resolve({ success: true });
    });

    const { result } = renderHook(() => useAsync(asyncFn));

    // First attempt fails
    await act(async () => {
      await result.current.execute("param1");
    });

    expect(result.current.status).toBe("error");
    expect(result.current.isError).toBe(true);
    expect(result.current.error).toBe("503 Gateway Timeout");

    // Retry should rerun with same args and succeed
    await act(async () => {
      await result.current.retry();
    });

    expect(result.current.status).toBe("success");
    expect(result.current.data).toEqual({ success: true });
    expect(result.current.error).toBeNull();
  });
});
