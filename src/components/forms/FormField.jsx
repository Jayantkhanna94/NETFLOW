import React from "react";
import { AlertCircle } from "../Icons";

/**
 * Reusable FormField container component providing:
 * - Label with required indicator (*)
 * - Helper text / hint
 * - Accessible error display with Alert icon
 */
export default function FormField({
  label,
  name,
  error,
  touched,
  required = false,
  helperText,
  children,
  className = "",
}) {
  const hasError = touched && Boolean(error);

  return (
    <div className={`form-field-group ${hasError ? "has-error" : ""} ${className}`}>
      {label && (
        <label htmlFor={name} className="form-field-label">
          {label}
          {required && <span className="required-star" aria-hidden="true">*</span>}
        </label>
      )}

      <div className="form-field-control">
        {children}
      </div>

      {hasError ? (
        <div className="field-error-message" role="alert" id={`${name}-error`}>
          <AlertCircle size={13} />
          <span>{error}</span>
        </div>
      ) : helperText ? (
        <small className="field-helper-text" id={`${name}-helper`}>
          {helperText}
        </small>
      ) : null}
    </div>
  );
}
