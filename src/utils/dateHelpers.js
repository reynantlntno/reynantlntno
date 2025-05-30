// filepath: /Users/reynantolentino/reynantlntno.dev/src/utils/dateHelpers.js
import { format, isToday, isAfter, isBefore, addDays, isValid } from 'date-fns';

/**
 * Format date to a specific format
 * @param {Date|string} date - The date to format
 * @param {string} formatStr - Date format string (default: 'yyyy-MM-dd')
 * @returns {string} - Formatted date string
 */
export const formatDate = (date, formatStr = 'yyyy-MM-dd') => {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  if (!isValid(dateObj)) return 'Invalid Date';
  return format(dateObj, formatStr);
};

/**
 * Check if a date is in the past
 * @param {Date|string} date - The date to check
 * @returns {boolean} - Whether the date is in the past
 */
export const isPastDate = (date) => {
  if (!date) return false;
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return isBefore(dateObj, today);
};

/**
 * Get a date range array for the next N days
 * @param {number} days - Number of days to include
 * @returns {Date[]} - Array of date objects
 */
export const getNextNDays = (days = 14) => {
  const dates = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  for (let i = 0; i < days; i++) {
    dates.push(addDays(today, i));
  }
  
  return dates;
};

/**
 * Convert a date string to ISO format
 * @param {string} dateStr - The date string to convert
 * @returns {string} - ISO formatted date
 */
export const toISODate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (!isValid(date)) return '';
  return date.toISOString();
};

/**
 * Get days between two dates
 * @param {Date|string} startDate - Starting date
 * @param {Date|string} endDate - Ending date
 * @returns {number} - Number of days between dates
 */
export const getDaysBetween = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  // Return difference in days
  const diffTime = Math.abs(end - start);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Get readable date format (e.g., "Today", "Tomorrow", or formatted date)
 * @param {Date|string} date - The date to format
 * @returns {string} - Readable date
 */
export const getReadableDate = (date) => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  if (!isValid(dateObj)) return 'Invalid Date';
  
  if (isToday(dateObj)) {
    return 'Today';
  }
  
  if (isToday(addDays(dateObj, -1))) {
    return 'Tomorrow';
  }
  
  return format(dateObj, 'EEEE, MMMM d');
};