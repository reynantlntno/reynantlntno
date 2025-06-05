<template>
  <div class="min-h-screen bg-gray-50 dark:bg-custom-slate-800">
    <!-- Hero Section -->
    <section class="gradient-navy-slate text-white py-20">
      <div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <h1 class="text-4xl md:text-5xl font-bold mb-6">Blog</h1>
        <p class="text-xl text-gray-300">
          Thoughts, tutorials, and insights on software development and technology.
        </p>
      </div>
    </section>

    <!-- Search and Filters -->
    <section class="bg-white dark:bg-custom-slate-800 border-b border-gray-200 dark:border-custom-slate-700 sticky top-16 z-30">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <!-- Search -->
          <div class="w-full lg:w-1/3">
            <BaseSearch
              v-model="searchQuery"
              placeholder="Search blog posts..."
              :loading="blogStore.loading"
              @search="handleSearch"
              @clear="clearSearch"
            />
          </div>

          <!-- Layout Toggle -->
          <div class="flex items-center gap-2">
            <button
              @click="layout = 'grid'"
              :class="[
                'p-2 rounded-lg transition-colors duration-200',
                layout === 'grid'
                  ? 'bg-custom-blue-800 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
              ]"
              title="Grid view"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              @click="layout = 'list'"
              :class="[
                'p-2 rounded-lg transition-colors duration-200',
                layout === 'list'
                  ? 'bg-custom-blue-800 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
              ]"
              title="List view"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 8a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 12a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 16a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
              </svg>
            </button>
          </div>

          <!-- Tag Filter -->
          <div class="flex flex-wrap gap-2">
            <button
              v-for="tag in popularTags"
              :key="tag"
              @click="toggleTag(tag)"
              :class="[
                'px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200',
                selectedTags.includes(tag)
                  ? 'bg-custom-blue-800 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-custom-blue-100 dark:hover:bg-custom-blue-900/20'
              ]"
            >
              {{ formatTagForDisplay(tag) }}
            </button>
          </div>

          <!-- Clear Filters -->
          <BaseButton
            v-if="hasFilters"
            @click="clearFilters"
            variant="ghost"
            size="sm"
          >
            Clear Filters
          </BaseButton>
        </div>
      </div>
    </section>

    <!-- Blog Posts -->
    <section class="py-16">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <!-- Blog List Component -->
        <BlogList
          :posts="blogStore.posts"
          :loading="blogStore.loading"
          :error="blogStore.error"
          :layout="layout"
          :has-filters="hasFilters"
          :empty-message="hasFilters ? 'No posts found' : 'No blog posts yet'"
          :empty-description="hasFilters ? 'Try adjusting your search criteria.' : 'Blog posts will appear here once they\'re published.'"
          @post-click="handlePostClick"
          @tag-click="handleTagClick"
          @retry="handleRetry"
          @clear-filters="clearFilters"
        />

        <!-- Pagination -->
        <div v-if="blogStore.posts.length > 0 && blogStore.pagination.totalPages > 1" class="mt-12">
          <Pagination
            :current-page="blogStore.pagination.page"
            :total-pages="blogStore.pagination.totalPages"
            :total="blogStore.pagination.total"
            :per-page="blogStore.pagination.limit"
            @page-change="handlePageChange"
          />
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useBlogStore } from '~/stores/blog.store'
import { capitalizeWords } from '~/utils/format.util'

// SEO
useHead({
  title: 'Blog - Reynan Tolentino',
  meta: [
    {
      name: 'description',
      content: 'Read about software development, web technologies, and programming insights from Reynan Tolentino.'
    },
    { property: 'og:title', content: 'Blog - Reynan Tolentino' },
    { property: 'og:description', content: 'Read about software development, web technologies, and programming insights from Reynan Tolentino.' },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://reynantlntno.netlify.app/blog' }
  ]
})

// Store
const blogStore = useBlogStore()

// State
const searchQuery = ref('')
const selectedTags = ref([])
const layout = ref('grid') // 'grid' or 'list'

// Computed
const popularTags = computed(() => blogStore.allTags.slice(0, 8))

const hasFilters = computed(() => {
  return searchQuery.value || selectedTags.value.length > 0
})

// Methods
const formatTagForDisplay = (tag) => {
  return capitalizeWords(tag.replace(/-/g, ' '))
}

const handleSearch = (query) => {
  searchQuery.value = query
  blogStore.filters.search = query
  blogStore.pagination.page = 1
  blogStore.fetchPosts()
  
  // Update URL with search parameter
  updateUrlParams()
}

const clearSearch = () => {
  searchQuery.value = ''
  blogStore.clearFilters()
  blogStore.fetchPosts()
  
  // Clear URL parameters
  navigateTo('/blog', { replace: true })
}

const toggleTag = (tag) => {
  const index = selectedTags.value.indexOf(tag)
  if (index > -1) {
    selectedTags.value.splice(index, 1)
  } else {
    selectedTags.value.push(tag)
  }
  
  blogStore.filters.tags = [...selectedTags.value]
  blogStore.pagination.page = 1
  blogStore.fetchPosts()
  
  // Update URL with tag parameters
  updateUrlParams()
}

const handleTagClick = (tag) => {
  if (!selectedTags.value.includes(tag)) {
    toggleTag(tag)
  }
}

const clearFilters = () => {
  searchQuery.value = ''
  selectedTags.value = []
  blogStore.clearFilters()
  blogStore.fetchPosts()
  
  // Clear URL parameters
  navigateTo('/blog', { replace: true })
}

const handlePageChange = (page) => {
  blogStore.changePage(page)
  
  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' })
  
  // Update URL with page parameter
  updateUrlParams()
}

const handlePostClick = (post) => {
  // Track post click for analytics if needed
  console.log('Post clicked:', post.title)
}

const handleRetry = () => {
  blogStore.fetchPosts()
}

const updateUrlParams = () => {
  const query = {}
  
  if (searchQuery.value) {
    query.search = searchQuery.value
  }
  
  if (selectedTags.value.length > 0) {
    query.tag = selectedTags.value
  }
  
  if (blogStore.pagination.page > 1) {
    query.page = blogStore.pagination.page
  }
  
  // Update URL without triggering navigation
  const router = useRouter()
  router.replace({
    path: '/blog',
    query: Object.keys(query).length > 0 ? query : undefined
  })
}

// Lifecycle
onMounted(() => {
  // Initialize from URL parameters
  const route = useRoute()
  
  if (route.query.search) {
    searchQuery.value = route.query.search
    blogStore.filters.search = route.query.search
  }
  
  if (route.query.tag) {
    const tags = Array.isArray(route.query.tag) ? route.query.tag : [route.query.tag]
    selectedTags.value = tags
    blogStore.filters.tags = tags
  }
  
  if (route.query.page) {
    const page = parseInt(route.query.page)
    if (page > 0) {
      blogStore.pagination.page = page
    }
  }
  
  // Fetch posts with current filters
  blogStore.fetchPosts()
})

// Watch route query parameters for deep linking and browser navigation
const route = useRoute()
watch(() => route.query, (newQuery, oldQuery) => {
  // Avoid infinite loops by checking if query actually changed
  const queryChanged = JSON.stringify(newQuery) !== JSON.stringify(oldQuery)
  if (!queryChanged) return
  
  let shouldRefetch = false
  
  // Handle search parameter
  if (newQuery.search !== searchQuery.value) {
    searchQuery.value = newQuery.search || ''
    blogStore.filters.search = searchQuery.value
    shouldRefetch = true
  }
  
  // Handle tag parameters
  const newTags = newQuery.tag 
    ? (Array.isArray(newQuery.tag) ? newQuery.tag : [newQuery.tag])
    : []
  
  if (JSON.stringify(newTags) !== JSON.stringify(selectedTags.value)) {
    selectedTags.value = newTags
    blogStore.filters.tags = newTags
    shouldRefetch = true
  }
  
  // Handle page parameter
  const newPage = parseInt(newQuery.page) || 1
  if (newPage !== blogStore.pagination.page) {
    blogStore.pagination.page = newPage
    shouldRefetch = true
  }
  
  // Refetch if any parameters changed
  if (shouldRefetch) {
    blogStore.fetchPosts()
  }
}, { deep: true })

// Save layout preference to localStorage
watch(layout, (newLayout) => {
  if (process.client) {
    localStorage.setItem('blog-layout-preference', newLayout)
  }
})

// Load layout preference from localStorage
onMounted(() => {
  if (process.client) {
    const savedLayout = localStorage.getItem('blog-layout-preference')
    if (savedLayout && ['grid', 'list'].includes(savedLayout)) {
      layout.value = savedLayout
    }
  }
})
</script>