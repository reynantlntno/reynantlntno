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
    console.error('Newsletter API Error:', error)
    const message = error.response?.data?.error || error.message || 'An error occurred'
    throw new Error(message)
  }
)

export const newsletterApi = {
  // Subscribe to newsletter
  async subscribe(subscriptionData) {
    try {
      const response = await api.post('/newsletter', subscriptionData)
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