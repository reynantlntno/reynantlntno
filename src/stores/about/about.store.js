import { defineStore } from 'pinia'
import { aboutApi } from '@/api/about.api.js'

export const useAboutStore = defineStore('about', () => {
  // State
  const content = ref(null)
  const skills = ref({})
  const totalSkills = ref(0)
  const loading = ref(false)
  const error = ref(null)
  const lastFetch = ref(null)

  // Cache duration (5 minutes)
  const CACHE_DURATION = 5 * 60 * 1000

  // Getters
  const skillCategories = computed(() => Object.keys(skills.value))
  
  const getSkillsByCategory = computed(() => (category) => {
    return skills.value[category] || []
  })

  const isDataStale = computed(() => {
    if (!lastFetch.value) return true
    return Date.now() - lastFetch.value > CACHE_DURATION
  })

  const hasContent = computed(() => content.value !== null)
  const hasSkills = computed(() => totalSkills.value > 0)

  // Actions
  const fetchAboutData = async (forceRefresh = false) => {
    if (!forceRefresh && !isDataStale.value && hasContent.value) {
      return { success: true, data: { content: content.value, skills: skills.value } }
    }

    loading.value = true
    error.value = null

    try {
      const response = await aboutApi.getAboutData()

      if (response.success) {
        content.value = response.data.content
        skills.value = response.data.skills || {}
        totalSkills.value = response.data.totalSkills || 0
        lastFetch.value = Date.now()
        
        return { success: true, data: response.data }
      } else {
        throw new Error(response.error)
      }
    } catch (err) {
      error.value = err.message || 'Failed to fetch about data'
      console.error('About Store Error:', err)
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const fetchContentByType = async (type) => {
    loading.value = true
    error.value = null

    try {
      const response = await aboutApi.getContentByType(type)

      if (response.success) {
        return { success: true, data: response.data }
      } else {
        throw new Error(response.error)
      }
    } catch (err) {
      error.value = err.message || `Failed to fetch ${type} content`
      console.error('About Content Error:', err)
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const clearCache = () => {
    content.value = null
    skills.value = {}
    totalSkills.value = 0
    lastFetch.value = null
    error.value = null
  }

  const refreshData = () => {
    return fetchAboutData(true)
  }

  // Return store interface
  return {
    // State
    content: readonly(content),
    skills: readonly(skills),
    totalSkills: readonly(totalSkills),
    loading: readonly(loading),
    error: readonly(error),

    // Getters
    skillCategories,
    getSkillsByCategory,
    isDataStale,
    hasContent,
    hasSkills,

    // Actions
    fetchAboutData,
    fetchContentByType,
    clearCache,
    refreshData
  }
})