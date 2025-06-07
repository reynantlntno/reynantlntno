import axios from 'axios'

const API_BASE = '/.netlify/functions'

const api = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
})

api.interceptors.response.use(
  response => response.data,
  error => {
    console.error('Appointments API Error:', error)
    const message = error.response?.data?.error || error.message || 'An error occurred'
    throw new Error(message)
  }
)

export const appointmentsApi = {
  // Get available slots for a specific date
  async getAvailableSlots(date) {
    try {
      const response = await api.get('/appointments', {
        params: { date }
      })
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  },

  // Book an appointment
  async bookAppointment(appointmentData) {
    try {
      const response = await api.post('/appointments', appointmentData)
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  },

  // Track appointment by reference code
  async trackAppointment(referenceCode) {
    try {
      const response = await api.get('/appointments/track', {
        params: { reference: referenceCode }
      })
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  },

  // Get available date range
  async getAvailableDateRange(startDate, endDate) {
    try {
      const response = await api.get('/appointments', {
        params: { startDate, endDate }
      })
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  }
}