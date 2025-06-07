<template>
  <div class="min-h-screen bg-carbon-950">
    <!-- Hero Section -->
    <section class="relative py-24 lg:py-32 overflow-hidden">
      <!-- Background Pattern -->
      <div class="absolute inset-0 opacity-5">
        <div class="grid-background"></div>
      </div>
      
      <!-- Floating Code Elements -->
      <div class="absolute inset-0 overflow-hidden">
        <div class="floating-code-element absolute top-20 left-10 opacity-30 animate-float">
          <span class="font-mono text-xs text-accent-400">const insights = [</span>
        </div>
        <div class="floating-code-element absolute top-40 right-20 opacity-30 animate-float" style="animation-delay: 2s">
          <span class="font-mono text-xs text-syntax-variable">category: 'dev-thoughts'</span>
        </div>
        <div class="floating-code-element absolute bottom-32 left-1/4 opacity-30 animate-float" style="animation-delay: 4s">
          <span class="font-mono text-xs text-syntax-comment">// sharing knowledge</span>
        </div>
      </div>

      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <!-- Terminal-style Header -->
          <div class="inline-flex items-center space-x-2 mb-6">
            <div class="w-3 h-3 rounded-full bg-syntax-error"></div>
            <div class="w-3 h-3 rounded-full bg-syntax-warning"></div>
            <div class="w-3 h-3 rounded-full bg-syntax-success"></div>
            <span class="font-mono text-sm text-carbon-400 ml-3">~/blog/articles.md</span>
          </div>
          
          <h1 class="text-4xl md:text-6xl font-bold text-carbon-100 mb-6 leading-tight font-mono">
            <span class="text-syntax-keyword">export</span>
            <span class="text-syntax-function"> blog</span>
            <span class="text-carbon-300">[]</span>
          </h1>
          <p class="text-xl md:text-2xl text-carbon-300 mb-8 max-w-3xl mx-auto font-mono">
            <span class="text-syntax-comment">// Insights on software development, web technologies, and programming best practices</span>
          </p>
        </div>
      </div>
    </section>

    <!-- Search and Filters -->
    <section class="py-8 bg-carbon-900/50 backdrop-blur-sm border-y border-carbon-700/30">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col lg:flex-row gap-6 items-start lg:items-center">
          <!-- Search Terminal -->
          <div class="flex-1 max-w-lg">
            <div class="bg-carbon-800/50 rounded-ide border border-carbon-700/50 overflow-hidden">
              <div class="flex items-center px-3 py-2 bg-carbon-800 border-b border-carbon-700">
                <span class="text-syntax-comment font-mono text-xs mr-2">$</span>
                <span class="text-carbon-300 font-mono text-xs">search --query</span>
              </div>
              <div class="relative">
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="Enter search terms..."
                  class="w-full px-4 py-3 bg-transparent text-carbon-100 placeholder-carbon-500 focus:outline-none font-mono text-sm"
                  @keyup.enter="handleSearch"
                />
                <svg class="absolute right-3 top-3.5 w-4 h-4 text-carbon-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          <!-- Tag Filter -->
          <div class="flex items-center space-x-4">
            <div class="flex items-center space-x-2">
              <span class="text-syntax-comment font-mono text-sm">--filter</span>
              <select
                v-model="selectedTag"
                @change="handleTagFilter"
                class="bg-carbon-800/50 border border-carbon-700/50 rounded-ide px-3 py-2 text-carbon-100 focus:outline-none focus:border-accent-500/50 font-mono text-sm"
              >
                <option value="" class="bg-carbon-800 text-carbon-100">all.tags</option>
                <option
                  v-for="tag in availableTags"
                  :key="tag"
                  :value="tag"
                  class="bg-carbon-800 text-carbon-100"
                >
                  {{ tag.toLowerCase().replace(/\s+/g, '_') }}
                </option>
              </select>
            </div>

            <Button
              @click="clearFilters"
              variant="outline"
              size="sm"
              v-if="searchQuery || selectedTag"
              class="font-mono"
            >
              clear.filters()
            </Button>
          </div>
        </div>
      </div>
    </section>

    <!-- Blog Posts -->
    <section class="py-16 lg:py-24 bg-carbon-950">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div v-if="loading && posts.length === 0" class="flex justify-center">
          <Loader size="lg" text="compiling articles..." />
        </div>

        <div v-else-if="error" class="text-center">
          <div class="bg-syntax-error/10 border border-syntax-error/20 rounded-ide p-6 max-w-md mx-auto">
            <div class="text-syntax-error font-mono text-sm">
              <div class="flex items-center space-x-2 mb-2">
                <span class="text-syntax-comment">$</span>
                <span>blog.fetch()</span>
              </div>
              <div>Error: {{ error }}</div>
            </div>
            <Button @click="refreshPosts" variant="outline" size="sm" class="mt-4 font-mono">
              retry.fetch()
            </Button>
          </div>
        </div>

        <div v-else-if="posts.length === 0" class="text-center">
          <div class="max-w-md mx-auto">
            <!-- Empty State -->
            <div class="w-16 h-16 mx-auto mb-6 bg-carbon-800/50 rounded-ide flex items-center justify-center">
              <svg class="w-8 h-8 text-carbon-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div class="bg-carbon-900/50 rounded-ide border border-carbon-700/50 p-6">
              <div class="font-mono text-sm text-carbon-300 mb-4">
                <div class="flex items-center justify-center space-x-2 mb-2">
                  <span class="text-syntax-comment">$</span>
                  <span>articles.filter({{ getCurrentSearchFilter() }})</span>
                </div>
                <div class="text-center text-carbon-400">[] // no articles found</div>
              </div>
              <Button @click="clearFilters" variant="outline" size="sm" class="font-mono">
                clear.filters()
              </Button>
            </div>
          </div>
        </div>

        <div v-else>
          <!-- Featured Post (first post) -->
          <div v-if="posts.length > 0 && !searchQuery && !selectedTag" class="mb-16">
            <div class="bg-carbon-800/50 rounded-ide border border-carbon-700/50 overflow-hidden hover:border-accent-500/50 transition-all duration-300 hover:shadow-glow-accent">
              <!-- Featured Header -->
              <div class="flex items-center justify-between px-4 py-2 bg-carbon-800 border-b border-carbon-700">
                <div class="flex items-center space-x-2">
                  <span class="text-syntax-comment font-mono text-xs">1</span>
                  <span class="text-syntax-comment font-mono text-xs">/* Featured Article */</span>
                </div>
                <div class="flex items-center space-x-2">
                  <div class="w-2 h-2 bg-syntax-success rounded-full animate-pulse"></div>
                  <span class="text-xs font-mono text-carbon-400">featured</span>
                </div>
              </div>
              
              <div class="p-8">
                <div class="flex items-center space-x-4 mb-4">
                  <span class="bg-accent-500/90 text-white px-3 py-1 rounded-ide text-xs font-mono">featured</span>
                  <span class="text-carbon-400 font-mono text-sm">{{ formatDate(posts[0].published_at) }}</span>
                  <span v-if="posts[0].read_time" class="text-carbon-400 font-mono text-sm">
                    {{ formatReadingTime(posts[0].read_time) }}
                  </span>
                </div>
                
                <h2 class="text-3xl font-bold text-carbon-100 mb-4 font-mono">
                  <router-link 
                    :to="`/blog/${posts[0].slug}`"
                    class="hover:text-accent-400 transition-colors"
                  >
                    {{ posts[0].title }}
                  </router-link>
                </h2>
                
                <p class="text-carbon-300 text-lg mb-6 font-mono">
                  <span class="text-syntax-comment">// </span>{{ posts[0].summary }}
                </p>
                
                <div class="flex items-center justify-between">
                  <div class="flex flex-wrap gap-2">
                    <span
                      v-for="tag in posts[0].tags?.slice(0, 3)"
                      :key="tag"
                      class="bg-carbon-700/50 text-accent-400 px-2 py-1 rounded text-xs font-mono border border-carbon-600/50"
                    >
                      {{ tag.toLowerCase().replace(/\s+/g, '_') }}
                    </span>
                  </div>
                  
                  <Button
                    :to="`/blog/${posts[0].slug}`"
                    variant="accent"
                    size="sm"
                    class="font-mono"
                  >
                    read.article()
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <!-- Posts Count Info -->
          <div class="mb-8">
            <div class="flex items-center space-x-2 text-sm font-mono text-carbon-400">
              <span class="text-syntax-comment">//</span>
              <span>Found {{ totalArticleCount }} article{{ totalArticleCount !== 1 ? 's' : '' }}</span>
              <span v-if="searchQuery || selectedTag" class="text-accent-400">
                ({{ searchQuery ? `search: "${searchQuery}"` : '' }}{{ searchQuery && selectedTag ? ', ' : '' }}{{ selectedTag ? `tag: "${selectedTag}"` : '' }})
              </span>
            </div>
          </div>

          <!-- Regular Posts Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <BlogCard
              v-for="(post, index) in displayPosts"
              :key="post.id"
              :post="post"
              :class="[
                'transform hover:scale-105 transition-all duration-300',
                'opacity-0 animate-fade-in'
              ]"
              :style="{ animationDelay: `${index * 0.1}s` }"
            />
          </div>

          <!-- Load More / Pagination -->
          <div class="mt-12">
            <div v-if="hasMorePosts" class="text-center">
              <Button
                @click="loadMore"
                :loading="loading"
                variant="outline"
                size="lg"
                class="font-mono"
              >
                <template #icon-left v-if="!loading">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  </svg>
                </template>
                {{ loading ? 'loading...' : 'load.more()' }}
              </Button>
            </div>

            <Pagination
              v-if="pagination.totalPages > 1"
              :current-page="pagination.currentPage"
              :total-pages="pagination.totalPages"
              :total-items="pagination.totalItems"
              :items-per-page="10"
              :has-next="pagination.hasNext"
              :has-prev="pagination.hasPrev"
              @page-changed="handlePageChange"
              class="mt-8"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Blog Stats Section -->
    <section class="py-16 bg-carbon-900 border-t border-carbon-700/30">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-2xl md:text-3xl font-bold text-carbon-100 mb-4 font-mono">
            <span class="text-syntax-comment"># </span>
            <span class="text-syntax-function">Blog Statistics</span>
          </h2>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div class="bg-carbon-800/50 rounded-ide border border-carbon-700/50 p-6 text-center">
            <div class="text-2xl font-bold text-accent-400 font-mono mb-2">{{ posts.length }}+</div>
            <div class="text-carbon-300 font-mono text-sm">total_articles</div>
          </div>
          <div class="bg-carbon-800/50 rounded-ide border border-carbon-700/50 p-6 text-center">
            <div class="text-2xl font-bold text-syntax-success font-mono mb-2">{{ availableTags.length }}+</div>
            <div class="text-carbon-300 font-mono text-sm">categories</div>
          </div>
          <div class="bg-carbon-800/50 rounded-ide border border-carbon-700/50 p-6 text-center">
            <div class="text-2xl font-bold text-syntax-warning font-mono mb-2">∞</div>
            <div class="text-carbon-300 font-mono text-sm">knowledge_shared</div>
          </div>
          <div class="bg-carbon-800/50 rounded-ide border border-carbon-700/50 p-6 text-center">
            <div class="text-2xl font-bold text-syntax-variable font-mono mb-2">24/7</div>
            <div class="text-carbon-300 font-mono text-sm">learning_mode</div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-16 lg:py-24 bg-gradient-to-br from-carbon-950 via-carbon-900 to-accent-950/20 relative overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-r from-accent-900/10 to-accent-800/10"></div>
      <div class="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="space-y-8">
          <div>
            <h2 class="text-3xl md:text-4xl font-bold text-carbon-100 mb-6 font-mono">
              <span class="text-syntax-keyword">function</span>
              <span class="text-syntax-function"> subscribe</span>
              <span class="text-carbon-300">() {</span>
            </h2>
            <p class="text-xl text-carbon-300 font-mono mb-4">
              <span class="text-syntax-comment">  // Stay updated with latest insights</span>
            </p>
            <p class="text-lg text-carbon-400 font-mono">
              <span class="text-syntax-keyword">  return</span>
              <span class="text-syntax-string"> 'Never stop learning'</span>
            </p>
          </div>
          
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              to="/contact"
              variant="accent"
              size="lg"
              class="text-base px-8 py-3 font-mono"
            >
              <template #icon-left>
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </template>
              get.notifications()
            </Button>
            <Button
              to="/rss"
              variant="outline"
              size="lg"
              class="text-base px-8 py-3 font-mono"
            >
              <template #icon-left>
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3.429 2.29c9.314 0 16.865 7.551 16.865 16.865h-3.714c0-7.243-5.908-13.151-13.151-13.151v-3.714zm0 5.571c5.793 0 10.494 4.701 10.494 10.494h-3.714c0-3.736-3.044-6.78-6.78-6.78v-3.714zm3.714 7.429c1.024 0 1.857.833 1.857 1.857s-.833 1.857-1.857 1.857-1.857-.833-1.857-1.857.833-1.857 1.857-1.857z"/>
                </svg>
              </template>
              rss.feed()
            </Button>
          </div>
          
          <div class="text-carbon-300 font-mono text-xl">
            <span class="text-carbon-300">}</span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { onMounted, watch, ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useBlogStore } from '@/stores/blog/blog.store'
import { formatReadingTime } from '@/utils/format.util'
import { formatDate } from '@/utils/date.util'
import Button from '@/components/ui/Button.vue'
import Loader from '@/components/ui/Loader.vue'
import BlogCard from '@/components/blog/BlogCard.vue'
import Pagination from '@/components/common/Pagination.vue'

// Store
const blogStore = useBlogStore()
const { posts, pagination, availableTags, loading, error, hasMorePosts } = storeToRefs(blogStore)

// Local state
const searchQuery = ref('')
const selectedTag = ref('')
const searchTimeout = ref(null)

// Computed
const displayPosts = computed(() => {
  // Skip first post if it's featured and no filters applied
  if (!searchQuery.value && !selectedTag.value && posts.value.length > 0) {
    return posts.value.slice(1)
  }
  return posts.value
})

// Add this computed property to get the correct article count
const totalArticleCount = computed(() => {
  // If we have filters applied, show the actual filtered count
  if (searchQuery.value || selectedTag.value) {
    return posts.value.length
  }
  // If no filters, we show all posts (including the featured one)
  return posts.value.length
})

const getCurrentSearchFilter = () => {
  const filters = []
  if (searchQuery.value) filters.push(`query: "${searchQuery.value}"`)
  if (selectedTag.value) filters.push(`tag: "${selectedTag.value}"`)
  return filters.length > 0 ? filters.join(', ') : 'article => true'
}

// Methods
const handleSearch = () => {
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }
  
  searchTimeout.value = setTimeout(() => {
    performSearch()
  }, 300)
}

const performSearch = () => {
  blogStore.searchPosts(searchQuery.value, 1, 10)
}

const handleTagFilter = () => {
  if (selectedTag.value) {
    blogStore.getPostsByTag(selectedTag.value, 1, 10)
  } else {
    blogStore.fetchPosts({ page: 1, limit: 10 })
  }
}

const clearFilters = () => {
  searchQuery.value = ''
  selectedTag.value = ''
  blogStore.clearFilters()
  blogStore.fetchPosts({ page: 1, limit: 10 })
}

const loadMore = () => {
  blogStore.loadMorePosts()
}

const handlePageChange = (page) => {
  const params = {
    page,
    limit: 10
  }
  
  if (searchQuery.value) {
    params.search = searchQuery.value
  }
  
  if (selectedTag.value) {
    params.tag = selectedTag.value
  }
  
  blogStore.fetchPosts(params)
  
  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const refreshPosts = () => {
  blogStore.refreshPosts()
}

// Watch for search query changes
watch(searchQuery, () => {
  if (searchQuery.value.length > 2 || searchQuery.value === '') {
    handleSearch()
  }
})

// Initialize data
onMounted(() => {
  blogStore.fetchPosts({ page: 1, limit: 10 })
})
</script>

<style scoped>
/* Grid Background */
.grid-background {
  background-image: 
    linear-gradient(rgba(0, 122, 204, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 122, 204, 0.1) 1px, transparent 1px);
  background-size: 50px 50px;
  width: 100%;
  height: 100%;
}

/* Floating Code Elements */
.floating-code-element {
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

/* Fade in animation for blog cards */
@keyframes fade-in {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.6s ease-out forwards;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .floating-code-element {
    display: none;
  }
}
</style>