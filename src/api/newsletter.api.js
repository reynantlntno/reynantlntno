export class NewsletterApi {
  constructor(apiRequest) {
    this.apiRequest = apiRequest
  }

  async subscribe(email, name = null) {
    try {
      const response = await this.apiRequest('/newsletter/subscribe', {
        method: 'POST',
        body: { email, name }
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

  async unsubscribe(email) {
    try {
      const response = await this.apiRequest('/newsletter/unsubscribe', {
        method: 'POST',
        body: { email }
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

  async getSubscriptionStatus(email) {
    try {
      const response = await this.apiRequest(`/newsletter/status?email=${encodeURIComponent(email)}`, { method: 'GET' })
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
}

// Plugin to inject into Nuxt app
export default defineNuxtPlugin(() => {
  const { apiRequest } = useApi()
  
  return {
    provide: {
      newsletterApi: new NewsletterApi(apiRequest)
    }
  }
})