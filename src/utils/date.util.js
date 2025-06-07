import { format, parseISO, isValid, formatDistanceToNow, isFuture, isPast, startOfDay, addDays } from 'date-fns'

// Format date for display
export const formatDate = (date, pattern = 'MMM dd, yyyy') => {
  try {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date
    if (!isValid(parsedDate)) return 'Invalid Date'
    return format(parsedDate, pattern)
  } catch (error) {
    console.error('Date formatting error:', error)
    return 'Invalid Date'
  }
}

// Format date and time for display
export const formatDateTime = (date) => {
  return formatDate(date, 'MMM dd, yyyy \'at\' h:mm a')
}

// Format relative time (e.g., "2 days ago")
export const formatRelativeTime = (date) => {
  try {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date
    if (!isValid(parsedDate)) return 'Invalid Date'
    return formatDistanceToNow(parsedDate, { addSuffix: true })
  } catch (error) {
    console.error('Relative time formatting error:', error)
    return 'Invalid Date'
  }
}

// Format date for HTML input (YYYY-MM-DD)
export const formatDateForInput = (date) => {
  if (!date) return null
  
  let d = date
  if (typeof date === 'string') {
    d = new Date(date)
  }
  
  // Create date in Philippines timezone (UTC+8)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  
  return `${year}-${month}-${day}`
}

// Format time for display (12-hour format)
export const formatTime = (timeString) => {
  if (!timeString) return ''
  
  // Parse time string (HH:mm format)
  const [hours, minutes] = timeString.split(':').map(Number)
  const date = new Date()
  date.setHours(hours, minutes, 0, 0)
  
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })
}

// Check if date is in the future
export const isFutureDate = (date) => {
  if (!date) return false
  
  const today = new Date()
  const checkDate = new Date(date)
  
  // Set both dates to start of day for comparison
  today.setHours(0, 0, 0, 0)
  checkDate.setHours(0, 0, 0, 0)
  
  return checkDate >= today
}

// Check if date is in the past
export const isPastDate = (date) => {
  try {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date
    return isValid(parsedDate) && isPast(parsedDate)
  } catch (error) {
    return false
  }
}

// Generate date range for calendar
export const generateDateRange = (startDate, days = 30) => {
  try {
    const start = startOfDay(startDate)
    const dates = []
    
    for (let i = 0; i < days; i++) {
      dates.push(addDays(start, i))
    }
    
    return dates
  } catch (error) {
    console.error('Date range generation error:', error)
    return []
  }
}

// Get day of week (0 = Sunday, 6 = Saturday)
export const getDayOfWeek = (date) => {
  try {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date
    if (!isValid(parsedDate)) return null
    return parsedDate.getDay()
  } catch (error) {
    return null
  }
}

// Check if date is today
export const isToday = (date) => {
  if (!date) return false
  
  const today = new Date()
  const checkDate = new Date(date)
  
  return today.getFullYear() === checkDate.getFullYear() &&
         today.getMonth() === checkDate.getMonth() &&
         today.getDate() === checkDate.getDate()
}