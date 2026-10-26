import React from "react";
import FormField from "./FormField";

/**
 * Reusable Controlled TextInput Component
 */
export default function TextInput({
  label,
  name,
  value,
  onChange,
  onBlur,
  error,
  touched,
  required,
  helperText,
  placeholder,
  type = "text",
  icon: Icon,
  disabled = false,
  autoComplete,
  className = "",
  ...rest
}) {
  const hasError = touched && Boolean(error);

  return (
    <FormField
      label={label}
      name={name}
      error={error}
      touched={touched}
      required={required}
      helperText={helperText}
      className={className}
    >
      <div className={`reusable-input-wrap ${hasError ? "input-error" : ""}`}>
        {Icon && (
          <span className="input-prefix-icon" aria-hidden="true">
            <Icon size={16} />
          </span>
        )}
        <input
          id={name}
          name={name}
          type={type}
          value={value ?? ""}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete={autoComplete}
          aria-invalid={hasError}
          aria-describedby={
            hasError ? `${name}-error` : helperText ? `${name}-helper` : undefined
          }
          className="reusable-input"
          {...rest}
        />
      </div>
    </FormField>
  );
}
