export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePhone = (phone) => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
  return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''))
}

export const validateUrl = (url) => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

export const validateSlug = (slug) => {
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
  return slugRegex.test(slug)
}

export const sanitizeString = (str) => {
  if (typeof str !== 'string') return ''
  return str.trim().replace(/[<>]/g, '')
}

export const validateRequired = (value) => {
  return value !== null && value !== undefined && value !== ''
}

export const validateMinLength = (value, minLength) => {
  return typeof value === 'string' && value.length >= minLength
}

export const validateMaxLength = (value, maxLength) => {
  return typeof value === 'string' && value.length <= maxLength
}

export const validateAppointmentData = (data) => {
  const errors = {}
  
  if (!validateRequired(data.name)) {
    errors.name = 'Name is required'
  } else if (!validateMinLength(data.name, 2)) {
    errors.name = 'Name must be at least 2 characters'
  }
  
  if (!validateRequired(data.email)) {
    errors.email = 'Email is required'
  } else if (!validateEmail(data.email)) {
    errors.email = 'Please enter a valid email address'
  }
  
  if (data.phone && !validatePhone(data.phone)) {
    errors.phone = 'Please enter a valid phone number'
  }
  
  if (!validateRequired(data.subject)) {
    errors.subject = 'Subject is required'
  } else if (!validateMinLength(data.subject, 5)) {
    errors.subject = 'Subject must be at least 5 characters'
  }
  
  if (!validateRequired(data.slot_id)) {
    errors.slot_id = 'Please select a time slot'
  }
  
  if (!validateRequired(data.appointment_date)) {
    errors.appointment_date = 'Please select an appointment date'
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

export const validateContactData = (data) => {
  const errors = {}
  
  if (!validateRequired(data.name)) {
    errors.name = 'Name is required'
  } else if (!validateMinLength(data.name, 2)) {
    errors.name = 'Name must be at least 2 characters'
  }
  
  if (!validateRequired(data.email)) {
    errors.email = 'Email is required'
  } else if (!validateEmail(data.email)) {
    errors.email = 'Please enter a valid email address'
  }
  
  if (!validateRequired(data.subject)) {
    errors.subject = 'Subject is required'
  } else if (!validateMinLength(data.subject, 5)) {
    errors.subject = 'Subject must be at least 5 characters'
  }
  
  if (!validateRequired(data.message)) {
    errors.message = 'Message is required'
  } else if (!validateMinLength(data.message, 10)) {
    errors.message = 'Message must be at least 10 characters'
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}