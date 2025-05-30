/**
 * Validates an email address
 * @param {string} email - The email address to validate
 * @returns {boolean} - Whether the email is valid
 */
export const isValidEmail = (email) => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

/**
 * Validates that a string is not empty
 * @param {string} value - The string to validate
 * @returns {boolean} - Whether the string is not empty
 */
export const isNotEmpty = (value) => {
  return value !== null && value !== undefined && value.trim() !== '';
};

/**
 * Validates that a value is within a minimum and maximum length
 * @param {string} value - The value to check
 * @param {number} min - The minimum length
 * @param {number} max - The maximum length
 * @returns {boolean} - Whether the value is within the length constraints
 */
export const isWithinLength = (value, min, max) => {
  return value.length >= min && value.length <= max;
};

/**
 * Validates a phone number format
 * @param {string} phone - The phone number to validate
 * @returns {boolean} - Whether the phone number is valid
 */
export const isValidPhone = (phone) => {
  // Allow various formats including international
  const re = /^(\+\d{1,3}[-\s]?)?\(?(\d{3})\)?[-.\s]?(\d{3})[-.\s]?(\d{4})$/;
  return re.test(String(phone));
};

/**
 * Validates a name (no numbers or special chars except spaces, hyphens, and apostrophes)
 * @param {string} name - The name to validate
 * @returns {boolean} - Whether the name is valid
 */
export const isValidName = (name) => {
  const re = /^[a-zA-ZÀ-ÖØ-öø-ÿ\s'-]+$/;
  return re.test(name);
};

/**
 * Sanitizes input to prevent XSS
 * @param {string} input - The input to sanitize
 * @returns {string} - The sanitized input
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};