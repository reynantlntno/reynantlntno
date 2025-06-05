export class BlogApi {
  constructor(apiRequest) {
    this.apiRequest = apiRequest
  }

  async getPosts(params = {}) {
    const queryParams = new URLSearchParams()
    
    if (params.page) queryParams.append('page', params.page)
    if (params.limit) queryParams.append('limit', params.limit)
    if (params.search) queryParams.append('search', params.search)
    if (params.tags && params.tags.length > 0) {
      queryParams.append('tags', params.tags.join(','))
    }
    if (params.published !== undefined) queryParams.append('published', params.published)
    if (params.sortBy) queryParams.append('sortBy', params.sortBy)
    if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder)

    const endpoint = `/blog${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
    
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

  async getPostBySlug(slug) {
    try {
      const response = await this.apiRequest(`/blog/${slug}`, { method: 'GET' })
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

  async getRecentPosts(limit = 5) {
    return this.getPosts({ limit, sortBy: 'published_at', sortOrder: 'desc' })
  }

  async getPostsByTag(tag, params = {}) {
    return this.getPosts({ ...params, tags: [tag] })
  }

  async searchPosts(query, params = {}) {
    return this.getPosts({ ...params, search: query })
  }
}

// Plugin to inject into Nuxt app
export default defineNuxtPlugin(() => {
  const { apiRequest } = useApi()
  
  return {
    provide: {
      blogApi: new BlogApi(apiRequest)
    }
  }
})