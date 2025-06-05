<template>
  <div class="min-h-screen bg-gray-50 dark:bg-custom-slate-800">
    <!-- Loading State -->
    <div v-if="blogStore.loading" class="py-20">
      <div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div class="animate-pulse space-y-8">
          <div class="h-8 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
          <div class="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
          <div class="h-64 bg-gray-300 dark:bg-gray-600 rounded"></div>
          <div class="space-y-4">
            <div class="h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
            <div class="h-4 bg-gray-300 dark:bg-gray-600 rounded w-5/6"></div>
            <div class="h-4 bg-gray-300 dark:bg-gray-600 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="blogStore.error" class="py-20">
      <div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <ExclamationTriangleIcon class="h-16 w-16 text-red-500 mx-auto mb-4" />
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Post Not Found</h1>
        <p class="text-gray-600 dark:text-gray-400 mb-6">{{ blogStore.error }}</p>
        <BaseButton to="/blog" variant="primary">
          Back to Blog
        </BaseButton>
      </div>
    </div>

    <!-- Blog Post Content -->
    <article v-else-if="post" class="py-16">
      <div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <!-- Post Header -->
        <header class="mb-12">
          <!-- Breadcrumbs -->
          <nav class="mb-8">
            <ol class="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <li>
                <NuxtLink
                  to="/"
                  class="hover:text-custom-blue-800 dark:hover:text-custom-blue-400 transition-colors duration-200"
                >
                  Home
                </NuxtLink>
              </li>
              <li>/</li>
              <li>
                <NuxtLink
                  to="/blog"
                  class="hover:text-custom-blue-800 dark:hover:text-custom-blue-400 transition-colors duration-200"
                >
                  Blog
                </NuxtLink>
              </li>
              <li>/</li>
              <li class="text-gray-900 dark:text-white">{{ post.title }}</li>
            </ol>
          </nav>

          <!-- Featured Image -->
          <div v-if="post.image_url" class="mb-8">
            <img
              :src="post.image_url"
              :alt="post.title"
              class="w-full h-64 md:h-96 object-cover rounded-xl shadow-lg"
              loading="eager"
            />
          </div>

          <!-- Title -->
          <h1 class="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            {{ post.title }}
          </h1>

          <!-- Summary -->
          <p v-if="post.summary" class="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
            {{ post.summary }}
          </p>

          <!-- Meta Information -->
          <div class="flex flex-wrap items-center gap-6 text-sm text-gray-500 dark:text-gray-400 mb-8">
            <div class="flex items-center">
              <CalendarIcon class="h-5 w-5 mr-2" />
              <time :datetime="post.published_at">
                {{ formatDate(post.published_at, { year: 'numeric', month: 'long', day: 'numeric' }) }}
              </time>
            </div>
            
            <div v-if="post.read_time" class="flex items-center">
              <ClockIcon class="h-5 w-5 mr-2" />
              <span>{{ post.read_time }} min read</span>
            </div>

            <div v-if="post.tags && post.tags.length > 0" class="flex items-center">
              <TagIcon class="h-5 w-5 mr-2" />
              <div class="flex flex-wrap gap-2">
                <NuxtLink
                  v-for="tag in post.tags"
                  :key="tag"
                  :to="`/blog?tag=${tag}`"
                  class="px-2 py-1 bg-custom-blue-100 dark:bg-custom-blue-800/20 text-custom-blue-800 dark:text-custom-blue-400 rounded-full text-xs font-medium hover:bg-custom-blue-200 dark:hover:bg-custom-blue-800/30 transition-colors duration-200"
                >
                  {{ formatTagForDisplay(tag) }}
                </NuxtLink>
              </div>
            </div>
          </div>
        </header>

        <!-- Post Content -->
        <div class="prose prose-lg dark:prose-invert max-w-none">
          <BlogMarkdownRenderer :content="post.content" />
        </div>

        <!-- Post Footer -->
        <footer class="mt-16 pt-8 border-t border-gray-200 dark:border-custom-slate-700">
          <!-- Share Buttons -->
          <div class="mb-8">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Share this post</h3>
            <div class="flex space-x-4">
              <a
                :href="`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(shareUrl)}`"
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
              >
                <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
                </svg>
                Twitter
              </a>
              
              <a
                :href="`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`"
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors duration-200"
              >
                <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                LinkedIn
              </a>
            </div>
          </div>

          <!-- Navigation -->
          <div class="flex flex-col sm:flex-row justify-between items-center gap-4">
            <BaseButton to="/blog" variant="ghost">
              ← Back to Blog
            </BaseButton>
            
            <BaseButton to="/contact" variant="primary">
              Get In Touch
            </BaseButton>
          </div>
        </footer>
      </div>
    </article>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { 
  CalendarIcon, 
  ClockIcon, 
  TagIcon, 
  ExclamationTriangleIcon 
} from '@heroicons/vue/24/outline'
import { useBlogStore } from '~/stores/blog.store'
import { formatDate } from '~/utils/dates.util'
import { capitalizeWords } from '~/utils/format.util'

// Get route params
const route = useRoute()
const { slug } = route.params

// Store
const blogStore = useBlogStore()

// Computed
const post = computed(() => blogStore.currentPost)

const shareUrl = computed(() => {
  if (process.client) {
    return window.location.href
  }
  return `https://reynantlntno.netlify.app/blog/${slug}`
})

// Methods
const formatTagForDisplay = (tag) => {
  return capitalizeWords(tag.replace(/-/g, ' '))
}

// SEO - Dynamic based on post
watchEffect(() => {
  if (post.value) {
    useHead({
      title: `${post.value.title} - Reynan Tolentino`,
      meta: [
        {
          name: 'description',
          content: post.value.meta_description || post.value.summary || post.value.title
        },
        { property: 'og:title', content: post.value.meta_title || post.value.title },
        { property: 'og:description', content: post.value.meta_description || post.value.summary || post.value.title },
        { property: 'og:type', content: 'article' },
        { property: 'og:image', content: post.value.image_url || '' },
        { property: 'article:published_time', content: post.value.published_at },
        { property: 'article:author', content: 'Reynan Tolentino' },
        { name: 'twitter:card', content: 'summary_large_image' }
      ]
    })
  }
})

// Lifecycle
onMounted(async () => {
  if (!post.value || post.value.slug !== slug) {
    await blogStore.fetchPostBySlug(slug)
  }

  // Handle 404
  if (!blogStore.loading && !post.value) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Blog post not found'
    })
  }
})

// Clear current post on unmount
onUnmounted(() => {
  blogStore.clearCurrentPost()
})
</script>