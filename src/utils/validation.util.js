// Client-side validation utilities

export const validators = {
  // Email validation
  email: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email?.trim() || '')
  },

  // Phone validation (optional field)
  phone: (phone) => {
    if (!phone?.trim()) return true // Optional
    const phoneRegex = /^[\+]?[1-9][\d\s\-\(\)]{7,15}$/
    return phoneRegex.test(phone.trim())
  },

  // Name validation
  name: (name) => {
    const trimmed = name?.trim() || ''
    return trimmed.length >= 2 && trimmed.length <= 255
  },

  // Subject/title validation
  subject: (subject) => {
    const trimmed = subject?.trim() || ''
    return trimmed.length >= 3 && trimmed.length <= 255
  },

  // Message/content validation
  message: (message) => {
    const trimmed = message?.trim() || ''
    return trimmed.length >= 10 && trimmed.length <= 5000
  },

  // Required field validation
  required: (value) => {
    if (typeof value === 'string') {
      return value.trim().length > 0
    }
    return value !== null && value !== undefined && value !== ''
  },

  // Date validation
  date: (date) => {
    if (!date) return false
    const dateObj = new Date(date)
    return !isNaN(dateObj.getTime())
  },

  // Reference code validation
  referenceCode: (code) => {
    const codeRegex = /^[A-Z0-9]{8,20}$/
    return codeRegex.test(code?.trim() || '')
  },

  // URL validation (optional)
  url: (url) => {
    if (!url?.trim()) return true // Optional
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }
}

// Validation error messages
export const validationMessages = {
  email: 'Please enter a valid email address',
  phone: 'Please enter a valid phone number',
  name: 'Name must be between 2-255 characters',
  subject: 'Subject must be between 3-255 characters',
  message: 'Message must be between 10-5000 characters',
  required: 'This field is required',
  date: 'Please enter a valid date',
  referenceCode: 'Reference code must be 8-20 alphanumeric characters',
  url: 'Please enter a valid URL'
}

// Validate single field
export const validateField = (value, rules) => {
  const errors = []
  
  for (const rule of rules) {
    if (typeof rule === 'string') {
      // Simple rule name
      if (!validators[rule](value)) {
        errors.push(validationMessages[rule])
      }
    } else if (typeof rule === 'object') {
      // Rule with custom message
      const { validator, message } = rule
      if (!validators[validator](value)) {
        errors.push(message || validationMessages[validator])
      }
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

// Validate entire form
export const validateForm = (data, schema) => {
  const errors = {}
  let isValid = true
  
  for (const [field, rules] of Object.entries(schema)) {
    const validation = validateField(data[field], rules)
    if (!validation.isValid) {
      errors[field] = validation.errors
      isValid = false
    }
  }
  
  return { isValid, errors }
}

// Form validation schemas
export const schemas = {
  contact: {
    name: ['required', 'name'],
    email: ['required', 'email'],
    subject: ['required', 'subject'],
    message: ['required', 'message']
  },
  
  appointment: {
    name: ['required', 'name'],
    email: ['required', 'email'],
    phone: ['phone'], // Optional
    subject: ['required', 'subject'],
    message: ['message'], // Optional but if provided, validate
    appointment_date: ['required', 'date'],
    slot_id: ['required']
  },
  
  newsletter: {
    email: ['required', 'email'],
    name: ['name'] // Optional
  },
  
  tracking: {
    referenceCode: ['required', 'referenceCode']
  }
}

// Sanitize input
export const sanitize = {
  text: (input) => {
    if (typeof input !== 'string') return ''
    return input.trim().replace(/[<>]/g, '')
  },
  
  email: (input) => {
    if (typeof input !== 'string') return ''
    return input.trim().toLowerCase()
  },
  
  phone: (input) => {
    if (typeof input !== 'string') return ''
    return input.trim().replace(/[^\d\+\-\(\)\s]/g, '')
  },
  
  referenceCode: (input) => {
    if (typeof input !== 'string') return ''
    return input.trim().toUpperCase().replace(/[^A-Z0-9]/g, '')
  }
}