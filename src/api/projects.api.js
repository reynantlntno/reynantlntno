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
    console.error('Projects API Error:', error)
    const message = error.response?.data?.error || error.message || 'An error occurred'
    throw new Error(message)
  }
)

export const projectsApi = {
  // Get projects with pagination and filters
  async getProjects(params = {}) {
    try {
      const response = await api.get('/projects', { params })
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

  // Get single project by slug
  async getProjectBySlug(slug) {
    try {
      const response = await api.get(`/projects/${slug}`)
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

  // Get featured projects
  async getFeaturedProjects(page = 1, limit = 6) {
    return this.getProjects({
      featured: true,
      page,
      limit
    })
  },

  // Get projects by technology
  async getProjectsByTechnology(technology, page = 1, limit = 12) {
    return this.getProjects({
      technology,
      page,
      limit
    })
  }
}