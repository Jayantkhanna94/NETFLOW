import { describe, it, expect, beforeEach } from "vitest";
import { useCartStore } from "../store/useCartStore";

describe("Zustand Shopping Cart Store (useCartStore)", () => {
  beforeEach(() => {
    // Reset store before each test
    useCartStore.getState().clearCart();
    localStorage.clear();
  });

  it("should initialize with an empty cart", () => {
    const state = useCartStore.getState();
    expect(state.items).toEqual([]);
    expect(state.getTotalItemsCount()).toBe(0);
  });

  it("should add an item to the cart", () => {
    const item = {
      id: "EQ-TEST-01",
      name: "Gigabit Switch",
      category: "Networking",
      stock: 5,
      specs: "24-Port Managed Switch",
    };

    useCartStore.getState().addItem(item, 2, 5);

    const state = useCartStore.getState();
    expect(state.items.length).toBe(1);
    expect(state.items[0].id).toBe("EQ-TEST-01");
    expect(state.items[0].quantity).toBe(2);
    expect(state.items[0].durationDays).toBe(5);
    expect(state.getTotalItemsCount()).toBe(2);
  });

  it("should increment quantity when adding an existing item", () => {
    const item = {
      id: "EQ-TEST-02",
      name: "Wi-Fi AP",
      category: "Wireless",
      stock: 10,
    };

    useCartStore.getState().addItem(item, 1);
    useCartStore.getState().addItem(item, 2);

    const state = useCartStore.getState();
    expect(state.items.length).toBe(1);
    expect(state.items[0].quantity).toBe(3);
  });

  it("should update item duration and quantity correctly", () => {
    const item = {
      id: "EQ-TEST-03",
      name: "Cable Tester",
      stock: 5,
    };

    useCartStore.getState().addItem(item, 1, 2);
    useCartStore.getState().updateQuantity("EQ-TEST-03", 4);
    useCartStore.getState().updateDuration("EQ-TEST-03", 14);

    const state = useCartStore.getState();
    expect(state.items[0].quantity).toBe(4);
    expect(state.items[0].durationDays).toBe(14);
  });

  it("should remove item when quantity is reduced to 0 or removeItem is called", () => {
    const item = { id: "EQ-TEST-04", name: "SFP Transceiver", stock: 8 };

    useCartStore.getState().addItem(item, 2);
    expect(useCartStore.getState().items.length).toBe(1);

    useCartStore.getState().removeItem("EQ-TEST-04");
    expect(useCartStore.getState().items.length).toBe(0);
  });

  it("should process checkout and record requisition order", () => {
    const item = { id: "EQ-TEST-05", name: "Server Node", stock: 2 };
    useCartStore.getState().addItem(item, 1, 7);

    const checkoutResult = useCartStore.getState().checkout({
      name: "Student Tester",
      email: "tester@college.edu",
      department: "Computer Science",
      purpose: "Final Examination Lab Demonstration",
      returnDate: "2026-11-05",
      priority: "High",
    });

    expect(checkoutResult.success).toBe(true);
    expect(checkoutResult.order).toBeDefined();
    expect(checkoutResult.order.id).toMatch(/^REQ-/);
    expect(checkoutResult.order.applicant).toBe("Student Tester");

    // Cart should be empty after checkout
    expect(useCartStore.getState().items.length).toBe(0);
  });
});
