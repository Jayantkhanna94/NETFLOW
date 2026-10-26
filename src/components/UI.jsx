import React from "react";
import {
  CheckCircle2,
  XCircle,
  Clock3,
  Activity,
  Search,
  Wifi,
} from "./Icons";

export function Card({ children, className = "" }) {
  return <section className={`card ${className}`}>{children}</section>;
}

export function Button({ children, variant = "primary", icon, ...p }) {
  return (
    <button className={`btn btn-${variant}`} {...p}>
      {icon}
      {children}
    </button>
  );
}

export function Status({ value }) {
  const good = [
    "Online",
    "Active",
    "Available",
    "Resolved",
    "Approved",
  ].includes(value);
  const bad = ["Offline", "Inactive", "Cancelled"].includes(value);
  const warn = [
    "Open",
    "Investigating",
    "Maintenance",
    "Occupied",
    "Pending",
  ].includes(value);

  return (
    <span
      className={`status ${
        good ? "success" : bad ? "danger" : warn ? "warning" : "info"
      }`}
    >
      {good ? (
        <CheckCircle2 size={14} />
      ) : bad ? (
        <XCircle size={14} />
      ) : warn ? (
        <Clock3 size={14} />
      ) : (
        <Activity size={14} />
      )}{" "}
      {value}
    </span>
  );
}

export function Stat({ label, value, icon: Icon, trend, danger }) {
  return (
    <Card className="stat-card">
      <div>
        <b className="stat-value">{value}</b>
        <span className="stat-label">{label}</span>
        <small className={danger ? "trend danger" : "trend"}>{trend}</small>
      </div>
      <div className="stat-icon">
        <Icon size={25} />
      </div>
    </Card>
  );
}

export function Header({ title, subtitle, action }) {
  return (
    <div className="section-head">
      <div>
        <h2>{title}</h2>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function SearchBox({ value, onChange, placeholder = "Search..." }) {
  return (
    <div className="table-search">
      <Search size={16} />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}

export function FormField({
  id,
  label,
  required,
  error,
  touched,
  children,
  helperText,
}) {
  const hasError = Boolean(error && (touched || touched === undefined));
  return (
    <div className={`form-group ${hasError ? "has-error" : ""}`}>
      {label && (
        <label htmlFor={id}>
          {label}
          {required && <span style={{ color: "var(--danger)", marginLeft: "4px" }}>*</span>}
        </label>
      )}
      {children}
      {hasError && (
        <small
          role="alert"
          style={{
            color: "var(--danger)",
            fontSize: "10px",
            display: "block",
            marginTop: "4px",
            fontWeight: 500,
          }}
        >
          {error}
        </small>
      )}
      {!hasError && helperText && (
        <small style={{ color: "var(--muted)", fontSize: "9px", display: "block", marginTop: "3px" }}>
          {helperText}
        </small>
      )}
    </div>
  );
}

export function Input({
  id,
  name,
  label,
  icon,
  value,
  onChange,
  onBlur,
  type = "text",
  placeholder,
  required,
  error,
  touched,
  helperText,
  disabled = false,
  className = "",
  inputRef,
  ...props
}) {
  const hasError = Boolean(error && (touched || touched === undefined));

  const handleChange = (e) => {
    if (typeof onChange === "function") {
      const val = e && e.target ? e.target.value : e;
      try {
        const valObj = new String(val);
        valObj.target = { value: String(val), name: name || id };
        valObj.currentTarget = valObj.target;
        onChange(valObj, e);
      } catch {
        onChange(val, e);
      }
    }
  };

  const inputElement = (
    <div
      className={`input-wrap ${hasError ? "input-error" : ""} ${className}`}
      style={
        hasError
          ? { borderColor: "var(--danger)", boxShadow: "0 0 0 1px var(--danger)" }
          : undefined
      }
    >
      {icon}
      <input
        ref={inputRef}
        id={id}
        name={name}
        type={type}
        value={value ?? ""}
        onChange={handleChange}
        onBlur={onBlur}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        aria-invalid={hasError ? "true" : "false"}
        {...props}
      />
    </div>
  );

  if (label) {
    return (
      <FormField
        id={id}
        label={label}
        required={required}
        error={error}
        touched={touched}
        helperText={helperText}
      >
        {inputElement}
      </FormField>
    );
  }

  return (
    <>
      {inputElement}
      {hasError && (
        <small
          role="alert"
          style={{
            color: "var(--danger)",
            fontSize: "10px",
            display: "block",
            marginTop: "4px",
            fontWeight: 500,
          }}
        >
          {error}
        </small>
      )}
    </>
  );
}

export function Select({
  id,
  name,
  label,
  icon,
  value,
  onChange,
  onBlur,
  options = [],
  required,
  error,
  touched,
  helperText,
  disabled = false,
  className = "",
  ...props
}) {
  const hasError = Boolean(error && (touched || touched === undefined));

  const selectElement = (
    <div
      className={`input-wrap ${hasError ? "input-error" : ""} ${className}`}
      style={
        hasError
          ? { borderColor: "var(--danger)", boxShadow: "0 0 0 1px var(--danger)" }
          : undefined
      }
    >
      {icon}
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        required={required}
        disabled={disabled}
        aria-invalid={hasError ? "true" : "false"}
        {...props}
      >
        {options.map((opt) => {
          const val = typeof opt === "object" ? opt.value : opt;
          const lbl = typeof opt === "object" ? opt.label : opt;
          return (
            <option key={val} value={val}>
              {lbl}
            </option>
          );
        })}
      </select>
    </div>
  );

  if (label) {
    return (
      <FormField
        id={id}
        label={label}
        required={required}
        error={error}
        touched={touched}
        helperText={helperText}
      >
        {selectElement}
      </FormField>
    );
  }

  return (
    <>
      {selectElement}
      {hasError && (
        <small
          role="alert"
          style={{
            color: "var(--danger)",
            fontSize: "10px",
            display: "block",
            marginTop: "4px",
          }}
        >
          {error}
        </small>
      )}
    </>
  );
}

export function Textarea({
  id,
  name,
  label,
  value,
  onChange,
  onBlur,
  rows = 3,
  placeholder,
  required,
  error,
  touched,
  helperText,
  disabled = false,
  ...props
}) {
  const hasError = Boolean(error && (touched || touched === undefined));

  const textareaElement = (
    <textarea
      id={id}
      name={name}
      rows={rows}
      value={value ?? ""}
      onChange={onChange}
      onBlur={onBlur}
      placeholder={placeholder}
      required={required}
      disabled={disabled}
      aria-invalid={hasError ? "true" : "false"}
      style={
        hasError
          ? { borderColor: "var(--danger)", boxShadow: "0 0 0 1px var(--danger)" }
          : undefined
      }
      {...props}
    />
  );

  if (label) {
    return (
      <FormField
        id={id}
        label={label}
        required={required}
        error={error}
        touched={touched}
        helperText={helperText}
      >
        {textareaElement}
      </FormField>
    );
  }

  return textareaElement;
}

export function AuthHead({ title, desc }) {
  return (
    <div className="auth-head">
      <div className="mobile-auth-logo">
        <Wifi size={21} />
      </div>
      <h2>{title}</h2>
      <p>{desc}</p>
    </div>
  );
}

export function AuthLayout({ children, title, desc, features = [] }) {
  return (
    <div className="auth-page">
      <div className="auth-glow one" />
      <div className="auth-glow two" />
      <aside className="auth-brand">
        <div className="brand">
          <div className="brand-mark">
            <Wifi size={24} />
          </div>
          NetFlow
        </div>
        <div className="auth-hero">
          <div className="auth-symbol">
            <Activity size={27} />
          </div>
          <h1>{title}</h1>
          <p>{desc}</p>
          {features.map((f, i) => (
            <div className="auth-feature" key={i}>
              <CheckCircle2 size={18} />
              {f}
            </div>
          ))}
        </div>
        <small>NetFlow • Major Project Edition</small>
      </aside>
      <main className="auth-form">{children}</main>
    </div>
  );
}
