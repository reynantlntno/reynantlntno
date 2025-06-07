import { defineStore } from 'pinia'
import { ref, computed, readonly } from 'vue' // Add missing imports
import { projectsApi } from '@/api/projects.api.js'

export const useProjectsStore = defineStore('projects', () => {
  // State
  const projects = ref([])
  const currentProject = ref(null)
  const pagination = ref({
    currentPage: 1,
    totalPages: 0,
    totalItems: 0,
    hasNext: false,
    hasPrev: false
  })
  const availableTechnologies = ref([])
  const filters = ref({
    featured: null,
    technology: null
  })
  const loading = ref(false)
  const error = ref(null)
  const cache = ref(new Map())

  // Cache duration (15 minutes for projects, 1 hour for individual project)
  const PROJECTS_CACHE_DURATION = 15 * 60 * 1000
  const PROJECT_CACHE_DURATION = 60 * 60 * 1000

  // Getters
  const featuredProjects = computed(() => {
    return projects.value.filter(project => project.featured)
  })

  const projectsByTechnology = computed(() => (technology) => {
    return projects.value.filter(project =>
      project.technologies && project.technologies.includes(technology)
    )
  })

  const filteredProjects = computed(() => {
    let filtered = projects.value

    if (filters.value.featured === true) {
      filtered = filtered.filter(project => project.featured)
    }

    if (filters.value.technology) {
      filtered = filtered.filter(project =>
        project.technologies && project.technologies.includes(filters.value.technology)
      )
    }

    return filtered
  })

  const hasMoreProjects = computed(() => pagination.value.hasNext)
  const canLoadPrevious = computed(() => pagination.value.hasPrev)

  const totalFeaturedProjects = computed(() => featuredProjects.value.length)
  const totalProjects = computed(() => pagination.value.totalItems)

  // Utility functions
  const getCacheKey = (params) => {
    const { page = 1, limit = 12, featured = null, technology = null } = params
    return `projects-${page}-${limit}-${featured}-${technology || ''}`
  }

  const isCacheValid = (cacheEntry, duration = PROJECTS_CACHE_DURATION) => {
    return cacheEntry && (Date.now() - cacheEntry.timestamp < duration)
  }

  // Actions
  const fetchProjects = async (params = {}) => {
    const { page = 1, limit = 12, featured, technology, forceRefresh = false } = params
    
    loading.value = true
    error.value = null

    try {
      const cacheKey = getCacheKey({ page, limit, featured, technology })
      const cachedData = cache.value.get(cacheKey)

      if (!forceRefresh && isCacheValid(cachedData)) {
        projects.value = cachedData.data.projects
        pagination.value = cachedData.data.pagination
        availableTechnologies.value = cachedData.data.availableTechnologies
        filters.value = cachedData.data.filters
        return { success: true, data: cachedData.data }
      }

      const response = await projectsApi.getProjects({ page, limit, featured, technology })
      if (response.success) {
        const responseData = response.data // This is the actual data object
        
        projects.value = responseData.projects || []
        pagination.value = responseData.pagination || {
          currentPage: 1,
          totalPages: 0,
          totalItems: 0,
          hasNext: false,
          hasPrev: false
        }
        availableTechnologies.value = responseData.availableTechnologies || []
        filters.value = responseData.filters || { featured: null, technology: null }

        // Cache the response
        cache.value.set(cacheKey, {
          data: responseData,
          timestamp: Date.now()
        })

        return { success: true, data: responseData }
      } else {
        throw new Error(response.error || 'Failed to fetch projects')
      }
    } catch (err) {
      error.value = err.message || 'Failed to fetch projects'
      console.error('Projects Store Error:', err)
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const fetchProjectBySlug = async (slug, forceRefresh = false) => {
    if (!slug) {
      error.value = 'Project slug is required'
      return { success: false, error: error.value }
    }

    loading.value = true
    error.value = null
    currentProject.value = null // Clear current project while loading

    try {
      const cacheKey = `project-${slug}`
      const cachedProject = cache.value.get(cacheKey)

      if (!forceRefresh && isCacheValid(cachedProject, PROJECT_CACHE_DURATION)) {
        currentProject.value = cachedProject.data
        return { success: true, data: cachedProject.data }
      }

      const response = await projectsApi.getProjectBySlug(slug)
      
      if (response.success) {
        const projectData = response.data
        
        if (!projectData) {
          throw new Error('Project not found')
        }

        currentProject.value = projectData

        // Cache the project
        cache.value.set(cacheKey, {
          data: projectData,
          timestamp: Date.now()
        })

        return { success: true, data: projectData }
      } else {
        throw new Error(response.error || 'Project not found')
      }
    } catch (err) {
      error.value = err.message || 'Failed to fetch project'
      console.error('Project Detail Error:', err)
      currentProject.value = null
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const fetchFeaturedProjects = async (page = 1, limit = 6) => {
    return fetchProjects({ featured: true, page, limit })
  }

  const fetchProjectsByTechnology = async (technology, page = 1, limit = 12) => {
    return fetchProjects({ technology, page, limit })
  }

  const loadMoreProjects = async () => {
    if (!hasMoreProjects.value || loading.value) return

    const nextPage = pagination.value.currentPage + 1
    const params = {
      page: nextPage,
      limit: 12,
      featured: filters.value.featured,
      technology: filters.value.technology
    }

    const result = await fetchProjects(params)
    
    if (result.success) {
      // Append new projects to existing ones
      const newProjects = result.data.projects || []
      projects.value = [...projects.value, ...newProjects]
    }

    return result
  }

  const setCurrentProject = (project) => {
    currentProject.value = project
  }

  const clearCurrentProject = () => {
    currentProject.value = null
  }

  const clearFilters = () => {
    filters.value = {
      featured: null,
      technology: null
    }
  }

  const clearCache = () => {
    cache.value.clear()
    projects.value = []
    currentProject.value = null
    pagination.value = {
      currentPage: 1,
      totalPages: 0,
      totalItems: 0,
      hasNext: false,
      hasPrev: false
    }
    availableTechnologies.value = []
    clearFilters()
  }

  const refreshProjects = () => {
    return fetchProjects({ 
      page: pagination.value.currentPage,
      featured: filters.value.featured,
      technology: filters.value.technology,
      forceRefresh: true 
    })
  }

  // Return store interface
  return {
    // State
    projects: readonly(projects),
    currentProject: readonly(currentProject),
    pagination: readonly(pagination),
    availableTechnologies: readonly(availableTechnologies),
    filters: readonly(filters),
    loading: readonly(loading),
    error: readonly(error),

    // Getters
    featuredProjects,
    projectsByTechnology,
    filteredProjects,
    hasMoreProjects,
    canLoadPrevious,
    totalFeaturedProjects,
    totalProjects,

    // Actions
    fetchProjects,
    fetchProjectBySlug,
    fetchFeaturedProjects,
    fetchProjectsByTechnology,
    loadMoreProjects,
    setCurrentProject,
    clearCurrentProject,
    clearFilters,
    clearCache,
    refreshProjects
  }
})