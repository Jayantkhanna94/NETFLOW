import React from "react";
import { AlertCircle } from "../Icons";

/**
 * Reusable Controlled CheckboxField Component
 */
export default function CheckboxField({
  label,
  name,
  checked,
  onChange,
  onBlur,
  error,
  touched,
  required,
  disabled = false,
  className = "",
  description,
  ...rest
}) {
  const hasError = touched && Boolean(error);

  return (
    <div className={`reusable-checkbox-wrap ${hasError ? "has-error" : ""} ${className}`}>
      <label className="checkbox-label" htmlFor={name}>
        <input
          id={name}
          name={name}
          type="checkbox"
          checked={Boolean(checked)}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          aria-invalid={hasError}
          className="reusable-checkbox-input"
          {...rest}
        />
        <span className="checkbox-custom" />
        <span className="checkbox-text">
          {label}
          {required && <span className="required-star">*</span>}
          {description && <small className="checkbox-desc">{description}</small>}
        </span>
      </label>

      {hasError && (
        <div className="field-error-message" role="alert" id={`${name}-error`}>
          <AlertCircle size={13} />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
