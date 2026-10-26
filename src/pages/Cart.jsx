import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  CheckCircle2,
  CalendarDays,
  ShieldCheck,
  FileText,
  AlertTriangle,
  RotateCcw,
  Package,
  Layers,
  ArrowRight,
  X,
} from "../components/Icons";
import { useCartStore } from "../store/useCartStore";
import { useData } from "../contexts/DataContext";
import { useAuth } from "../contexts/AuthContext";
import { Card, Header, Button, Status } from "../components/UI";
import { useForm, validators } from "../hooks/useForm";
import {
  TextInput,
  SelectField,
  TextareaField,
  CheckboxField,
} from "../components/forms";

export default function Cart() {
  const {
    items,
    catalog,
    addItem,
    removeItem,
    updateQuantity,
    updateDuration,
    clearCart,
    checkout,
    lastOrder,
  } = useCartStore();

  const { addLog, addNotification } = useData();
  const { currentUser } = useAuth();

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [orderSuccessModal, setOrderSuccessModal] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const categories = ["All", "Diagnostics", "Networking", "Wireless", "Fiber Optics", "IoT / Probe", "Compute"];

  const filteredCatalog = catalog.filter((item) =>
    selectedCategory === "All" ? true : item.category === selectedCategory
  );

  const totalUnits = items.reduce((acc, i) => acc + i.quantity, 0);

  // Return date calculation based on maximum duration in cart
  const maxDuration = items.reduce((max, i) => Math.max(max, i.durationDays || 3), 3);
  const calculatedReturnDate = new Date(Date.now() + maxDuration * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  // Requisition Form with full validation strategy via useForm hook
  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    isSubmitting,
  } = useForm({
    initialValues: {
      name: currentUser?.name || "Student Applicant",
      email: currentUser?.email || "student@college.edu",
      department: "Computer Science",
      purpose: "Front End Engineering-II lab practical and network telemetry assessment",
      returnDate: calculatedReturnDate,
      priority: "Normal",
      agreeTerms: true,
    },
    validationRules: {
      name: [validators.required("Applicant name is required."), validators.minLength(3, "Name must be at least 3 characters.")],
      email: [validators.required("Institutional email is required."), validators.email()],
      department: [validators.required("Please select your department.")],
      purpose: [
        validators.required("Purpose of requisition is required."),
        validators.minLength(12, "Please provide at least 12 characters describing project purpose."),
      ],
      returnDate: [validators.required("Expected return date is required.")],
      agreeTerms: [
        (val) => (val === true ? null : "You must acknowledge academic equipment responsibility."),
      ],
    },
    onSubmit: async (formValues) => {
      const res = checkout(formValues);
      if (res.success) {
        addLog(`Hardware requisition placed: ${res.order.id} (${items.length} unique items)`, "success");
        addNotification(`Requisition ${res.order.id} approved for ${formValues.name}`, "success");
        setShowCheckoutModal(false);
        setOrderSuccessModal(true);
      }
    },
  });

  return (
    <div className="cart-page-wrapper">
      {/* Toast banner */}
      {toastMessage && (
        <div className="cart-toast" role="status">
          <CheckCircle2 size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Banner & Highlights */}
      <div className="cart-top-banner">
        <div className="banner-content">
          <div className="banner-tag">
            <Package size={14} /> Academic Hardware & Equipment Requisition
          </div>
          <h2>Campus IT Equipment & Lab Hardware Cart</h2>
          <p>
            Reserve switches, access points, telemetry probes, and diagnostic tools for hands-on
            experiments. Powered by fine-grained <b>Zustand</b> store state architecture.
          </p>
        </div>
        <div className="banner-stats">
          <div className="b-stat">
            <b>{items.length}</b>
            <span>Items in Cart</span>
          </div>
          <div className="b-stat">
            <b>{totalUnits}</b>
            <span>Total Units</span>
          </div>
          <div className="b-stat">
            <b style={{ color: "var(--success)" }}>100%</b>
            <span>Academic Grant</span>
          </div>
        </div>
      </div>

      <div className="cart-main-grid">
        {/* Left Column: Cart Items & Requisition Management */}
        <div className="cart-items-section">
          <Card>
            <Header
              title={`Requisition Cart (${items.length} items)`}
              subtitle="Review items, adjust loan duration (days), and allocate equipment"
              action={
                items.length > 0 && (
                  <Button
                    variant="ghost"
                    onClick={() => {
                      if (confirm("Clear all items from your requisition cart?")) {
                        clearCart();
                        triggerToast("Cart cleared.");
                      }
                    }}
                    style={{ color: "var(--danger)", borderColor: "rgba(255, 92, 101, 0.3)" }}
                  >
                    <Trash2 size={14} /> Clear Cart
                  </Button>
                )
              }
            />

            {items.length === 0 ? (
              <div className="empty-cart-view">
                <div className="empty-icon-box">
                  <ShoppingCart size={40} />
                </div>
                <h3>Your requisition cart is empty</h3>
                <p>
                  Explore the campus hardware catalog below and select switches, analyzers, or
                  telemetry probes to add them to your reservation.
                </p>
                <a href="#catalog" className="btn btn-primary">
                  Browse Hardware Catalog
                </a>
              </div>
            ) : (
              <div className="cart-table-wrapper">
                <table className="cart-table">
                  <thead>
                    <tr>
                      <th>Equipment Description</th>
                      <th>Category</th>
                      <th>Quantity</th>
                      <th>Duration</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <div className="cart-item-title-box">
                            <span className="cart-badge">{item.badge || item.category}</span>
                            <b>{item.name}</b>
                            <small>{item.specs}</small>
                          </div>
                        </td>
                        <td>
                          <span className="role">{item.category}</span>
                        </td>
                        <td>
                          <div className="qty-counter">
                            <button
                              type="button"
                              className="qty-btn"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              aria-label="Decrease quantity"
                            >
                              <Minus size={13} />
                            </button>
                            <span className="qty-value">{item.quantity}</span>
                            <button
                              type="button"
                              className="qty-btn"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              aria-label="Increase quantity"
                              disabled={item.quantity >= (item.stock || 10)}
                            >
                              <Plus size={13} />
                            </button>
                          </div>
                        </td>
                        <td>
                          <div className="duration-select-box">
                            <select
                              value={item.durationDays || 3}
                              onChange={(e) =>
                                updateDuration(item.id, Number(e.target.value))
                              }
                              className="duration-dropdown"
                            >
                              <option value="1">1 Day</option>
                              <option value="3">3 Days</option>
                              <option value="7">7 Days (1 Wk)</option>
                              <option value="14">14 Days (2 Wks)</option>
                              <option value="30">30 Days (Semester)</option>
                            </select>
                          </div>
                        </td>
                        <td>
                          <button
                            type="button"
                            className="icon-btn sm delete-btn"
                            onClick={() => {
                              removeItem(item.id);
                              triggerToast(`Removed ${item.name}`);
                            }}
                            aria-label={`Remove ${item.name}`}
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>

          {/* Available Hardware Catalog */}
          <Card className="catalog-card" id="catalog">
            <Header
              title="Campus Hardware & Equipment Catalog"
              subtitle="Click 'Add to Cart' to reserve equipment for your networking lab experiments"
            />

            {/* Category filter pills */}
            <div className="filter-pills" style={{ marginBottom: "16px" }}>
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`filter-pill ${selectedCategory === cat ? "active" : ""}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="catalog-grid">
              {filteredCatalog.map((prod) => {
                const inCart = items.find((i) => i.id === prod.id);
                return (
                  <div className="catalog-card-item" key={prod.id}>
                    <div className="catalog-top">
                      <span className="catalog-badge">{prod.badge}</span>
                      <Status value={prod.status} />
                    </div>
                    <h4>{prod.name}</h4>
                    <p className="catalog-specs">{prod.specs}</p>
                    <div className="catalog-meta">
                      <span>Category: <b>{prod.category}</b></span>
                      <span>Stock: <b>{prod.stock} units</b></span>
                    </div>

                    <div className="catalog-action-row">
                      {inCart ? (
                        <div className="in-cart-indicator">
                          <CheckCircle2 size={15} color="var(--success)" />
                          <span>In Cart ({inCart.quantity}x)</span>
                          <button
                            type="button"
                            className="btn btn-ghost sm"
                            onClick={() => addItem(prod, 1)}
                            title="Add another unit"
                          >
                            +1
                          </button>
                        </div>
                      ) : (
                        <Button
                          icon={<ShoppingCart size={14} />}
                          onClick={() => {
                            addItem(prod, 1);
                            triggerToast(`Added ${prod.name} to Requisition Cart!`);
                          }}
                        >
                          Add to Cart
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Right Column: Order Summary & Checkout Card */}
        <div className="cart-summary-section">
          <Card className="summary-card">
            <Header
              title="Requisition Summary"
              subtitle="Academic equipment voucher"
            />

            <div className="summary-breakdown">
              <div className="summary-row">
                <span>Unique Equipment Types</span>
                <b>{items.length}</b>
              </div>
              <div className="summary-row">
                <span>Total Unit Count</span>
                <b>{totalUnits} units</b>
              </div>
              <div className="summary-row">
                <span>Loan Period</span>
                <b>Up to {maxDuration} Days</b>
              </div>
              <div className="summary-row">
                <span>Security Deposit</span>
                <b style={{ color: "var(--success)" }}>₹0 (Waived)</b>
              </div>
              <div className="summary-row">
                <span>Academic Lab Grant</span>
                <span className="grant-badge">100% Subsidized</span>
              </div>
              <div className="summary-divider" />
              <div className="summary-total-row">
                <span>Net Payable</span>
                <span className="free-tag">FREE FOR STUDENTS</span>
              </div>
            </div>

            <div className="summary-notice">
              <ShieldCheck size={16} />
              <span>
                Authorized under University Lab Grant 2026. Equipment must be inspected before return.
              </span>
            </div>

            <div className="summary-actions">
              <Button
                variant="primary"
                disabled={items.length === 0}
                onClick={() => {
                  resetForm();
                  setShowCheckoutModal(true);
                }}
                style={{ width: "100%", justifyContent: "center" }}
              >
                Proceed to Checkout <ArrowRight size={15} />
              </Button>
            </div>
          </Card>

          {/* Quick Info Box on Zustand State */}
          <Card className="zustand-info-card">
            <div className="state-info-header">
              <Layers size={18} color="var(--primary)" />
              <b>State Architecture: Zustand Store</b>
            </div>
            <p>
              This shopping cart is powered by <code>useCartStore</code> using <b>Zustand</b>,
              demonstrating slice patterns, local storage persistence, fine-grained selector
              subscriptions, and atomic updates.
            </p>
            <Link to="/architecture" className="state-link">
              View State Architecture & Viva Guide &rarr;
            </Link>
          </Card>
        </div>
      </div>

      {/* Checkout Modal with Form Validation */}
      {showCheckoutModal && (
        <div className="modal-bg" role="dialog" aria-modal="true">
          <form className="modal" onSubmit={handleSubmit} style={{ width: "min(560px, 95vw)" }}>
            <div className="modal-head">
              <h2>Equipment Requisition Checkout</h2>
              <button
                type="button"
                className="icon-btn"
                onClick={() => setShowCheckoutModal(false)}
                aria-label="Close checkout modal"
              >
                <X size={17} />
              </button>
            </div>

            <p style={{ color: "var(--muted)", fontSize: "12px", margin: "0 0 16px" }}>
              Complete the requisition details below. Validation strategies verify field-level
              requirements in real time.
            </p>

            <TextInput
              label="Applicant Full Name"
              name="name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.name}
              touched={touched.name}
              required
              placeholder="e.g. Aman Gupta"
            />

            <TextInput
              label="Institutional Email"
              name="email"
              type="email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.email}
              touched={touched.email}
              required
              placeholder="e.g. aman@college.edu"
            />

            <div className="two-col">
              <SelectField
                label="Department"
                name="department"
                value={values.department}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.department}
                touched={touched.department}
                required
                options={[
                  "Computer Science & Engineering",
                  "Information Technology",
                  "Electronics & Communication",
                  "Network Operations Centre",
                ]}
              />

              <SelectField
                label="Requisition Priority"
                name="priority"
                value={values.priority}
                onChange={handleChange}
                onBlur={handleBlur}
                options={["Normal", "High", "Critical (Exam / Assessment)"]}
              />
            </div>

            <TextInput
              label="Expected Return Date"
              name="returnDate"
              type="date"
              value={values.returnDate}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.returnDate}
              touched={touched.returnDate}
              required
            />

            <TextareaField
              label="Purpose of Requisition / Lab Experiment"
              name="purpose"
              value={values.purpose}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.purpose}
              touched={touched.purpose}
              required
              placeholder="Describe the academic project, lab assignment, or research experiment..."
              maxLength={200}
              rows={3}
            />

            <CheckboxField
              name="agreeTerms"
              checked={values.agreeTerms}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.agreeTerms}
              touched={touched.agreeTerms}
              required
              label="Academic Responsibilities Agreement"
              description="I confirm I am an enrolled student/faculty member and will return all reserved units on or before the due date."
            />

            <div className="modal-actions" style={{ marginTop: "20px" }}>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowCheckoutModal(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Submitting Requisition..." : "Confirm & Submit Requisition"}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Order Confirmation Voucher Modal */}
      {orderSuccessModal && lastOrder && (
        <div className="modal-bg" role="dialog" aria-modal="true">
          <div className="modal" style={{ width: "min(520px, 95vw)", textAlign: "center" }}>
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "50%",
                background: "rgba(34, 197, 94, 0.15)",
                color: "var(--success)",
                display: "grid",
                placeItems: "center",
                margin: "0 auto 16px",
              }}
            >
              <CheckCircle2 size={32} />
            </div>

            <h2 style={{ margin: "0 0 6px" }}>Requisition Order Approved!</h2>
            <p style={{ color: "var(--muted)", fontSize: "13px", margin: "0 0 20px" }}>
              Your campus IT hardware requisition has been verified and registered.
            </p>

            <div className="voucher-card">
              <div className="voucher-header">
                <span>VOUCHER ID</span>
                <b className="mono">{lastOrder.id}</b>
              </div>
              <div className="voucher-body">
                <div className="v-row">
                  <span>Applicant</span>
                  <b>{lastOrder.applicant}</b>
                </div>
                <div className="v-row">
                  <span>Department</span>
                  <b>{lastOrder.department}</b>
                </div>
                <div className="v-row">
                  <span>Total Equipment Units</span>
                  <b>{lastOrder.totalUnits} Units</b>
                </div>
                <div className="v-row">
                  <span>Due Return Date</span>
                  <b>{lastOrder.returnDate}</b>
                </div>
                <div className="v-row">
                  <span>Status</span>
                  <Status value="Approved" />
                </div>
              </div>
            </div>

            <div className="modal-actions" style={{ justifyContent: "center", marginTop: "20px" }}>
              <Link to="/bookings" className="btn btn-ghost" onClick={() => setOrderSuccessModal(false)}>
                View in Bookings
              </Link>
              <Button
                variant="primary"
                onClick={() => setOrderSuccessModal(false)}
              >
                Close Receipt
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
