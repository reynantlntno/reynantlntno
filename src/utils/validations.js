/**
 * Validates an email address
 * @param {string} email - Email to validate
 * @returns {boolean} - Whether the email is valid
 */
export const isValidEmail = (email) => {
  const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return pattern.test(email);
};

/**
 * Validates that input is not empty
 * @param {string} value - Input to validate
 * @returns {boolean} - Whether the input is not empty
 */
export const isNotEmpty = (value) => {
  return value !== null && value !== undefined && value.trim() !== '';
};

/**
 * Validates that input has minimum length
 * @param {string} value - Input to validate
 * @param {number} minLength - Minimum length required
 * @returns {boolean} - Whether the input meets minimum length
 */
export const hasMinLength = (value, minLength) => {
  return value && value.length >= minLength;
};

/**
 * Validates a phone number (basic validation)
 * @param {string} phone - Phone number to validate
 * @returns {boolean} - Whether the phone number is valid
 */
export const isValidPhone = (phone) => {
  // Basic phone validation (accepts different formats)
  const pattern = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
  return pattern.test(phone.replace(/\s/g, ''));
};

/**
 * Validates that a date is in the future
 * @param {Date} date - Date to validate
 * @returns {boolean} - Whether the date is in the future
 */
export const isFutureDate = (date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date >= today;
};

/**
 * Creates a validation result object
 * @param {boolean} isValid - Whether validation passed
 * @param {string} message - Error message if validation failed
 * @returns {object} - Validation result
 */
export const createValidationResult = (isValid, message = '') => {
  return {
    isValid,
    message: isValid ? '' : message
  };
};

/**
 * Contact form validation
 * @param {object} formData - Form data to validate
 * @returns {object} - Validation results for each field
 */
export const validateContactForm = (formData) => {
  const errors = {};
  
  if (!isNotEmpty(formData.name)) {
    errors.name = 'Name is required';
  }
  
  if (!isNotEmpty(formData.email)) {
    errors.email = 'Email is required';
  } else if (!isValidEmail(formData.email)) {
    errors.email = 'Please enter a valid email address';
  }
  
  if (!isNotEmpty(formData.message)) {
    errors.message = 'Message is required';
  } else if (!hasMinLength(formData.message, 10)) {
    errors.message = 'Message must be at least 10 characters';
  }
  
  if (formData.phone && !isValidPhone(formData.phone)) {
    errors.phone = 'Please enter a valid phone number';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Appointment form validation
 * @param {object} formData - Form data to validate
 * @returns {object} - Validation results for each field
 */
export const validateAppointmentForm = (formData) => {
  const errors = {};
  
  if (!isNotEmpty(formData.name)) {
    errors.name = 'Name is required';
  }
  
  if (!isNotEmpty(formData.email)) {
    errors.email = 'Email is required';
  } else if (!isValidEmail(formData.email)) {
    errors.email = 'Please enter a valid email address';
  }
  
  if (!formData.date) {
    errors.date = 'Date is required';
  } else if (!isFutureDate(new Date(formData.date))) {
    errors.date = 'Please select a future date';
  }
  
  if (!formData.timeSlot) {
    errors.timeSlot = 'Time slot is required';
  }
  
  if (!isNotEmpty(formData.purpose)) {
    errors.purpose = 'Purpose is required';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};