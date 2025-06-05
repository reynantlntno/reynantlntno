const validation = {
  // Email validation
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  },

  // Phone validation
  isValidPhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''))
  },

  // URL validation
  isValidUrl(url) {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  },

  // Slug validation
  isValidSlug(slug) {
    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
    return slugRegex.test(slug)
  },

  // Sanitize string input
  sanitizeString(str) {
    if (typeof str !== 'string') return ''
    return str.trim().replace(/[<>]/g, '')
  },

  // Required field validation
  isRequired(value) {
    return value !== null && value !== undefined && value !== ''
  },

  // Minimum length validation
  hasMinLength(value, minLength) {
    return typeof value === 'string' && value.length >= minLength
  },

  // Maximum length validation
  hasMaxLength(value, maxLength) {
    return typeof value === 'string' && value.length <= maxLength
  },

  // Blog post validation
  validateBlogPost(data) {
    const errors = {}

    if (!this.isRequired(data.title)) {
      errors.title = 'Title is required'
    } else if (!this.hasMinLength(data.title, 3)) {
      errors.title = 'Title must be at least 3 characters'
    }

    if (!this.isRequired(data.slug)) {
      errors.slug = 'Slug is required'
    } else if (!this.isValidSlug(data.slug)) {
      errors.slug = 'Slug must contain only lowercase letters, numbers, and hyphens'
    }

    if (!this.isRequired(data.content)) {
      errors.content = 'Content is required'
    } else if (!this.hasMinLength(data.content, 10)) {
      errors.content = 'Content must be at least 10 characters'
    }

    if (data.image_url && !this.isValidUrl(data.image_url)) {
      errors.image_url = 'Image URL must be a valid URL'
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    }
  },

  // Project validation
  validateProject(data) {
    const errors = {}

    if (!this.isRequired(data.title)) {
      errors.title = 'Title is required'
    } else if (!this.hasMinLength(data.title, 3)) {
      errors.title = 'Title must be at least 3 characters'
    }

    if (!this.isRequired(data.slug)) {
      errors.slug = 'Slug is required'
    } else if (!this.isValidSlug(data.slug)) {
      errors.slug = 'Slug must contain only lowercase letters, numbers, and hyphens'
    }

    if (!this.isRequired(data.description)) {
      errors.description = 'Description is required'
    } else if (!this.hasMinLength(data.description, 10)) {
      errors.description = 'Description must be at least 10 characters'
    }

    if (data.thumbnail_url && !this.isValidUrl(data.thumbnail_url)) {
      errors.thumbnail_url = 'Thumbnail URL must be a valid URL'
    }

    if (data.github_url && !this.isValidUrl(data.github_url)) {
      errors.github_url = 'GitHub URL must be a valid URL'
    }

    if (data.demo_url && !this.isValidUrl(data.demo_url)) {
      errors.demo_url = 'Demo URL must be a valid URL'
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    }
  },

  // Appointment validation
  validateAppointment(data) {
    const errors = {}

    if (!this.isRequired(data.name)) {
      errors.name = 'Name is required'
    } else if (!this.hasMinLength(data.name, 2)) {
      errors.name = 'Name must be at least 2 characters'
    }

    if (!this.isRequired(data.email)) {
      errors.email = 'Email is required'
    } else if (!this.isValidEmail(data.email)) {
      errors.email = 'Please enter a valid email address'
    }

    if (data.phone && !this.isValidPhone(data.phone)) {
      errors.phone = 'Please enter a valid phone number'
    }

    if (!this.isRequired(data.subject)) {
      errors.subject = 'Subject is required'
    } else if (!this.hasMinLength(data.subject, 5)) {
      errors.subject = 'Subject must be at least 5 characters'
    }

    if (!this.isRequired(data.slot_id)) {
      errors.slot_id = 'Please select a time slot'
    }

    if (!this.isRequired(data.appointment_date)) {
      errors.appointment_date = 'Please select an appointment date'
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    }
  },

  // Contact form validation
  validateContact(data) {
    const errors = {}

    if (!this.isRequired(data.name)) {
      errors.name = 'Name is required'
    } else if (!this.hasMinLength(data.name, 2)) {
      errors.name = 'Name must be at least 2 characters'
    }

    if (!this.isRequired(data.email)) {
      errors.email = 'Email is required'
    } else if (!this.isValidEmail(data.email)) {
      errors.email = 'Please enter a valid email address'
    }

    if (!this.isRequired(data.subject)) {
      errors.subject = 'Subject is required'
    } else if (!this.hasMinLength(data.subject, 5)) {
      errors.subject = 'Subject must be at least 5 characters'
    }

    if (!this.isRequired(data.message)) {
      errors.message = 'Message is required'
    } else if (!this.hasMinLength(data.message, 10)) {
      errors.message = 'Message must be at least 10 characters'
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    }
  },

  // Newsletter subscription validation
  validateNewsletter(data) {
    const errors = {}

    if (!this.isRequired(data.email)) {
      errors.email = 'Email is required'
    } else if (!this.isValidEmail(data.email)) {
      errors.email = 'Please enter a valid email address'
    }

    if (data.name && !this.hasMinLength(data.name, 2)) {
      errors.name = 'Name must be at least 2 characters'
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    }
  }
}

module.exports = { validation }