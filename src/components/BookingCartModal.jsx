import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarCheck2,
  Trash2,
  Plus,
  Minus,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  X,
  Printer,
  Building2,
  Clock3,
  Users,
  MapPin,
  FileCheck,
} from "./Icons";
import { useCartStore } from "../store/useCartStore";
import { useAuth } from "../contexts/AuthContext";
import { Button, FormField, Input, Select, Textarea } from "./UI";
import { validateRequired } from "../services/validation";

export default function BookingCartModal() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateHours,
    clearCart,
    checkout,
    checkoutStatus,
    checkoutError,
    receipt,
    resetCheckout,
  } = useCartStore();

  const [step, setStep] = useState("cart"); // 'cart' | 'checkout'
  const [form, setForm] = useState({
    applicantName: currentUser?.name || "System Administrator",
    department: "Computer Science & Engineering",
    bookingDate: new Date(Date.now() + 86400000).toISOString().split("T")[0],
    timeSlot: "10:00 AM – 12:00 PM",
    purpose: "Practical laboratory assessment and student network audit",
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const modalRef = useRef(null);
  const firstInputRef = useRef(null);

  // Sync user info into form
  useEffect(() => {
    if (currentUser?.name) {
      setForm((prev) => ({
        ...prev,
        applicantName: currentUser.name,
      }));
    }
  }, [currentUser]);

  // Reset step when modal opens
  useEffect(() => {
    if (isOpen) {
      if (receipt) {
        setStep("receipt");
      } else {
        setStep("cart");
      }
      setTimeout(() => firstInputRef.current?.focus(), 100);
    }
  }, [isOpen, receipt]);

  if (!isOpen) return null;

  const totalHours = items.reduce((sum, i) => sum + (i.hours || 0), 0);

  const validate = () => {
    const errs = {};
    const nameErr = validateRequired(form.applicantName, "Applicant Name");
    if (nameErr) errs.applicantName = nameErr;

    const deptErr = validateRequired(form.department, "Department");
    if (deptErr) errs.department = deptErr;

    const purposeErr = validateRequired(form.purpose, "Booking Purpose");
    if (purposeErr) errs.purpose = purposeErr;

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validate();
  };

  const handleConfirmCheckout = async (e) => {
    e.preventDefault();
    setTouched({
      applicantName: true,
      department: true,
      purpose: true,
    });

    if (!validate()) return;

    const res = await checkout(form);
    if (res.success) {
      setStep("receipt");
    }
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  const handleFinish = () => {
    resetCheckout();
    closeCart();
    navigate("/bookings");
  };

  return (
    <div
      className="modal-bg"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-modal-title"
    >
      <div
        className="modal"
        ref={modalRef}
        style={{ width: "min(620px, 95vw)", maxHeight: "90vh", overflowY: "auto" }}
      >
        {/* Modal Header */}
        <div className="modal-head">
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <CalendarCheck2 size={20} color="var(--primary)" />
            <div>
              <h2 id="cart-modal-title" style={{ fontSize: "17px", margin: 0 }}>
                {receipt
                  ? "Booking Requisition Receipt"
                  : step === "checkout"
                  ? "Confirm Resource Reservation"
                  : `Resource Booking Cart (${items.length})`}
              </h2>
              <small style={{ color: "var(--muted)" }}>
                {receipt
                  ? `Voucher: ${receipt.receiptId}`
                  : "State-managed via Zustand with LocalStorage Persistence"}
              </small>
            </div>
          </div>
          <button
            type="button"
            className="icon-btn"
            onClick={closeCart}
            aria-label="Close reservation modal"
          >
            <X size={17} />
          </button>
        </div>

        {/* VIEW 1: GENERATED RECEIPT */}
        {receipt ? (
          <div>
            <div
              style={{
                background: "rgba(50, 213, 131, 0.08)",
                border: "1px solid rgba(50, 213, 131, 0.25)",
                borderRadius: "12px",
                padding: "16px",
                marginBottom: "20px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "8px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <CheckCircle2 size={18} color="var(--success)" />
                  <b style={{ color: "var(--success)", fontSize: "13px" }}>
                    Reservation Confirmed & Approved
                  </b>
                </div>
                <span className="status success">{receipt.status}</span>
              </div>
              <p
                style={{
                  margin: "0",
                  fontSize: "11px",
                  color: "var(--text)",
                  lineHeight: "1.5",
                }}
              >
                Resource booking has been successfully recorded in the NetFlow
                registry. A digital voucher has been generated below.
              </p>
            </div>

            {/* Printable Receipt Card */}
            <div
              className="receipt-card"
              style={{
                background: "var(--panel)",
                border: "1px dashed var(--border)",
                borderRadius: "14px",
                padding: "20px",
                marginBottom: "20px",
                fontSize: "11px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  borderBottom: "1px solid var(--border)",
                  paddingBottom: "12px",
                  marginBottom: "14px",
                }}
              >
                <div>
                  <b style={{ fontSize: "14px", display: "block" }}>
                    NETFLOW CAMPUS RESERVATION
                  </b>
                  <small style={{ color: "var(--muted)" }}>
                    Receipt No: {receipt.receiptId} • Order: {receipt.orderNumber}
                  </small>
                </div>
                <div style={{ textAlign: "right" }}>
                  <small style={{ color: "var(--muted)" }}>Issued At</small>
                  <b style={{ display: "block" }}>{receipt.issuedAt}</b>
                </div>
              </div>

              <div
                className="two-col"
                style={{ gap: "12px", marginBottom: "14px" }}
              >
                <div>
                  <span style={{ color: "var(--muted)", display: "block" }}>
                    Applicant / Reserved By
                  </span>
                  <b>{receipt.applicantName}</b>
                </div>
                <div>
                  <span style={{ color: "var(--muted)", display: "block" }}>
                    Department / Unit
                  </span>
                  <b>{receipt.department}</b>
                </div>
                <div>
                  <span style={{ color: "var(--muted)", display: "block" }}>
                    Scheduled Date
                  </span>
                  <b>{receipt.bookingDate}</b>
                </div>
                <div>
                  <span style={{ color: "var(--muted)", display: "block" }}>
                    Time Slot
                  </span>
                  <b>{receipt.timeSlot}</b>
                </div>
              </div>

              <div style={{ marginBottom: "14px" }}>
                <span style={{ color: "var(--muted)", display: "block" }}>
                  Booking Purpose
                </span>
                <b>{receipt.purpose}</b>
              </div>

              <div
                style={{
                  borderTop: "1px solid var(--border)",
                  paddingTop: "12px",
                  marginBottom: "12px",
                }}
              >
                <b style={{ display: "block", marginBottom: "8px" }}>
                  Reserved Infrastructure ({receipt.totalItems} items)
                </b>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {receipt.items.map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "8px 10px",
                        background: "var(--card)",
                        borderRadius: "8px",
                      }}
                    >
                      <div>
                        <b>{item.name}</b>
                        <small style={{ color: "var(--muted)", display: "block" }}>
                          {item.category} • {item.location} • Capacity: {item.capacity}
                        </small>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <b>{item.hours} hrs</b>
                        <small style={{ color: "var(--success)", display: "block" }}>
                          Approved
                        </small>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderTop: "1px solid var(--border)",
                  paddingTop: "12px",
                }}
              >
                <div>
                  <small style={{ color: "var(--muted)", display: "block" }}>
                    Digital Signature Key
                  </small>
                  <span className="mono" style={{ fontSize: "10px" }}>
                    {receipt.digitalSignature}
                  </span>
                </div>
                <div style={{ textAlign: "right" }}>
                  <small style={{ color: "var(--muted)", display: "block" }}>
                    Total Reserved Duration
                  </small>
                  <b style={{ fontSize: "14px", color: "var(--primary)" }}>
                    {receipt.totalHours} Hours
                  </b>
                </div>
              </div>
            </div>

            <div className="modal-actions">
              <Button
                type="button"
                variant="ghost"
                icon={<Printer size={15} />}
                onClick={handlePrintReceipt}
              >
                Print Voucher
              </Button>
              <Button
                type="button"
                variant="primary"
                icon={<FileCheck size={15} />}
                onClick={handleFinish}
              >
                Done (View in Bookings)
              </Button>
            </div>
          </div>
        ) : step === "checkout" ? (
          /* VIEW 2: CHECKOUT FORM WITH ASYNC STATE */
          <form onSubmit={handleConfirmCheckout}>
            <div
              style={{
                background: "rgba(61, 131, 246, 0.08)",
                border: "1px solid rgba(61, 131, 246, 0.25)",
                borderRadius: "12px",
                padding: "12px 16px",
                marginBottom: "18px",
                fontSize: "11px",
              }}
            >
              <b>Checkout Summary:</b> Reserving {items.length} resource(s) for a
              total of <b>{totalHours} hours</b>.
            </div>

            {checkoutError && (
              <div
                style={{
                  padding: "10px 14px",
                  borderRadius: "8px",
                  background: "rgba(255, 92, 101, 0.1)",
                  border: "1px solid var(--danger)",
                  color: "var(--danger)",
                  fontSize: "11px",
                  marginBottom: "15px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <AlertTriangle size={15} />
                  <span>{checkoutError}</span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleConfirmCheckout}
                  style={{ padding: "4px 8px", fontSize: "10px" }}
                >
                  <RotateCcw size={12} /> Retry
                </Button>
              </div>
            )}

            <div className="two-col">
              <Input
                id="applicant-name"
                label="Applicant Name"
                required
                value={form.applicantName}
                onChange={(val) =>
                  setForm({ ...form, applicantName: String(val) })
                }
                onBlur={() => handleBlur("applicantName")}
                error={errors.applicantName}
                touched={touched.applicantName}
                placeholder="Full Name"
              />

              <Input
                id="applicant-dept"
                label="Department / Unit"
                required
                value={form.department}
                onChange={(val) =>
                  setForm({ ...form, department: String(val) })
                }
                onBlur={() => handleBlur("department")}
                error={errors.department}
                touched={touched.department}
                placeholder="e.g. Computer Science"
              />
            </div>

            <div className="two-col">
              <Input
                id="booking-date"
                label="Reservation Date"
                type="date"
                required
                value={form.bookingDate}
                onChange={(val) =>
                  setForm({ ...form, bookingDate: String(val) })
                }
              />

              <Select
                id="booking-timeslot"
                label="Time Slot"
                value={form.timeSlot}
                onChange={(e) =>
                  setForm({ ...form, timeSlot: e.target.value })
                }
                options={[
                  "08:00 AM – 10:00 AM",
                  "10:00 AM – 12:00 PM",
                  "01:00 PM – 03:00 PM",
                  "03:00 PM – 05:00 PM",
                  "05:00 PM – 07:00 PM",
                ]}
              />
            </div>

            <Textarea
              id="booking-purpose"
              label="Booking Purpose / Requisition Reason"
              required
              rows={3}
              value={form.purpose}
              onChange={(e) => setForm({ ...form, purpose: e.target.value })}
              onBlur={() => handleBlur("purpose")}
              error={errors.purpose}
              touched={touched.purpose}
              placeholder="State the purpose of this campus resource booking..."
            />

            <div className="modal-actions">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setStep("cart")}
                disabled={checkoutStatus === "loading"}
              >
                Back to Cart
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={checkoutStatus === "loading"}
              >
                {checkoutStatus === "loading" ? (
                  <>
                    <RotateCcw size={14} className="trend" />
                    <span>Processing Reservation...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={14} />
                    <span>Confirm & Generate Receipt</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        ) : (
          /* VIEW 3: CART ITEMS LIST */
          <div>
            {items.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "40px 20px",
                  color: "var(--muted)",
                  fontSize: "12px",
                }}
              >
                <Building2
                  size={36}
                  style={{ opacity: 0.3, marginBottom: "12px" }}
                />
                <b style={{ display: "block", color: "var(--text)" }}>
                  Your Booking Cart is Empty
                </b>
                <p style={{ marginTop: "4px" }}>
                  Select rooms, labs, or facilities from the Resources module to
                  reserve them.
                </p>
                <Button
                  type="button"
                  variant="primary"
                  onClick={closeCart}
                  style={{ marginTop: "12px" }}
                >
                  Browse Campus Resources
                </Button>
              </div>
            ) : (
              <div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    marginBottom: "20px",
                  }}
                >
                  {items.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "12px 14px",
                        background: "var(--panel)",
                        border: "1px solid var(--border)",
                        borderRadius: "12px",
                        gap: "12px",
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <b style={{ fontSize: "12px", display: "block" }}>
                          {item.name}
                        </b>
                        <small
                          style={{
                            color: "var(--muted)",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            marginTop: "3px",
                            fontSize: "10px",
                          }}
                        >
                          <span>
                            <Building2 size={11} style={{ verticalAlign: "middle" }} />{" "}
                            {item.category}
                          </span>
                          <span>
                            <MapPin size={11} style={{ verticalAlign: "middle" }} />{" "}
                            {item.location}
                          </span>
                          <span>
                            <Users size={11} style={{ verticalAlign: "middle" }} />{" "}
                            Cap: {item.capacity}
                          </span>
                        </small>
                      </div>

                      {/* Duration Stepper */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          background: "var(--card)",
                          border: "1px solid var(--border)",
                          borderRadius: "8px",
                          padding: "3px 6px",
                        }}
                      >
                        <button
                          type="button"
                          className="icon-btn sm"
                          style={{ width: "24px", height: "24px", margin: 0 }}
                          onClick={() => updateHours(item.id, item.hours - 1)}
                          aria-label={`Decrease hours for ${item.name}`}
                        >
                          <Minus size={11} />
                        </button>
                        <span
                          style={{
                            fontSize: "11px",
                            fontWeight: 700,
                            minWidth: "40px",
                            textAlign: "center",
                          }}
                        >
                          {item.hours}h
                        </span>
                        <button
                          type="button"
                          className="icon-btn sm"
                          style={{ width: "24px", height: "24px", margin: 0 }}
                          onClick={() => updateHours(item.id, item.hours + 1)}
                          aria-label={`Increase hours for ${item.name}`}
                        >
                          <Plus size={11} />
                        </button>
                      </div>

                      {/* Remove item */}
                      <button
                        type="button"
                        className="icon-btn sm"
                        onClick={() => removeItem(item.id)}
                        aria-label={`Remove ${item.name} from cart`}
                        title="Remove item"
                      >
                        <Trash2 size={13} color="var(--danger)" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Subtotal Banner */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "12px 16px",
                    background: "var(--panel)",
                    border: "1px solid var(--border)",
                    borderRadius: "10px",
                    marginBottom: "18px",
                    fontSize: "12px",
                  }}
                >
                  <span style={{ color: "var(--muted)" }}>
                    Total Resources: <b>{items.length}</b>
                  </span>
                  <span>
                    Total Duration:{" "}
                    <b style={{ color: "var(--primary)", fontSize: "14px" }}>
                      {totalHours} Hours
                    </b>
                  </span>
                </div>

                <div className="modal-actions">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={clearCart}
                    style={{ color: "var(--danger)" }}
                  >
                    Clear Cart
                  </Button>
                  <Button
                    type="button"
                    variant="primary"
                    onClick={() => setStep("checkout")}
                  >
                    Proceed to Checkout
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
