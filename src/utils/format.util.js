export const formatNumber = (num, options = {}) => {
  const defaultOptions = {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }
  
  return new Intl.NumberFormat('en-US', { ...defaultOptions, ...options }).format(num)
}

export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency
  }).format(amount)
}

export const formatPercentage = (value, decimals = 1) => {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value / 100)
}

export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export const truncateText = (text, maxLength = 100, suffix = '...') => {
  if (!text || text.length <= maxLength) return text
  return text.substr(0, maxLength).trim() + suffix
}

export const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '')
}

export const capitalizeFirst = (str) => {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export const capitalizeWords = (str) => {
  if (!str) return ''
  return str.split(' ').map(word => capitalizeFirst(word)).join(' ')
}

export const camelCaseToWords = (str) => {
  return str
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim()
}

export const formatPhoneNumber = (phoneNumber) => {
  const cleaned = phoneNumber.replace(/\D/g, '')
  
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
  }
  
  if (cleaned.length === 11 && cleaned[0] === '1') {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`
  }
  
  return phoneNumber
}

export const formatReadTime = (content) => {
  if (!content) return 0
  
  const wordsPerMinute = 200
  const words = content.trim().split(/\s+/).length
  const readTime = Math.ceil(words / wordsPerMinute)
  
  return readTime
}

export const extractMetaDescription = (content, maxLength = 160) => {
  if (!content) return ''
  
  // Remove markdown formatting
  const plainText = content
    .replace(/```[\s\S]*?```/g, '') // Remove code blocks
    .replace(/`[^`]*`/g, '') // Remove inline code
    .replace(/#{1,6}\s+/g, '') // Remove headers
    .replace(/\*\*([^*]+)\*\*/g, '$1') // Remove bold
    .replace(/\*([^*]+)\*/g, '$1') // Remove italic
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove links
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '') // Remove images
    .replace(/\n+/g, ' ') // Replace newlines with spaces
    .trim()
  
  return truncateText(plainText, maxLength)
}

export const formatReferenceCode = () => {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substr(2, 5)
  return `REF-${timestamp}-${random}`.toUpperCase()
}

export const maskEmail = (email) => {
  if (!email) return ''
  
  const [username, domain] = email.split('@')
  if (username.length <= 2) return email
  
  const maskedUsername = username[0] + '*'.repeat(username.length - 2) + username[username.length - 1]
  return `${maskedUsername}@${domain}`
}

export const formatTag = (tag) => {
  return tag.toLowerCase().replace(/\s+/g, '-')
}

export const parseTagsFromString = (tagString) => {
  if (!tagString) return []
  
  return tagString
    .split(',')
    .map(tag => tag.trim())
    .filter(tag => tag.length > 0)
    .map(tag => formatTag(tag))
}

export const formatTagsForDisplay = (tags) => {
  if (!Array.isArray(tags)) return []
  
  return tags.map(tag => capitalizeWords(tag.replace(/-/g, ' ')))
}