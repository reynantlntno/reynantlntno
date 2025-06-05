export class AppointmentsApi {
  constructor(apiRequest) {
    this.apiRequest = apiRequest
  }

  async getSlots(params = {}) {
    const queryParams = new URLSearchParams()
    
    if (params.start_date) queryParams.append('start_date', params.start_date)
    if (params.end_date) queryParams.append('end_date', params.end_date)
    if (params.date) queryParams.append('date', params.date)
    if (params.recurring !== undefined) queryParams.append('recurring', params.recurring)
    if (params.available !== undefined) queryParams.append('available', params.available)

    const endpoint = `/appointments/slots${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
    
    try {
      const response = await this.apiRequest(endpoint, { method: 'GET' })
      return {
        success: response.error === null,
        data: response.data,
        error: response.error
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error.message
      }
    }
  }

  async createAppointment(appointmentData) {
    try {
      const response = await this.apiRequest('/appointments', {
        method: 'POST',
        body: appointmentData
      })
      return {
        success: response.error === null,
        data: response.data,
        error: response.error
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error.message
      }
    }
  }

  async getAppointmentByReference(referenceCode) {
    try {
      const response = await this.apiRequest(`/appointments/${referenceCode}`, { method: 'GET' })
      return {
        success: response.error === null,
        data: response.data,
        error: response.error
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error.message
      }
    }
  }

  async getAvailableSlots(date) {
    return this.getSlots({ date, available: true })
  }

  async getSlotsByDateRange(startDate, endDate) {
    return this.getSlots({ start_date: startDate, end_date: endDate })
  }
}

// Plugin to inject into Nuxt app
export default defineNuxtPlugin(() => {
  const { apiRequest } = useApi()
  
  return {
    provide: {
      appointmentsApi: new AppointmentsApi(apiRequest)
    }
  }
})