<template>
  <div class="min-h-screen bg-gray-50 dark:bg-custom-slate-800">
    <!-- Hero Section -->
    <section class="gradient-steel text-white py-20">
      <div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <h1 class="text-4xl md:text-5xl font-bold mb-6">About Me</h1>
        <p class="text-xl text-gray-300">
          Get to know more about my background, skills, and experience in software development.
        </p>
      </div>
    </section>

    <!-- Main Content -->
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      <!-- Loading State -->
      <div v-if="aboutStore.loading" class="space-y-12">
        <div class="card p-8">
          <div class="animate-pulse space-y-4">
            <div class="h-6 bg-gray-300 dark:bg-gray-600 rounded w-1/4"></div>
            <div class="space-y-2">
              <div class="h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
              <div class="h-4 bg-gray-300 dark:bg-gray-600 rounded w-5/6"></div>
              <div class="h-4 bg-gray-300 dark:bg-gray-600 rounded w-4/6"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="aboutStore.error" class="text-center py-12">
        <ExclamationTriangleIcon class="h-16 w-16 text-red-500 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Failed to load content</h3>
        <p class="text-gray-600 dark:text-gray-400 mb-6">{{ aboutStore.error }}</p>
        <BaseButton @click="aboutStore.fetchAll()" variant="primary">
          Try Again
        </BaseButton>
      </div>

      <!-- Content -->
      <div v-else class="space-y-16">
        <!-- About Content -->
        <section v-if="aboutContent" class="card p-8">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">About Me</h2>
          <div class="prose dark:prose-invert max-w-none">
            <div v-if="aboutContent.format === 'markdown'" v-html="renderMarkdown(aboutContent.content)"></div>
            <div v-else-if="aboutContent.format === 'json'">
              <div v-for="section in aboutContent.content" :key="section.id" class="mb-6">
                <h3 v-if="section.title" class="text-lg font-semibold mb-3">{{ section.title }}</h3>
                <p class="text-gray-600 dark:text-gray-300 leading-relaxed">{{ section.content }}</p>
              </div>
            </div>
            <div v-else>
              <p class="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{{ aboutContent.content }}</p>
            </div>
          </div>
        </section>

        <!-- Skills Section -->
        <section>
          <div class="text-center mb-12">
            <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">Skills & Expertise</h2>
            <p class="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              A comprehensive overview of my technical skills and proficiency levels.
            </p>
          </div>
          
          <SkillsList />
        </section>

        <!-- Experience Timeline (if available) -->
        <section v-if="resumeContent" class="card p-8">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Experience</h2>
          <div class="prose dark:prose-invert max-w-none">
            <div v-if="resumeContent.format === 'markdown'" v-html="renderMarkdown(resumeContent.content)"></div>
            <div v-else-if="resumeContent.format === 'json'">
              <div v-for="experience in resumeContent.content" :key="experience.id" class="mb-8 last:mb-0">
                <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ experience.position }}</h3>
                  <span class="text-sm text-gray-500 dark:text-gray-400">{{ experience.duration }}</span>
                </div>
                <p class="text-custom-blue-800 dark:text-custom-blue-400 font-medium mb-2">{{ experience.company }}</p>
                <p class="text-gray-600 dark:text-gray-300">{{ experience.description }}</p>
                <div v-if="experience.technologies" class="flex flex-wrap gap-2 mt-3">
                  <span
                    v-for="tech in experience.technologies"
                    :key="tech"
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                  >
                    {{ tech }}
                  </span>
                </div>
              </div>
            </div>
            <div v-else>
              <p class="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{{ resumeContent.content }}</p>
            </div>
          </div>
        </section>

        <!-- Contact CTA -->
        <section class="text-center bg-custom-blue-50 dark:bg-custom-blue-900/20 rounded-xl p-8">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Interested in Working Together?
          </h2>
          <p class="text-lg text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
            I'm always open to discussing new opportunities and interesting projects.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <BaseButton to="/contact" variant="primary" size="lg">
              Get In Touch
            </BaseButton>
            <BaseButton to="/appointments" variant="secondary" size="lg">
              Schedule a Call
            </BaseButton>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { ExclamationTriangleIcon } from '@heroicons/vue/24/outline'
import { useAboutStore } from '~/stores/about.store'
import { marked } from 'marked'

// SEO
useHead({
  title: 'About - Reynan Tolentino',
  meta: [
    {
      name: 'description',
      content: 'Learn more about Reynan Tolentino, a full-stack software developer with expertise in web applications, API development, and database design.'
    },
    { property: 'og:title', content: 'About - Reynan Tolentino' },
    { property: 'og:description', content: 'Learn more about Reynan Tolentino, a full-stack software developer with expertise in web applications, API development, and database design.' }
  ]
})

// Store
const aboutStore = useAboutStore()

// Computed
const aboutContent = computed(() => aboutStore.getContentByType('about'))
const resumeContent = computed(() => aboutStore.getContentByType('resume'))

// Methods
const renderMarkdown = (content) => {
  return marked(content)
}

// Lifecycle
onMounted(() => {
  if (!aboutStore.hasContent) {
    aboutStore.fetchAll()
  }
})
</script>