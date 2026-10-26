import React from "react";
import FormField from "./FormField";

/**
 * Reusable Controlled SelectField Component
 */
export default function SelectField({
  label,
  name,
  value,
  onChange,
  onBlur,
  error,
  touched,
  required,
  helperText,
  options = [],
  placeholder,
  disabled = false,
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
      <div className={`reusable-select-wrap ${hasError ? "input-error" : ""}`}>
        <select
          id={name}
          name={name}
          value={value ?? ""}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          aria-invalid={hasError}
          aria-describedby={
            hasError ? `${name}-error` : helperText ? `${name}-helper` : undefined
          }
          className="reusable-select"
          {...rest}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt) => {
            const optVal = typeof opt === "object" ? opt.value : opt;
            const optLabel = typeof opt === "object" ? opt.label : opt;
            return (
              <option key={optVal} value={optVal}>
                {optLabel}
              </option>
            );
          })}
        </select>
      </div>
    </FormField>
  );
}
