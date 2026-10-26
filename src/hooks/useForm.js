import { useState, useCallback } from "react";

/**
 * Common validation rule helpers
 */
export const validators = {
  required: (message = "This field is required.") => (val) => {
    if (val === undefined || val === null || String(val).trim() === "") {
      return message;
    }
    return null;
  },

  email: (message = "Please enter a valid email address.") => (val) => {
    if (!val) return null;
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(String(val).trim()) ? null : message;
  },

  // Validates standard IPv4 address (0.0.0.0 to 255.255.255.255)
  ipv4: (message = "Please enter a valid IPv4 address (e.g. 10.10.0.1).") => (val) => {
    if (!val) return null;
    const regex =
      /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return regex.test(String(val).trim()) ? null : message;
  },

  minLength: (min, message) => (val) => {
    if (!val) return null;
    return String(val).trim().length >= min
      ? null
      : message || `Must be at least ${min} characters.`;
  },

  maxLength: (max, message) => (val) => {
    if (!val) return null;
    return String(val).trim().length <= max
      ? null
      : message || `Cannot exceed ${max} characters.`;
  },

  minNumber: (min, message) => (val) => {
    if (val === "" || val === null || val === undefined) return null;
    const num = Number(val);
    return !isNaN(num) && num >= min
      ? null
      : message || `Value must be at least ${min}.`;
  },

  pattern: (regex, message = "Invalid format.") => (val) => {
    if (!val) return null;
    return regex.test(String(val)) ? null : message;
  },
};

/**
 * Custom form hook with validation strategies:
 * - Real-time validation on change
 * - On-blur validation (touched fields)
 * - Validation on submit
 * - Dynamic error clearing
 *
 * @param {Object} initialValues - Initial field values
 * @param {Object} validationRules - Mapping of fieldName -> array of validator functions
 * @param {Function} onSubmit - Callback function executed when form is valid
 */
export function useForm({ initialValues = {}, validationRules = {}, onSubmit }) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validate a single field
  const validateField = useCallback(
    (fieldName, value) => {
      const fieldRules = validationRules[fieldName];
      if (!fieldRules || !Array.isArray(fieldRules)) return null;

      for (const rule of fieldRules) {
        const error = rule(value, values);
        if (error) return error;
      }
      return null;
    },
    [validationRules, values]
  );

  // Change handler for inputs
  const handleChange = useCallback(
    (e) => {
      const { name, value, type, checked } = e.target;
      const val = type === "checkbox" ? checked : value;

      setValues((prev) => {
        const nextValues = { ...prev, [name]: val };
        // If the field was already touched, perform real-time validation on edit
        if (touched[name]) {
          const fieldError = validateField(name, val);
          setErrors((prevErr) => ({
            ...prevErr,
            [name]: fieldError,
          }));
        }
        return nextValues;
      });
    },
    [touched, validateField]
  );

  // Blur handler for inputs (marks field as touched and triggers validation)
  const handleBlur = useCallback(
    (e) => {
      const { name, value, type, checked } = e.target;
      const val = type === "checkbox" ? checked : value;

      setTouched((prev) => ({ ...prev, [name]: true }));
      const fieldError = validateField(name, val);
      setErrors((prev) => ({
        ...prev,
        [name]: fieldError,
      }));
    },
    [validateField]
  );

  // Validate all fields at once (e.g. before submit)
  const validateAll = useCallback(() => {
    const newErrors = {};
    const allTouched = {};
    let isValid = true;

    Object.keys(validationRules).forEach((field) => {
      allTouched[field] = true;
      const err = validateField(field, values[field]);
      if (err) {
        newErrors[field] = err;
        isValid = false;
      }
    });

    setTouched((prev) => ({ ...prev, ...allTouched }));
    setErrors(newErrors);
    return isValid;
  }, [validationRules, validateField, values]);

  // Form submit handler
  const handleSubmit = useCallback(
    async (e) => {
      if (e && e.preventDefault) e.preventDefault();
      setIsSubmitting(true);

      const isValid = validateAll();
      if (!isValid) {
        setIsSubmitting(false);
        return false;
      }

      try {
        if (onSubmit) {
          await onSubmit(values);
        }
        setIsSubmitting(false);
        return true;
      } catch (err) {
        setIsSubmitting(false);
        return false;
      }
    },
    [validateAll, onSubmit, values]
  );

  // Reset form to initial state
  const resetForm = useCallback(
    (newValues) => {
      setValues(newValues || initialValues);
      setErrors({});
      setTouched({});
      setIsSubmitting(false);
    },
    [initialValues]
  );

  // Set specific field value programmatically
  const setFieldValue = useCallback((fieldName, value) => {
    setValues((prev) => ({ ...prev, [fieldName]: value }));
  }, []);

  const isValid = Object.values(errors).every((err) => !err);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setFieldValue,
    validateAll,
  };
}
