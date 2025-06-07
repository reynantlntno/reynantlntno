import { defineStore } from 'pinia'
import { blogApi } from '@/api/blog.api.js'

export const useBlogStore = defineStore('blog', () => {
  // State
  const posts = ref([])
  const currentPost = ref(null)
  const pagination = ref({
    currentPage: 1,
    totalPages: 0,
    totalItems: 0,
    hasNext: false,
    hasPrev: false
  })
  const availableTags = ref([])
  const filters = ref({
    tag: null,
    search: null
  })
  const loading = ref(false)
  const error = ref(null)
  const cache = ref(new Map())

  // Cache duration (10 minutes for posts, 30 minutes for individual post)
  const POSTS_CACHE_DURATION = 10 * 60 * 1000
  const POST_CACHE_DURATION = 30 * 60 * 1000

  // Getters
  const filteredPosts = computed(() => {
    let filtered = posts.value

    if (filters.value.tag) {
      filtered = filtered.filter(post => 
        post.tags && post.tags.includes(filters.value.tag)
      )
    }

    if (filters.value.search) {
      const searchTerm = filters.value.search.toLowerCase()
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchTerm) ||
        post.summary?.toLowerCase().includes(searchTerm)
      )
    }

    return filtered
  })

  const featuredPosts = computed(() => {
    return posts.value.slice(0, 3) // Get first 3 posts as featured
  })

  const recentPosts = computed(() => {
    return posts.value.slice(0, 5) // Get first 5 posts as recent
  })

  const hasMorePosts = computed(() => pagination.value.hasNext)
  const canLoadPrevious = computed(() => pagination.value.hasPrev)

  // Utility functions
  const getCacheKey = (params) => {
    const { page = 1, limit = 10, tag = '', search = '' } = params
    return `posts-${page}-${limit}-${tag}-${search}`
  }

  const isCacheValid = (cacheEntry, duration = POSTS_CACHE_DURATION) => {
    return cacheEntry && (Date.now() - cacheEntry.timestamp < duration)
  }

  // Actions
  const fetchPosts = async (params = {}) => {
    const { page = 1, limit = 10, tag, search, forceRefresh = false } = params
    
    loading.value = true
    error.value = null

    try {
      const cacheKey = getCacheKey({ page, limit, tag, search })
      const cachedData = cache.value.get(cacheKey)

      if (!forceRefresh && isCacheValid(cachedData)) {
        posts.value = cachedData.data.posts
        pagination.value = cachedData.data.pagination
        availableTags.value = cachedData.data.availableTags
        filters.value = cachedData.data.filters
        return { success: true, data: cachedData.data }
      }

      const response = await blogApi.getPosts({ page, limit, tag, search })

      if (response.success) {
        posts.value = response.data.posts
        pagination.value = response.data.pagination
        availableTags.value = response.data.availableTags
        filters.value = response.data.filters

        // Cache the response
        cache.value.set(cacheKey, {
          data: response.data,
          timestamp: Date.now()
        })

        return { success: true, data: response.data }
      } else {
        throw new Error(response.error)
      }
    } catch (err) {
      error.value = err.message || 'Failed to fetch blog posts'
      console.error('Blog Store Error:', err)
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const fetchPostBySlug = async (slug, forceRefresh = false) => {
    loading.value = true
    error.value = null

    try {
      const cacheKey = `post-${slug}`
      const cachedPost = cache.value.get(cacheKey)

      if (!forceRefresh && isCacheValid(cachedPost, POST_CACHE_DURATION)) {
        currentPost.value = cachedPost.data
        return { success: true, data: cachedPost.data }
      }

      const response = await blogApi.getPostBySlug(slug)

      if (response.success) {
        currentPost.value = response.data

        // Cache the post
        cache.value.set(cacheKey, {
          data: response.data,
          timestamp: Date.now()
        })

        return { success: true, data: response.data }
      } else {
        throw new Error(response.error)
      }
    } catch (err) {
      error.value = err.message || 'Failed to fetch blog post'
      console.error('Blog Post Error:', err)
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const searchPosts = async (query, page = 1, limit = 10) => {
    return fetchPosts({ search: query, page, limit })
  }

  const getPostsByTag = async (tag, page = 1, limit = 10) => {
    return fetchPosts({ tag, page, limit })
  }

  const loadMorePosts = async () => {
    if (!hasMorePosts.value || loading.value) return

    const nextPage = pagination.value.currentPage + 1
    const params = {
      page: nextPage,
      limit: 10,
      tag: filters.value.tag,
      search: filters.value.search
    }

    const result = await fetchPosts(params)
    
    if (result.success) {
      // Append new posts to existing ones
      posts.value = [...posts.value, ...result.data.posts]
    }

    return result
  }

  const setCurrentPost = (post) => {
    currentPost.value = post
  }

  const clearCurrentPost = () => {
    currentPost.value = null
  }

  const clearFilters = () => {
    filters.value = {
      tag: null,
      search: null
    }
  }

  const clearCache = () => {
    cache.value.clear()
    posts.value = []
    currentPost.value = null
    pagination.value = {
      currentPage: 1,
      totalPages: 0,
      totalItems: 0,
      hasNext: false,
      hasPrev: false
    }
    availableTags.value = []
    clearFilters()
  }

  const refreshPosts = () => {
    return fetchPosts({ 
      page: pagination.value.currentPage,
      tag: filters.value.tag,
      search: filters.value.search,
      forceRefresh: true 
    })
  }

  // Return store interface
  return {
    // State
    posts: readonly(posts),
    currentPost: readonly(currentPost),
    pagination: readonly(pagination),
    availableTags: readonly(availableTags),
    filters: readonly(filters),
    loading: readonly(loading),
    error: readonly(error),

    // Getters
    filteredPosts,
    featuredPosts,
    recentPosts,
    hasMorePosts,
    canLoadPrevious,

    // Actions
    fetchPosts,
    fetchPostBySlug,
    searchPosts,
    getPostsByTag,
    loadMorePosts,
    setCurrentPost,
    clearCurrentPost,
    clearFilters,
    clearCache,
    refreshPosts
  }
})