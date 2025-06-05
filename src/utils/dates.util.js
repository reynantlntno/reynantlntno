export const formatDate = (date, options = {}) => {
  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }
  
  const formatOptions = { ...defaultOptions, ...options }
  return new Date(date).toLocaleDateString('en-US', formatOptions)
}

export const formatTime = (time) => {
  return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })
}

export const formatDateTime = (dateTime) => {
  return new Date(dateTime).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })
}

export const formatRelativeTime = (date) => {
  const now = new Date()
  const targetDate = new Date(date)
  const diffInMinutes = Math.floor((now - targetDate) / (1000 * 60))
  
  if (diffInMinutes < 1) return 'Just now'
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`
  
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) return `${diffInHours}h ago`
  
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) return `${diffInDays}d ago`
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)}w ago`
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)}mo ago`
  
  return `${Math.floor(diffInDays / 365)}y ago`
}

export const isToday = (date) => {
  const today = new Date()
  const checkDate = new Date(date)
  return checkDate.toDateString() === today.toDateString()
}

export const isSameWeek = (date1, date2) => {
  const d1 = new Date(date1)
  const d2 = new Date(date2)
  const diff = Math.abs(d1 - d2)
  return diff < 7 * 24 * 60 * 60 * 1000
}

export const getWeekStart = (date) => {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day
  return new Date(d.setDate(diff))
}

export const getMonthStart = (date) => {
  const d = new Date(date)
  return new Date(d.getFullYear(), d.getMonth(), 1)
}

export const getMonthEnd = (date) => {
  const d = new Date(date)
  return new Date(d.getFullYear(), d.getMonth() + 1, 0)
}

export const addDays = (date, days) => {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

export const addWeeks = (date, weeks) => {
  return addDays(date, weeks * 7)
}

export const addMonths = (date, months) => {
  const result = new Date(date)
  result.setMonth(result.getMonth() + months)
  return result
}

export const formatISO = (date) => {
  return new Date(date).toISOString().split('T')[0]
}

export const parseISO = (dateString) => {
  return new Date(dateString)
}

export const getDaysInMonth = (year, month) => {
  return new Date(year, month + 1, 0).getDate()
}

export const getMonthName = (monthIndex) => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]
  return months[monthIndex]
}

export const getDayName = (dayIndex) => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  return days[dayIndex]
}

export const generateTimeSlots = (startTime, endTime, intervalMinutes = 30) => {
  const slots = []
  const start = new Date(`2000-01-01T${startTime}`)
  const end = new Date(`2000-01-01T${endTime}`)
  
  let current = new Date(start)
  while (current < end) {
    const timeString = current.toTimeString().slice(0, 5)
    slots.push(timeString)
    current.setMinutes(current.getMinutes() + intervalMinutes)
  }
  
  return slots
}