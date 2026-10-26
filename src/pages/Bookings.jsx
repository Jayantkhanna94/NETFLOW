import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { Plus, CalendarDays, Clock3, MapPin, Search } from "../components/Icons";
import { saveData } from "../services/storage";
import { Card, Header, Button, Status, SearchBox } from "../components/UI";
import { useCartStore } from "../store/useCartStore";
import BookingCartModal from "../components/BookingCartModal";

export default function Bookings({ query = "" }) {
  const outletCtx = useOutletContext();
  const globalQuery = outletCtx?.query ?? query;

  const { openCart, receipt } = useCartStore();

  const seed = [
    {
      id: "BK-201",
      resource: "Computer Lab 1",
      user: "Aman Gupta",
      date: "2026-09-08",
      time: "10:00 AM – 12:00 PM",
      status: "Approved",
    },
    {
      id: "BK-202",
      resource: "Meeting Room 3",
      user: "Priya Singh",
      date: "2026-09-08",
      time: "02:00 PM – 03:00 PM",
      status: "Pending",
    },
    {
      id: "BK-203",
      resource: "Main Auditorium",
      user: "Student Council",
      date: "2026-09-10",
      time: "11:00 AM – 01:00 PM",
      status: "Approved",
    },
    {
      id: "BK-204",
      resource: "Computer Lab 2",
      user: "Faculty Team",
      date: "2026-09-11",
      time: "09:00 AM – 11:00 AM",
      status: "Cancelled",
    },
  ];

  const [rows, setRows] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("netflow_bookings")) || seed;
    } catch {
      return seed;
    }
  });

  const [q, setQ] = useState(globalQuery);

  // Sync global search from topbar
  useEffect(() => {
    if (globalQuery !== undefined) {
      setQ(globalQuery);
    }
  }, [globalQuery]);

  // Re-read bookings from localStorage when a checkout receipt is generated
  useEffect(() => {
    try {
      const stored = localStorage.getItem("netflow_bookings");
      if (stored) {
        setRows(JSON.parse(stored));
      }
    } catch {}
  }, [receipt]);

  function approve(id) {
    const n = rows.map((x) => (x.id === id ? { ...x, status: "Approved" } : x));
    setRows(n);
    saveData("bookings", n);
  }

  function cancelBooking(id) {
    const n = rows.map((x) => (x.id === id ? { ...x, status: "Cancelled" } : x));
    setRows(n);
    saveData("bookings", n);
  }

  const list = rows.filter((b) =>
    Object.values(b).join(" ").toLowerCase().includes(q.toLowerCase())
  );

  return (
    <>
      <Card>
        <Header
          title="Resource Bookings"
          subtitle={`${rows.length} booking requests • Managed via Zustand Requisition Cart`}
          action={
            <Button
              icon={<Plus size={15} />}
              onClick={openCart}
              title="Open Booking Requisition Cart"
            >
              New Booking
            </Button>
          }
        />

        <SearchBox
          value={q}
          onChange={setQ}
          placeholder="Search bookings by resource, user, date, or status..."
        />

        <div className="booking-list">
          {list.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "30px",
                color: "var(--muted)",
                fontSize: "12px",
              }}
            >
              No bookings matching your search query.
            </div>
          ) : (
            list.map((b) => (
              <div className="booking" key={b.id}>
                <div className="date">
                  <CalendarDays size={17} />
                  <b>{b.date}</b>
                </div>
                <div>
                  <b>{b.resource}</b>
                  <small>
                    {b.user} {b.receiptId ? `• ${b.receiptId}` : ""}
                  </small>
                </div>
                <div className="booking-time">
                  <span>
                    <Clock3 size={13} />
                    {b.time}
                  </span>
                  <span>
                    <MapPin size={13} />
                    Campus
                  </span>
                </div>
                <Status value={b.status} />
                <div style={{ display: "flex", gap: "6px" }}>
                  {b.status === "Pending" && (
                    <Button variant="ghost" onClick={() => approve(b.id)}>
                      Approve
                    </Button>
                  )}
                  {b.status !== "Cancelled" && (
                    <Button
                      variant="ghost"
                      onClick={() => cancelBooking(b.id)}
                      style={{ color: "var(--danger)", fontSize: "10px" }}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Global Booking Cart & Checkout Modal */}
      <BookingCartModal />
    </>
  );
}

export { Bookings };
