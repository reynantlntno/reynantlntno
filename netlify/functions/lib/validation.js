// Comprehensive input validation utilities
export const validators = {
  email: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  },

  phone: (phone) => {
    if (!phone) return true // Optional field
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''))
  },

  slug: (slug) => {
    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
    return slugRegex.test(slug)
  },

  url: (url) => {
    if (!url) return true // Optional field
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  },

  name: (name) => {
    return name && name.trim().length >= 2 && name.trim().length <= 255
  },

  title: (title) => {
    return title && title.trim().length >= 3 && title.trim().length <= 255
  },

  content: (content) => {
    return content && content.trim().length >= 10
  },

  dateString: (dateStr) => {
    const date = new Date(dateStr)
    return !isNaN(date.getTime())
  },

  timeString: (timeStr) => {
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
    return timeRegex.test(timeStr)
  },

  referenceCode: (code) => {
    const codeRegex = /^[A-Z0-9]{8,20}$/
    return codeRegex.test(code)
  },

  json: (jsonStr) => {
    if (!jsonStr) return true
    try {
      JSON.parse(jsonStr)
      return true
    } catch {
      return false
    }
  }
}

// Sanitization functions
export const sanitizers = {
  html: (input) => {
    if (!input) return ''
    return input
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;')
  },

  trim: (input) => {
    return typeof input === 'string' ? input.trim() : input
  },

  slug: (input) => {
    if (!input) return ''
    return input
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
  },

  phone: (input) => {
    if (!input) return ''
    return input.replace(/[^\d\+\-\(\)\s]/g, '')
  },

  tags: (input) => {
    if (!input) return []
    if (Array.isArray(input)) {
      return input.map(tag => sanitizers.trim(tag)).filter(Boolean)
    }
    if (typeof input === 'string') {
      return input.split(',').map(tag => sanitizers.trim(tag)).filter(Boolean)
    }
    return []
  }
}

// Validation schemas for different entities
export const schemas = {
  blogPost: {
    title: { required: true, validator: validators.title, sanitizer: sanitizers.trim },
    slug: { required: true, validator: validators.slug, sanitizer: sanitizers.slug },
    summary: { required: false, sanitizer: sanitizers.trim },
    content: { required: true, validator: validators.content, sanitizer: sanitizers.trim },
    image_url: { required: false, validator: validators.url, sanitizer: sanitizers.trim },
    published: { required: false, validator: (val) => typeof val === 'boolean' },
    meta_title: { required: false, sanitizer: sanitizers.trim },
    meta_description: { required: false, sanitizer: sanitizers.trim },
    tags: { required: false, sanitizer: sanitizers.tags }
  },

  project: {
    title: { required: true, validator: validators.title, sanitizer: sanitizers.trim },
    slug: { required: true, validator: validators.slug, sanitizer: sanitizers.slug },
    description: { required: true, validator: validators.content, sanitizer: sanitizers.trim },
    content: { required: false, sanitizer: sanitizers.trim },
    thumbnail_url: { required: false, validator: validators.url, sanitizer: sanitizers.trim },
    github_url: { required: false, validator: validators.url, sanitizer: sanitizers.trim },
    demo_url: { required: false, validator: validators.url, sanitizer: sanitizers.trim },
    technologies: { required: false, sanitizer: sanitizers.tags },
    featured: { required: false, validator: (val) => typeof val === 'boolean' },
    display_order: { required: false, validator: (val) => Number.isInteger(val) && val >= 0 }
  },

  appointment: {
    name: { required: true, validator: validators.name, sanitizer: sanitizers.trim },
    email: { required: true, validator: validators.email, sanitizer: sanitizers.trim },
    phone: { required: false, validator: validators.phone, sanitizer: sanitizers.phone },
    subject: { required: true, validator: validators.title, sanitizer: sanitizers.trim },
    message: { required: false, sanitizer: sanitizers.trim },
    appointment_date: { required: true, validator: validators.dateString },
    slot_id: { required: true, validator: (val) => Number.isInteger(val) && val > 0 }
  },

  contact: {
    name: { required: true, validator: validators.name, sanitizer: sanitizers.trim },
    email: { required: true, validator: validators.email, sanitizer: sanitizers.trim },
    subject: { required: true, validator: validators.title, sanitizer: sanitizers.trim },
    message: { required: true, validator: validators.content, sanitizer: sanitizers.trim }
  },

  newsletter: {
    email: { required: true, validator: validators.email, sanitizer: sanitizers.trim },
    name: { required: false, validator: validators.name, sanitizer: sanitizers.trim }
  },

  content: {
    type: { required: true, validator: validators.name, sanitizer: sanitizers.trim },
    title: { required: false, sanitizer: sanitizers.trim },
    content: { required: true, validator: validators.content, sanitizer: sanitizers.trim },
    format: { required: true, validator: (val) => ['markdown', 'json', 'text'].includes(val) }
  },

  skill: {
    name: { required: true, validator: validators.name, sanitizer: sanitizers.trim },
    category: { required: true, validator: validators.name, sanitizer: sanitizers.trim },
    proficiency: { required: true, validator: (val) => Number.isInteger(val) && val >= 1 && val <= 10 },
    icon: { required: false, validator: validators.url, sanitizer: sanitizers.trim },
    description: { required: false, sanitizer: sanitizers.trim },
    display_order: { required: false, validator: (val) => Number.isInteger(val) && val >= 0 }
  }
}

// Main validation function
export const validateData = (data, schema) => {
  const errors = []
  const sanitized = {}

  for (const [field, rules] of Object.entries(schema)) {
    const value = data[field]

    // Check required fields
    if (rules.required && (value === undefined || value === null || value === '')) {
      errors.push(`${field} is required`)
      continue
    }

    // Skip validation if field is not required and empty
    if (!rules.required && (value === undefined || value === null || value === '')) {
      continue
    }

    // Sanitize value
    let sanitizedValue = value
    if (rules.sanitizer) {
      sanitizedValue = rules.sanitizer(value)
    }

    // Validate sanitized value
    if (rules.validator && !rules.validator(sanitizedValue)) {
      errors.push(`${field} is invalid`)
      continue
    }

    sanitized[field] = sanitizedValue
  }

  return {
    isValid: errors.length === 0,
    errors,
    data: sanitized
  }
}

// IP validation for rate limiting
export const isValidIP = (ip) => {
  const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
  const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/
  return ipv4Regex.test(ip) || ipv6Regex.test(ip)
}

// Generate unique reference code
export const generateReferenceCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  for (let i = 0; i < 12; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

// Calculate reading time for blog posts
export const calculateReadingTime = (content) => {
  if (!content) return 0
  const wordsPerMinute = 200
  const words = content.trim().split(/\s+/).length
  return Math.ceil(words / wordsPerMinute)
}