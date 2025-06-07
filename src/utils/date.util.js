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
  try {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date
    if (!isValid(parsedDate)) return ''
    return format(parsedDate, 'yyyy-MM-dd')
  } catch (error) {
    console.error('Date input formatting error:', error)
    return ''
  }
}

// Format time for display (12-hour format)
export const formatTime = (timeString) => {
  if (!timeString) return ''
  
  try {
    // Handle HH:MM or HH:MM:SS format
    const [hours, minutes] = timeString.split(':')
    const hour = parseInt(hours, 10)
    const min = minutes || '00'
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    
    return `${displayHour}:${min} ${ampm}`
  } catch (error) {
    console.error('Time formatting error:', error)
    return timeString
  }
}

// Check if date is in the future
export const isFutureDate = (date) => {
  try {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date
    return isValid(parsedDate) && isFuture(parsedDate)
  } catch (error) {
    return false
  }
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
  try {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date
    const today = new Date()
    return isValid(parsedDate) && 
           parsedDate.getDate() === today.getDate() &&
           parsedDate.getMonth() === today.getMonth() &&
           parsedDate.getFullYear() === today.getFullYear()
  } catch (error) {
    return false
  }
}