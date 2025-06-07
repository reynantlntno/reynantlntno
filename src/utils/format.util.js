import MarkdownIt from 'markdown-it'

// Initialize markdown parser
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  breaks: true
})

// Format markdown content to HTML
export const formatMarkdown = (content) => {
  if (!content) return ''
  try {
    return md.render(content)
  } catch (error) {
    console.error('Markdown formatting error:', error)
    return content
  }
}

// Truncate text with ellipsis
export const truncateText = (text, maxLength = 100, suffix = '...') => {
  if (!text || text.length <= maxLength) return text
  return text.substring(0, maxLength).trim() + suffix
}

// Format reading time
export const formatReadingTime = (minutes) => {
  if (!minutes || minutes < 1) return '< 1 min read'
  if (minutes === 1) return '1 min read'
  return `${minutes} min read`
}

// Capitalize first letter
export const capitalize = (str) => {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

// Convert camelCase to Title Case
export const camelToTitle = (str) => {
  if (!str) return ''
  return str
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (match) => match.toUpperCase())
    .trim()
}

// Format file size
export const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Format number with commas
export const formatNumber = (num) => {
  if (num === null || num === undefined) return '0'
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

// Generate excerpt from content
export const generateExcerpt = (content, maxLength = 160) => {
  if (!content) return ''
  
  // Strip HTML tags if present
  const stripped = content.replace(/<[^>]*>/g, '')
  
  // Truncate and ensure it ends at a word boundary
  if (stripped.length <= maxLength) return stripped
  
  const truncated = stripped.substring(0, maxLength)
  const lastSpace = truncated.lastIndexOf(' ')
  
  return (lastSpace > 0 ? truncated.substring(0, lastSpace) : truncated) + '...'
}

// Format currency (if needed for future features)
export const formatCurrency = (amount, currency = 'USD') => {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency
    }).format(amount)
  } catch (error) {
    return `$${amount}`
  }
}

// Slug generation
export const generateSlug = (text) => {
  if (!text) return ''
  
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// Format tags array for display
export const formatTags = (tags) => {
  if (!Array.isArray(tags)) return []
  return tags.filter(Boolean).map(tag => tag.trim())
}

// Format status for display
export const formatStatus = (status) => {
  if (!status) return ''
  
  const statusMap = {
    pending: 'Pending',
    confirmed: 'Confirmed',
    cancelled: 'Cancelled',
    completed: 'Completed',
    active: 'Active',
    inactive: 'Inactive'
  }
  
  return statusMap[status.toLowerCase()] || capitalize(status)
}

// Extract plain text from HTML
export const stripHtml = (html) => {
  if (!html) return ''
  
  // Create a temporary element to parse HTML
  const temp = document.createElement('div')
  temp.innerHTML = html
  return temp.textContent || temp.innerText || ''
}

// Format URL for display (remove protocol)
export const formatUrl = (url) => {
  if (!url) return ''
  return url.replace(/^https?:\/\//, '')
}

// Create initials from name
export const createInitials = (name) => {
  if (!name) return ''
  
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('')
    .substring(0, 2)
}