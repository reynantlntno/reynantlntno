import { defineStore } from 'pinia'

export const useAboutStore = defineStore('about', {
  state: () => ({
    content: {},
    skills: [],
    loading: false,
    error: null
  }),

  getters: {
    skillsByCategory: (state) => {
      const categories = {}
      state.skills.forEach(skill => {
        if (!categories[skill.category]) {
          categories[skill.category] = []
        }
        categories[skill.category].push(skill)
      })
      
      // Sort skills within each category by display_order and proficiency
      Object.keys(categories).forEach(category => {
        categories[category].sort((a, b) => {
          if (a.display_order !== b.display_order) {
            return a.display_order - b.display_order
          }
          return b.proficiency - a.proficiency
        })
      })
      
      return categories
    },
    
    topSkills: (state) => 
      state.skills
        .filter(skill => skill.proficiency >= 8)
        .sort((a, b) => b.proficiency - a.proficiency),
    
    aboutContent: (state) => state.content.about || {},
    resumeContent: (state) => state.content.resume || {},
    
    hasContent: (state) => Object.keys(state.content).length > 0,
    hasSkills: (state) => state.skills.length > 0
  },

  actions: {
    async fetchContent() {
      this.loading = true
      this.error = null
      
      try {
        const { $aboutApi } = useNuxtApp()
        const response = await $aboutApi.getContent()
        
        if (response.success) {
          this.content = response.data
        } else {
          this.error = response.error
        }
      } catch (error) {
        this.error = error.message
        console.error('Error fetching about content:', error)
      } finally {
        this.loading = false
      }
    },

    async fetchSkills() {
      this.loading = true
      this.error = null
      
      try {
        const { $aboutApi } = useNuxtApp()
        const response = await $aboutApi.getSkills()
        
        if (response.success) {
          this.skills = response.data
        } else {
          this.error = response.error
        }
      } catch (error) {
        this.error = error.message
        console.error('Error fetching skills:', error)
      } finally {
        this.loading = false
      }
    },

    async fetchAll() {
      await Promise.all([
        this.fetchContent(),
        this.fetchSkills()
      ])
    },

    getContentByType(type) {
      return this.content[type] || null
    },

    getSkillsByCategory(category) {
      return this.skills.filter(skill => skill.category === category)
    },

    clearError() {
      this.error = null
    }
  }
})