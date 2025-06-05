export class AboutApi {
  constructor(apiRequest) {
    this.apiRequest = apiRequest
  }

  async getContent() {
    try {
      const response = await this.apiRequest('/about/content', { method: 'GET' })
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

  async getSkills() {
    try {
      const response = await this.apiRequest('/about/skills', { method: 'GET' })
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

  async getContentByType(type) {
    try {
      const response = await this.apiRequest(`/about/content/${type}`, { method: 'GET' })
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

  async getSkillsByCategory(category) {
    try {
      const response = await this.apiRequest(`/about/skills?category=${category}`, { method: 'GET' })
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
      aboutApi: new AboutApi(apiRequest)
    }
  }
})