import React from "react";
import FormField from "./FormField";

/**
 * Reusable Controlled TextareaField Component with Character Count
 */
export default function TextareaField({
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
  rows = 3,
  maxLength,
  disabled = false,
  className = "",
  ...rest
}) {
  const hasError = touched && Boolean(error);
  const currentLength = (value ?? "").length;

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
      <div className={`reusable-textarea-wrap ${hasError ? "input-error" : ""}`}>
        <textarea
          id={name}
          name={name}
          value={value ?? ""}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          rows={rows}
          maxLength={maxLength}
          disabled={disabled}
          aria-invalid={hasError}
          aria-describedby={
            hasError ? `${name}-error` : helperText ? `${name}-helper` : undefined
          }
          className="reusable-textarea"
          {...rest}
        />
        {maxLength && (
          <div className="char-count">
            {currentLength} / {maxLength}
          </div>
        )}
      </div>
    </FormField>
  );
}
