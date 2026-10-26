import React, { useState, useEffect, useRef } from "react";
import { useOutletContext } from "react-router-dom";
import { Plus, MapPin, Users, CalendarCheck2, X, Check } from "../components/Icons";
import { getData, saveData, newId } from "../services/storage";
import { Card, Header, Button, SearchBox, Status, FormField, Input, Select } from "../components/UI";
import { useCartStore } from "../store/useCartStore";
import BookingCartModal from "../components/BookingCartModal";
import { validateRequired, validateCapacity } from "../services/validation";

export default function Resources({ query = "" }) {
  const outletCtx = useOutletContext();
  const globalQuery = outletCtx?.query ?? query;

  const [rows, setRows] = useState(() => getData("resources"));
  const [q, setQ] = useState(globalQuery);
  const [add, setAdd] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const nameInputRef = useRef(null);

  // Zustand cart store integration
  const { items, addItem, openCart } = useCartStore();

  const [f, setF] = useState({
    name: "",
    category: "Lab",
    capacity: 30,
    location: "",
    status: "Available",
  });

  // Sync global search from topbar
  useEffect(() => {
    if (globalQuery !== undefined) {
      setQ(globalQuery);
    }
  }, [globalQuery]);

  // Focus first input on modal open (DOM manipulation via ref)
  useEffect(() => {
    if (add) {
      setTimeout(() => nameInputRef.current?.focus(), 100);
    }
  }, [add]);

  const list = rows.filter((x) =>
    Object.values(x).join(" ").toLowerCase().includes(q.toLowerCase())
  );

  const validate = () => {
    const errs = {};
    const nameErr = validateRequired(f.name, "Resource Name");
    if (nameErr) errs.name = nameErr;

    const locErr = validateRequired(f.location, "Location");
    if (locErr) errs.location = locErr;

    const capErr = validateCapacity(f.capacity);
    if (capErr) errs.capacity = capErr;

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validate();
  };

  function submit(e) {
    e.preventDefault();
    setTouched({ name: true, location: true, capacity: true });
    if (!validate()) return;

    const n = [
      ...rows,
      { ...f, id: newId("RES"), capacity: Number(f.capacity) },
    ];
    setRows(n);
    saveData("resources", n);
    setAdd(false);
    setF({
      name: "",
      category: "Lab",
      capacity: 30,
      location: "",
      status: "Available",
    });
    setErrors({});
    setTouched({});
  }

  return (
    <>
      <Card>
        <Header
          title="Campus Resources"
          subtitle="Labs, rooms, halls and shared IT resources"
          action={
            <div className="actions">
              <Button
                variant={items.length > 0 ? "primary" : "ghost"}
                icon={<CalendarCheck2 size={15} />}
                onClick={openCart}
                title="View Booking Requisition Cart"
              >
                Booking Cart {items.length > 0 ? `(${items.length})` : ""}
              </Button>
              <Button icon={<Plus size={15} />} onClick={() => setAdd(true)}>
                Add Resource
              </Button>
            </div>
          }
        />
        <SearchBox value={q} onChange={setQ} placeholder="Search resources by name, category, location..." />
        <div className="resource-grid">
          {list.map((r) => {
            const inCartItem = items.find((item) => item.resourceId === r.id);
            return (
              <div className="resource-card" key={r.id}>
                <div className="resource-top">
                  <small>{r.id}</small>
                  <Status value={r.status} />
                </div>
                <h3>{r.name}</h3>
                <p>{r.category}</p>
                <div className="resource-meta">
                  <span>
                    <MapPin size={13} />
                    {r.location}
                  </span>
                  <span>
                    <Users size={13} />
                    {r.capacity}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => addItem(r)}
                  style={
                    inCartItem
                      ? {
                          borderColor: "var(--primary)",
                          color: "var(--primary)",
                          background: "rgba(61, 131, 246, 0.08)",
                        }
                      : undefined
                  }
                >
                  {inCartItem ? (
                    <>
                      <Check size={14} /> In Cart ({inCartItem.hours}h) • Add More
                    </>
                  ) : (
                    <>
                      <CalendarCheck2 size={14} /> Book resource
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {add && (
          <div className="modal-bg" role="dialog" aria-modal="true">
            <form className="modal" onSubmit={submit}>
              <div className="modal-head">
                <h2>Add Resource</h2>
                <button
                  type="button"
                  className="icon-btn"
                  onClick={() => setAdd(false)}
                  aria-label="Close add resource modal"
                >
                  <X size={17} />
                </button>
              </div>

              <Input
                inputRef={nameInputRef}
                id="res-name"
                label="Resource Name"
                required
                value={f.name}
                onChange={(val) => setF({ ...f, name: String(val) })}
                onBlur={() => handleBlur("name")}
                error={errors.name}
                touched={touched.name}
                placeholder="e.g. Computer Lab 3 or IoT Research Hall"
              />

              <div className="two-col">
                <Select
                  id="res-category"
                  label="Category"
                  value={f.category}
                  onChange={(e) => setF({ ...f, category: e.target.value })}
                  options={["Lab", "Meeting Room", "Auditorium", "Printer"]}
                />

                <Input
                  id="res-capacity"
                  label="Capacity"
                  type="number"
                  required
                  value={f.capacity}
                  onChange={(val) => setF({ ...f, capacity: val })}
                  onBlur={() => handleBlur("capacity")}
                  error={errors.capacity}
                  touched={touched.capacity}
                />
              </div>

              <Input
                id="res-location"
                label="Location"
                required
                value={f.location}
                onChange={(val) => setF({ ...f, location: String(val) })}
                onBlur={() => handleBlur("location")}
                error={errors.location}
                touched={touched.location}
                placeholder="e.g. Academic Block B, 2nd Floor"
              />

              <div className="modal-actions">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setAdd(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Add Resource</Button>
              </div>
            </form>
          </div>
        )}
      </Card>

      {/* Global Booking Cart & Checkout Modal */}
      <BookingCartModal />
    </>
  );
}

export { Resources };
