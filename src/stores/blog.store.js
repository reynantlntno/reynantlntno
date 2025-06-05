import { defineStore } from 'pinia'

export const useBlogStore = defineStore('blog', {
  state: () => ({
    posts: [],
    currentPost: null,
    loading: false,
    error: null,
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0
    },
    filters: {
      search: '',
      tags: [],
      published: true
    }
  }),

  getters: {
    publishedPosts: (state) => state.posts.filter(post => post.published),
    
    featuredPosts: (state) => state.posts.filter(post => post.featured),
    
    postsByTag: (state) => (tag) => 
      state.posts.filter(post => post.tags?.includes(tag)),
    
    recentPosts: (state) => 
      state.posts
        .filter(post => post.published)
        .sort((a, b) => new Date(b.published_at) - new Date(a.published_at))
        .slice(0, 5),
    
    allTags: (state) => {
      const tags = new Set()
      state.posts.forEach(post => {
        if (post.tags) {
          post.tags.forEach(tag => tags.add(tag))
        }
      })
      return Array.from(tags).sort()
    }
  },

  actions: {
    async fetchPosts(params = {}) {
      this.loading = true
      this.error = null
      
      try {
        const { $blogApi } = useNuxtApp()
        const response = await $blogApi.getPosts({
          page: this.pagination.page,
          limit: this.pagination.limit,
          search: this.filters.search,
          tags: this.filters.tags,
          published: this.filters.published,
          ...params
        })
        
        if (response.success) {
          this.posts = response.data
          this.pagination = response.pagination || this.pagination
        } else {
          this.error = response.error
        }
      } catch (error) {
        this.error = error.message
        console.error('Error fetching posts:', error)
      } finally {
        this.loading = false
      }
    },

    async fetchPostBySlug(slug) {
      this.loading = true
      this.error = null
      
      try {
        const { $blogApi } = useNuxtApp()
        const response = await $blogApi.getPostBySlug(slug)
        
        if (response.success) {
          this.currentPost = response.data
          return response.data
        } else {
          this.error = response.error
          return null
        }
      } catch (error) {
        this.error = error.message
        console.error('Error fetching post:', error)
        return null
      } finally {
        this.loading = false
      }
    },

    async searchPosts(query) {
      this.filters.search = query
      this.pagination.page = 1
      await this.fetchPosts()
    },

    async filterByTag(tag) {
      if (this.filters.tags.includes(tag)) {
        this.filters.tags = this.filters.tags.filter(t => t !== tag)
      } else {
        this.filters.tags.push(tag)
      }
      this.pagination.page = 1
      await this.fetchPosts()
    },

    async changePage(page) {
      this.pagination.page = page
      await this.fetchPosts()
    },

    clearFilters() {
      this.filters = {
        search: '',
        tags: [],
        published: true
      }
      this.pagination.page = 1
    },

    clearCurrentPost() {
      this.currentPost = null
    },

    clearError() {
      this.error = null
    }
  }
})