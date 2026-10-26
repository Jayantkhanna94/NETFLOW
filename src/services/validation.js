/**
 * Reusable Form Validation Strategies & Rules
 * Covers Front End Engineering-II form handling requirements.
 */

export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const IP_REGEX = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
export const PHONE_REGEX = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{7,12}$/;

/**
 * Validates required field
 */
export function validateRequired(value, fieldName = "This field") {
  if (value === undefined || value === null || String(value).trim() === "") {
    return `${fieldName} is required`;
  }
  return null;
}

/**
 * Validates email address format
 */
export function validateEmail(email) {
  if (!email || !String(email).trim()) {
    return "Email address is required";
  }
  if (!EMAIL_REGEX.test(String(email).trim())) {
    return "Please enter a valid email address (e.g. name@college.edu)";
  }
  return null;
}

/**
 * Validates password with optional length constraint
 */
export function validatePassword(password, minLength = 6) {
  if (!password) {
    return "Password is required";
  }
  if (password.length < minLength) {
    return `Password must be at least ${minLength} characters`;
  }
  return null;
}

/**
 * Validates password confirmation match
 */
export function validatePasswordMatch(password, confirm) {
  if (!confirm) {
    return "Please confirm your password";
  }
  if (password !== confirm) {
    return "Passwords do not match";
  }
  return null;
}

/**
 * Validates IPv4 address string
 */
export function validateIP(ip) {
  if (!ip || !String(ip).trim()) {
    return "IP address is required";
  }
  if (!IP_REGEX.test(String(ip).trim())) {
    return "Please enter a valid IPv4 address (e.g. 10.10.0.1)";
  }
  return null;
}

/**
 * Validates positive numeric capacity
 */
export function validateCapacity(capacity) {
  const num = Number(capacity);
  if (isNaN(num) || num <= 0) {
    return "Capacity must be a positive number greater than 0";
  }
  if (num > 10000) {
    return "Capacity exceeds maximum allowed limit";
  }
  return null;
}

/**
 * General multi-field validator returning { isValid, errors }
 */
export function validateForm(values, rules) {
  const errors = {};
  for (const [field, validators] of Object.entries(rules)) {
    const fieldValidators = Array.isArray(validators) ? validators : [validators];
    for (const validator of fieldValidators) {
      const err = validator(values[field], values);
      if (err) {
        errors[field] = err;
        break; // Stop at first error for this field
      }
    }
  }
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
