<template>
  <div class="space-y-8">
    <!-- Loading State -->
    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div v-for="i in limit" :key="i" class="card p-6">
        <div class="animate-pulse">
          <div class="h-48 bg-gray-300 dark:bg-gray-600 rounded mb-4"></div>
          <div class="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
          <div class="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2 mb-4"></div>
          <div class="space-y-2">
            <div class="h-3 bg-gray-300 dark:bg-gray-600 rounded"></div>
            <div class="h-3 bg-gray-300 dark:bg-gray-600 rounded w-5/6"></div>
            <div class="h-3 bg-gray-300 dark:bg-gray-600 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-12">
      <ExclamationTriangleIcon class="h-16 w-16 text-red-500 mx-auto mb-4" />
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Failed to load posts</h3>
      <p class="text-gray-600 dark:text-gray-400 mb-6">{{ error }}</p>
      <BaseButton @click="$emit('retry')" variant="primary">
        Try Again
      </BaseButton>
    </div>

    <!-- Posts Grid -->
    <div v-else-if="posts.length > 0">
      <!-- Grid Layout -->
      <div v-if="layout === 'grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <BlogCard
          v-for="post in posts"
          :key="post.id"
          :post="post"
          @click="$emit('post-click', post)"
          @tech-click="$emit('tag-click', $event)"
        />
      </div>

      <!-- List Layout -->
      <div v-else class="space-y-6">
        <article
          v-for="post in posts"
          :key="post.id"
          class="card p-6 hover:shadow-lg transition-shadow duration-200 cursor-pointer"
          @click="navigateToPost(post)"
        >
          <div class="flex flex-col lg:flex-row gap-6">
            <!-- Image -->
            <div class="lg:w-1/3">
              <div class="relative h-48 lg:h-32 overflow-hidden rounded-lg">
                <img
                  v-if="post.image_url"
                  :src="post.image_url"
                  :alt="post.title"
                  class="w-full h-full object-cover"
                  loading="lazy"
                />
                <div
                  v-else
                  class="w-full h-full bg-gradient-to-br from-custom-blue-800 to-custom-slate-700 flex items-center justify-center"
                >
                  <DocumentTextIcon class="h-8 w-8 text-white/70" />
                </div>
              </div>
            </div>

            <!-- Content -->
            <div class="lg:w-2/3 flex flex-col justify-between">
              <div>
                <!-- Tags -->
                <div v-if="post.tags && post.tags.length > 0" class="flex flex-wrap gap-2 mb-3">
                  <span
                    v-for="tag in post.tags.slice(0, 3)"
                    :key="tag"
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-custom-blue-100 text-custom-blue-800 dark:bg-custom-blue-800/20 dark:text-custom-blue-400 cursor-pointer hover:bg-custom-blue-200 dark:hover:bg-custom-blue-800/30"
                    @click.stop="$emit('tag-click', tag)"
                  >
                    {{ formatTagForDisplay(tag) }}
                  </span>
                </div>

                <!-- Title -->
                <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2 hover:text-custom-blue-800 dark:hover:text-custom-blue-400 transition-colors duration-200">
                  {{ post.title }}
                </h3>

                <!-- Summary -->
                <p v-if="post.summary" class="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                  {{ post.summary }}
                </p>
              </div>

              <!-- Footer -->
              <div class="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                <time :datetime="post.published_at">
                  {{ formatDate(post.published_at) }}
                </time>
                
                <div class="flex items-center space-x-4">
                  <div class="flex items-center space-x-1">
                    <ClockIcon class="h-4 w-4" />
                    <span>{{ post.read_time || 5 }} min read</span>
                  </div>
                  
                  <span class="text-custom-blue-800 dark:text-custom-blue-400 hover:underline">
                    Read more →
                  </span>
                </div>
              </div>
            </div>
          </div>
        </article>
      </div>

      <!-- Load More Button -->
      <div v-if="showLoadMore" class="text-center mt-8">
        <BaseButton
          @click="$emit('load-more')"
          variant="secondary"
          :loading="loadingMore"
        >
          Load More Posts
        </BaseButton>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12">
      <DocumentTextIcon class="h-16 w-16 text-gray-400 mx-auto mb-4" />
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
        {{ emptyMessage }}
      </h3>
      <p class="text-gray-600 dark:text-gray-400">
        {{ emptyDescription }}
      </p>
      
      <div v-if="hasFilters" class="mt-6">
        <BaseButton @click="$emit('clear-filters')" variant="secondary">
          Clear Filters
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { DocumentTextIcon, ClockIcon, ExclamationTriangleIcon } from '@heroicons/vue/24/outline'
import { formatDate } from '~/utils/dates.util'

const props = defineProps({
  posts: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  loadingMore: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: null
  },
  layout: {
    type: String,
    default: 'grid',
    validator: (value) => ['grid', 'list'].includes(value)
  },
  limit: {
    type: Number,
    default: 9
  },
  showLoadMore: {
    type: Boolean,
    default: false
  },
  hasFilters: {
    type: Boolean,
    default: false
  },
  emptyMessage: {
    type: String,
    default: 'No blog posts found'
  },
  emptyDescription: {
    type: String,
    default: 'Posts will appear here once they\'re published.'
  }
})

const emit = defineEmits(['post-click', 'tag-click', 'load-more', 'clear-filters', 'retry'])

// Methods
const formatTagForDisplay = (tag) => {
  return tag.charAt(0).toUpperCase() + tag.slice(1).replace(/-/g, ' ')
}

const navigateToPost = (post) => {
  navigateTo(`/blog/${post.slug}`)
  emit('post-click', post)
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>