import { describe, it, expect, beforeEach } from "vitest";
import { act } from "@testing-library/react";
import { useCartStore } from "../store/useCartStore";

describe("Zustand Global State Management, Requisition Cart, Checkout & Receipt", () => {
  beforeEach(() => {
    localStorage.clear();
    act(() => {
      useCartStore.getState().clearCart();
      useCartStore.getState().resetCheckout();
    });
  });

  it("initializes with an empty cart and closed modal", () => {
    const state = useCartStore.getState();
    expect(state.items).toEqual([]);
    expect(state.isOpen).toBe(false);
    expect(state.receipt).toBeNull();
  });

  it("adds a resource to the requisition cart and calculates total hours", () => {
    act(() => {
      useCartStore.getState().addItem({
        id: "LAB-01",
        name: "Computer Lab 1",
        category: "Lab",
        capacity: 60,
        location: "Block A",
      });
    });

    const state = useCartStore.getState();
    expect(state.items.length).toBe(1);
    expect(state.items[0].name).toBe("Computer Lab 1");
    expect(state.items[0].hours).toBe(2); // default 2 hours
    expect(state.isOpen).toBe(true);
    expect(state.getTotalHours()).toBe(2);

    // Adding same resource increments duration
    act(() => {
      useCartStore.getState().addItem({
        id: "LAB-01",
        name: "Computer Lab 1",
      });
    });

    expect(useCartStore.getState().items[0].hours).toBe(3);
    expect(useCartStore.getState().getTotalHours()).toBe(3);
  });

  it("updates hours and removes an item from the cart", () => {
    act(() => {
      useCartStore.getState().addItem({
        id: "MR-03",
        name: "Meeting Room 3",
        category: "Meeting Room",
      });
    });

    const item = useCartStore.getState().items[0];

    act(() => {
      useCartStore.getState().updateHours(item.id, 5);
    });

    expect(useCartStore.getState().items[0].hours).toBe(5);

    act(() => {
      useCartStore.getState().removeItem(item.id);
    });

    expect(useCartStore.getState().items.length).toBe(0);
  });

  it("completes checkout asynchronously and generates an official receipt", async () => {
    act(() => {
      useCartStore.getState().addItem({
        id: "AUD-01",
        name: "Main Auditorium",
        category: "Auditorium",
        capacity: 500,
        location: "Academic Block",
      });
    });

    expect(useCartStore.getState().items.length).toBe(1);

    let checkoutResult;
    await act(async () => {
      checkoutResult = await useCartStore.getState().checkout({
        applicantName: "Priya Singh",
        department: "Information Technology",
        bookingDate: "2026-10-15",
        timeSlot: "11:00 AM – 01:00 PM",
        purpose: "Annual Hackathon Orientation",
      });
    });

    expect(checkoutResult.success).toBe(true);

    const state = useCartStore.getState();
    expect(state.checkoutStatus).toBe("success");
    expect(state.items.length).toBe(0); // Cart is cleared after checkout
    expect(state.receipt).toBeDefined();
    expect(state.receipt.receiptId).toMatch(/^RCP-2026-\d{4}$/);
    expect(state.receipt.applicantName).toBe("Priya Singh");
    expect(state.receipt.status).toBe("Approved");
    expect(state.receipt.totalHours).toBe(2);
    expect(state.receipt.items[0].name).toBe("Main Auditorium");

    // Confirms booking entry is saved into localStorage netflow_bookings
    const storedBookings = JSON.parse(localStorage.getItem("netflow_bookings") || "[]");
    expect(storedBookings.length).toBeGreaterThan(0);
    expect(storedBookings[0].resource).toBe("Main Auditorium");
  });

  it("persists cart state to localStorage via Zustand persist middleware", () => {
    act(() => {
      useCartStore.getState().addItem({
        id: "LAB-02",
        name: "Computer Lab 2",
        category: "Lab",
      });
    });

    const persistedRaw = localStorage.getItem("netflow_resource_cart");
    expect(persistedRaw).toBeDefined();
    const persisted = JSON.parse(persistedRaw);
    expect(persisted.state.items.length).toBe(1);
    expect(persisted.state.items[0].name).toBe("Computer Lab 2");
  });
});
