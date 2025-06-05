export class ProjectsApi {
  constructor(apiRequest) {
    this.apiRequest = apiRequest
  }

  async getProjects(params = {}) {
    const queryParams = new URLSearchParams()
    
    if (params.page) queryParams.append('page', params.page)
    if (params.limit) queryParams.append('limit', params.limit)
    if (params.search) queryParams.append('search', params.search)
    if (params.technologies && params.technologies.length > 0) {
      queryParams.append('technologies', params.technologies.join(','))
    }
    if (params.featured !== null && params.featured !== undefined) {
      queryParams.append('featured', params.featured)
    }
    if (params.sortBy) queryParams.append('sortBy', params.sortBy)
    if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder)

    const endpoint = `/projects${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
    
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

  async getProjectBySlug(slug) {
    try {
      const response = await this.apiRequest(`/projects/${slug}`, { method: 'GET' })
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

  async getFeaturedProjects(limit = 6) {
    return this.getProjects({ featured: true, limit })
  }

  async getProjectsByTechnology(technology, params = {}) {
    return this.getProjects({ ...params, technologies: [technology] })
  }

  async searchProjects(query, params = {}) {
    return this.getProjects({ ...params, search: query })
  }

  async getProjectImages(projectId) {
    try {
      const response = await this.apiRequest(`/projects/${projectId}/images`, { method: 'GET' })
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
      projectsApi: new ProjectsApi(apiRequest)
    }
  }
})