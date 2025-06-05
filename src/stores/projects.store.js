import { defineStore } from 'pinia'

export const useProjectsStore = defineStore('projects', {
  state: () => ({
    projects: [],
    currentProject: null,
    loading: false,
    error: null,
    pagination: {
      page: 1,
      limit: 12,
      total: 0,
      totalPages: 0
    },
    filters: {
      search: '',
      technologies: [],
      featured: null
    }
  }),

  getters: {
    featuredProjects: (state) => 
      state.projects.filter(project => project.featured),
    
    projectsByTechnology: (state) => (tech) =>
      state.projects.filter(project => 
        project.technologies?.includes(tech)
      ),
    
    allTechnologies: (state) => {
      const techs = new Set()
      state.projects.forEach(project => {
        if (project.technologies) {
          project.technologies.forEach(tech => techs.add(tech))
        }
      })
      return Array.from(techs).sort()
    },
    
    recentProjects: (state) => 
      state.projects
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 6)
  },

  actions: {
    async fetchProjects(params = {}) {
      this.loading = true
      this.error = null
      
      try {
        const { $projectsApi } = useNuxtApp()
        const response = await $projectsApi.getProjects({
          page: this.pagination.page,
          limit: this.pagination.limit,
          search: this.filters.search,
          technologies: this.filters.technologies,
          featured: this.filters.featured,
          ...params
        })
        
        if (response.success) {
          this.projects = response.data.projects || response.data
          if (response.pagination) {
            this.pagination = response.pagination
          }
        } else {
          this.error = response.error
        }
      } catch (error) {
        this.error = error.message
        console.error('Error fetching projects:', error)
      } finally {
        this.loading = false
      }
    },

    async fetchProjectBySlug(slug) {
      this.loading = true
      this.error = null
      
      try {
        const { $projectsApi } = useNuxtApp()
        const response = await $projectsApi.getProjectBySlug(slug)
        
        if (response.success) {
          this.currentProject = response.data
          return response.data
        } else {
          this.error = response.error
          return null
        }
      } catch (error) {
        this.error = error.message
        console.error('Error fetching project:', error)
        return null
      } finally {
        this.loading = false
      }
    },

    async searchProjects(query) {
      this.filters.search = query
      this.pagination.page = 1
      await this.fetchProjects()
    },

    async filterByTechnology(tech) {
      if (this.filters.technologies.includes(tech)) {
        this.filters.technologies = this.filters.technologies.filter(t => t !== tech)
      } else {
        this.filters.technologies.push(tech)
      }
      this.pagination.page = 1
      await this.fetchProjects()
    },

    async toggleFeaturedFilter() {
      this.filters.featured = this.filters.featured === null ? true : 
                             this.filters.featured === true ? false : null
      this.pagination.page = 1
      await this.fetchProjects()
    },

    async changePage(page) {
      this.pagination.page = page
      await this.fetchProjects()
    },

    clearFilters() {
      this.filters = {
        search: '',
        technologies: [],
        featured: null
      }
      this.pagination.page = 1
    },

    clearCurrentProject() {
      this.currentProject = null
    },

    clearError() {
      this.error = null
    }
  }
})