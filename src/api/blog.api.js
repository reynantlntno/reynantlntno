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
    console.error('Blog API Error:', error)
    const message = error.response?.data?.error || error.message || 'An error occurred'
    throw new Error(message)
  }
)

export const blogApi = {
  // Get blog posts with pagination and filters
  async getPosts(params = {}) {
    try {
      const response = await api.get('/blog', { params })
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

  // Get single blog post by slug
  async getPostBySlug(slug) {
    try {
      const response = await api.get(`/blog/${slug}`)
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

  // Search posts
  async searchPosts(query, page = 1, limit = 10) {
    return this.getPosts({
      search: query,
      page,
      limit
    })
  },

  // Get posts by tag
  async getPostsByTag(tag, page = 1, limit = 10) {
    return this.getPosts({
      tag,
      page,
      limit
    })
  }
}