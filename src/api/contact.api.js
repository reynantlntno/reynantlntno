export class ContactApi {
  constructor(apiRequest) {
    this.apiRequest = apiRequest
  }

  async sendMessage(contactData) {
    try {
      const response = await this.apiRequest('/contact', {
        method: 'POST',
        body: contactData
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

  async getMessages(params = {}) {
    const queryParams = new URLSearchParams()
    
    if (params.page) queryParams.append('page', params.page)
    if (params.limit) queryParams.append('limit', params.limit)
    if (params.read !== undefined) queryParams.append('read', params.read)
    if (params.sortBy) queryParams.append('sortBy', params.sortBy)
    if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder)

    const endpoint = `/contact/messages${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
    
    try {
      const response = await this.apiRequest(endpoint, { method: 'GET' })
      return {
        success: response.error === null,
        data: response.data,
        error: response.error,
        pagination: response.data?.pagination
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error.message
      }
    }
  }
}

// Plugin to inject into Nuxt app
export default defineNuxtPlugin(() => {
  const { apiRequest } = useApi()
  
  return {
    provide: {
      contactApi: new ContactApi(apiRequest)
    }
  }
})