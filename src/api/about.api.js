import axios from 'axios'

const API_BASE = '/.netlify/functions'

// Configure axios instance with defaults
const api = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor for error handling
api.interceptors.response.use(
  response => response.data,
  error => {
    console.error('About API Error:', error)
    const message = error.response?.data?.error || error.message || 'An error occurred'
    throw new Error(message)
  }
)

export const aboutApi = {
  // Get all about content and skills
  async getAboutData() {
    try {
      const response = await api.get('/about')
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

  // Get specific content type
  async getContentByType(contentType) {
    try {
      const response = await api.get('/about', {
        params: { 
          type: 'content',  // This tells the API we want content
          contentType       // This specifies which type of content
        }
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