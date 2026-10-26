import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { saveData } from "../services/storage";

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      checkoutStatus: "idle", // 'idle' | 'loading' | 'success' | 'error'
      checkoutError: null,
      receipt: null,

      // Modal open/close
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      // Add item to cart
      addItem: (resource, quantity = 1, durationDays) => {
        const currentItems = get().items;
        const targetId = resource.id;
        const existingIndex = currentItems.findIndex(
          (item) => item.id === targetId || item.resourceId === targetId
        );

        const qtyToAdd = typeof quantity === "number" ? quantity : 1;

        if (existingIndex > -1) {
          const updated = [...currentItems];
          const existing = updated[existingIndex];
          const newQty = (existing.quantity || 1) + qtyToAdd;
          const newHours = Math.min(12, (existing.hours || 2) + 1);
          const newDuration =
            durationDays !== undefined
              ? durationDays
              : existing.durationDays || 2;
          updated[existingIndex] = {
            ...existing,
            quantity: newQty,
            hours: newHours,
            durationDays: newDuration,
          };
          set({ items: updated, isOpen: true });
        } else {
          const hoursVal =
            typeof durationDays === "number"
              ? durationDays
              : resource.hours || 2;
          const newItem = {
            ...resource,
            id:
              resource.id ||
              `CART-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            resourceId: resource.id,
            name: resource.name,
            category: resource.category || "General",
            capacity: resource.capacity || 1,
            location: resource.location || "Campus",
            quantity: qtyToAdd,
            durationDays: durationDays !== undefined ? durationDays : hoursVal,
            hours: hoursVal,
            timeSlot: resource.timeSlot || "10:00 AM – 12:00 PM",
          };
          set({ items: [...currentItems, newItem], isOpen: true });
        }
      },

      // Remove item from cart
      removeItem: (resourceId) => {
        set((state) => ({
          items: state.items.filter(
            (item) => item.resourceId !== resourceId && item.id !== resourceId
          ),
        }));
      },

      // Update reservation hours (clamped 1 - 12)
      updateHours: (resourceId, hours) => {
        const clamped = Math.max(1, Math.min(12, Number(hours) || 1));
        set((state) => ({
          items: state.items.map((item) =>
            item.resourceId === resourceId || item.id === resourceId
              ? { ...item, hours: clamped }
              : item
          ),
        }));
      },

      // Update quantity
      updateQuantity: (id, qty) => {
        const numQty = Number(qty);
        if (numQty <= 0) {
          get().removeItem(id);
          return;
        }
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id || item.resourceId === id
              ? { ...item, quantity: numQty }
              : item
          ),
        }));
      },

      // Update duration
      updateDuration: (id, duration) => {
        const numDuration = Number(duration) || 1;
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id || item.resourceId === id
              ? { ...item, durationDays: numDuration, hours: numDuration }
              : item
          ),
        }));
      },

      // Clear all items
      clearCart: () => set({ items: [] }),

      // Total count and total hours getters
      getTotalCount: () => {
        return get().items.length;
      },

      getTotalItemsCount: () => {
        return get().items.reduce(
          (sum, item) => sum + (item.quantity ?? 1),
          0
        );
      },

      getTotalHours: () => {
        return get().items.reduce((sum, item) => sum + (item.hours || 0), 0);
      },

      // Checkout & Receipt / Order Generation
      checkout: (bookingDetails) => {
        set({ checkoutStatus: "loading", checkoutError: null });

        const currentItems = get().items;
        if (currentItems.length === 0) {
          const errMsg = "Cannot checkout with an empty reservation cart.";
          set({
            checkoutStatus: "error",
            checkoutError: errMsg,
          });
          const failObj = { success: false, error: errMsg };
          const failPromise = Promise.resolve(failObj);
          Object.assign(failPromise, failObj);
          return failPromise;
        }

        const applicantName =
          bookingDetails?.applicant ||
          bookingDetails?.applicantName ||
          bookingDetails?.name ||
          "System User";

        const department = bookingDetails?.department || "Computer Science";
        const bookingDate =
          bookingDetails?.bookingDate ||
          bookingDetails?.returnDate ||
          new Date().toISOString().split("T")[0];
        const timeSlot = bookingDetails?.timeSlot || "10:00 AM – 12:00 PM";
        const purpose =
          bookingDetails?.purpose || "Lab session & practical project work";

        const totalHours = currentItems.reduce(
          (sum, item) => sum + (item.hours || 0),
          0
        );
        const receiptId = `RCP-2026-${Math.floor(1000 + Math.random() * 9000)}`;
        const orderId = `REQ-${Date.now().toString().slice(-6)}`;

        const generatedReceipt = {
          receiptId,
          orderNumber: orderId,
          issuedAt: new Date().toLocaleString(),
          bookingDate,
          timeSlot,
          applicantName,
          department,
          purpose,
          items: [...currentItems],
          totalItems: currentItems.length,
          totalHours,
          status: "Approved",
          digitalSignature: `SIG-${Math.random()
            .toString(36)
            .substring(2, 10)
            .toUpperCase()}`,
        };

        const generatedOrder = {
          id: orderId,
          applicant: applicantName,
          email: bookingDetails?.email || "user@netflow.internal",
          department,
          purpose,
          date: bookingDate,
          returnDate: bookingDetails?.returnDate || bookingDate,
          priority: bookingDetails?.priority || "Normal",
          items: [...currentItems],
          totalItems: currentItems.length,
          status: "Approved",
        };

        // Save new booking entries to localStorage netflow_bookings
        try {
          const existingBookings = JSON.parse(
            localStorage.getItem("netflow_bookings") || "[]"
          );
          const newBookingEntries = currentItems.map((item, idx) => ({
            id: `BK-${Date.now().toString().slice(-4)}-${idx + 1}`,
            resource: item.name,
            user: applicantName,
            date: bookingDate,
            time: `${item.hours || 2}h (${timeSlot})`,
            status: "Approved",
            receiptId,
          }));
          const updatedBookings = [...newBookingEntries, ...existingBookings];
          saveData("bookings", updatedBookings);
        } catch {}

        // Update store state
        set({
          receipt: generatedReceipt,
          checkoutStatus: "success",
          items: [],
        });

        const successObj = {
          success: true,
          order: generatedOrder,
          receipt: generatedReceipt,
        };
        const successPromise = Promise.resolve(successObj);
        Object.assign(successPromise, successObj);

        return successPromise;
      },

      // Reset checkout status
      resetCheckout: () => {
        set({ checkoutStatus: "idle", checkoutError: null, receipt: null });
      },
    }),
    {
      name: "netflow_resource_cart",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    }
  )
);
