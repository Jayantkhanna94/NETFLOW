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

      // Add item to cart (defaults 2 hours reservation)
      addItem: (resource) => {
        const currentItems = get().items;
        const existingIndex = currentItems.findIndex(
          (item) => item.resourceId === resource.id
        );

        if (existingIndex > -1) {
          const updated = [...currentItems];
          updated[existingIndex].hours = Math.min(
            12,
            updated[existingIndex].hours + 1
          );
          set({ items: updated, isOpen: true });
        } else {
          const newItem = {
            id: `CART-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            resourceId: resource.id,
            name: resource.name,
            category: resource.category || "General",
            capacity: resource.capacity || 1,
            location: resource.location || "Campus",
            hours: 2,
            timeSlot: "10:00 AM – 12:00 PM",
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

      // Clear all items
      clearCart: () => set({ items: [] }),

      // Total count and total hours getters
      getTotalCount: () => {
        return get().items.length;
      },

      getTotalHours: () => {
        return get().items.reduce((sum, item) => sum + (item.hours || 0), 0);
      },

      // Asynchronous Checkout & Receipt Generation
      checkout: async (bookingDetails) => {
        set({ checkoutStatus: "loading", checkoutError: null });

        try {
          // Simulate asynchronous network reservation request (delay)
          await new Promise((resolve) => setTimeout(resolve, 800));

          const {
            applicantName = "System User",
            department = "Computer Science",
            bookingDate = new Date().toISOString().split("T")[0],
            timeSlot = "10:00 AM – 12:00 PM",
            purpose = "Lab session & practical project work",
          } = bookingDetails || {};

          const currentItems = get().items;
          if (currentItems.length === 0) {
            throw new Error("Cannot checkout with an empty reservation cart.");
          }

          const totalHours = currentItems.reduce(
            (sum, item) => sum + (item.hours || 0),
            0
          );
          const receiptId = `RCP-${new Date().getFullYear()}-${Math.floor(
            1000 + Math.random() * 9000
          )}`;
          const orderNumber = `NF-RES-${Date.now().toString().slice(-6)}`;

          const generatedReceipt = {
            receiptId,
            orderNumber,
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
            digitalSignature: `SIG-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
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
              time: `${item.hours}h (${timeSlot})`,
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

          return { success: true, receipt: generatedReceipt };
        } catch (error) {
          set({
            checkoutStatus: "error",
            checkoutError: error.message || "Checkout failed. Please try again.",
          });
          return { success: false, error: error.message };
        }
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
