<template>
  <div class="min-h-screen bg-gray-50 dark:bg-custom-slate-800">
    <!-- Loading State -->
    <div v-if="projectsStore.loading" class="py-20">
      <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div class="animate-pulse space-y-8">
          <div class="h-8 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
          <div class="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
          <div class="h-96 bg-gray-300 dark:bg-gray-600 rounded"></div>
          <div class="space-y-4">
            <div class="h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
            <div class="h-4 bg-gray-300 dark:bg-gray-600 rounded w-5/6"></div>
            <div class="h-4 bg-gray-300 dark:bg-gray-600 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="projectsStore.error" class="py-20">
      <div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <ExclamationTriangleIcon class="h-16 w-16 text-red-500 mx-auto mb-4" />
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Project Not Found</h1>
        <p class="text-gray-600 dark:text-gray-400 mb-6">{{ projectsStore.error }}</p>
        <BaseButton to="/projects" variant="primary">
          Back to Projects
        </BaseButton>
      </div>
    </div>

    <!-- Project Content -->
    <div v-else-if="project" class="py-16">
      <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
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
                to="/projects"
                class="hover:text-custom-blue-800 dark:hover:text-custom-blue-400 transition-colors duration-200"
              >
                Projects
              </NuxtLink>
            </li>
            <li>/</li>
            <li class="text-gray-900 dark:text-white">{{ project.title }}</li>
          </ol>
        </nav>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <!-- Main Content -->
          <div class="lg:col-span-2 space-y-8">
            <!-- Project Header -->
            <header>
              <div class="flex items-start justify-between mb-6">
                <div class="flex-1">
                  <h1 class="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
                    {{ project.title }}
                  </h1>
                  
                  <!-- Featured Badge -->
                  <div v-if="project.featured" class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-800/20 dark:text-emerald-400 mb-4">
                    <StarIcon class="w-4 h-4 mr-1" />
                    Featured Project
                  </div>
                </div>
              </div>

              <!-- Description -->
              <p class="text-xl text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
                {{ project.description }}
              </p>

              <!-- Action Buttons -->
              <div class="flex flex-wrap gap-4 mb-8">
                <a
                  v-if="project.demo_url"
                  :href="project.demo_url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center px-6 py-3 bg-custom-blue-800 hover:bg-custom-blue-900 text-white font-medium rounded-lg transition-all duration-200 hover:shadow-lg hover:scale-105"
                >
                  <ArrowTopRightOnSquareIcon class="w-5 h-5 mr-2" />
                  View Live Demo
                </a>
                
                <a
                  v-if="project.github_url"
                  :href="project.github_url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center px-6 py-3 bg-transparent border-2 border-custom-blue-800 text-custom-blue-800 dark:text-custom-blue-400 hover:bg-custom-blue-800 hover:text-white font-medium rounded-lg transition-all duration-200"
                >
                  <CodeBracketIcon class="w-5 h-5 mr-2" />
                  View Source
                </a>
              </div>
            </header>

            <!-- Project Gallery -->
            <section v-if="project.id">
              <ProjectGallery
                :project-id="project.id"
                :project-slug="project.slug"
                :project-title="project.title"
              />
            </section>

            <!-- Detailed Content -->
            <section v-if="project.content" class="card p-8">
              <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Project Details</h2>
              <div class="prose prose-lg dark:prose-invert max-w-none">
                <BlogMarkdownRenderer :content="project.content" />
              </div>
            </section>
          </div>

          <!-- Sidebar -->
          <div class="lg:col-span-1 space-y-6">
            <!-- Technologies -->
            <div class="card p-6">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Technologies Used</h3>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="tech in project.technologies"
                  :key="tech"
                  class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-custom-blue-100 text-custom-blue-800 dark:bg-custom-blue-800/20 dark:text-custom-blue-400"
                >
                  {{ tech }}
                </span>
              </div>
            </div>

            <!-- Project Info -->
            <div class="card p-6">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Project Info</h3>
              <dl class="space-y-4">
                <div>
                  <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Created</dt>
                  <dd class="text-sm text-gray-900 dark:text-white">
                    {{ formatDate(project.created_at, { year: 'numeric', month: 'long', day: 'numeric' }) }}
                  </dd>
                </div>
                
                <div>
                  <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Last Updated</dt>
                  <dd class="text-sm text-gray-900 dark:text-white">
                    {{ formatDate(project.updated_at, { year: 'numeric', month: 'long', day: 'numeric' }) }}
                  </dd>
                </div>

                <div v-if="project.github_url">
                  <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Repository</dt>
                  <dd>
                    <a
                      :href="project.github_url"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="text-sm text-custom-blue-800 dark:text-custom-blue-400 hover:underline"
                    >
                      View on GitHub
                    </a>
                  </dd>
                </div>

                <div v-if="project.demo_url">
                  <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Live Demo</dt>
                  <dd>
                    <a
                      :href="project.demo_url"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="text-sm text-custom-blue-800 dark:text-custom-blue-400 hover:underline"
                    >
                      View Live Site
                    </a>
                  </dd>
                </div>
              </dl>
            </div>

            <!-- Contact CTA -->
            <div class="card p-6 bg-custom-blue-50 dark:bg-custom-blue-900/20 border-custom-blue-200 dark:border-custom-blue-800">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">Interested in Similar Work?</h3>
              <p class="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Let's discuss how I can help bring your project ideas to life.
              </p>
              <BaseButton to="/contact" variant="primary" size="sm" class="w-full">
                Get In Touch
              </BaseButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { 
  StarIcon,
  ArrowTopRightOnSquareIcon, 
  CodeBracketIcon,
  ExclamationTriangleIcon 
} from '@heroicons/vue/24/outline'
import { useProjectsStore } from '~/stores/projects.store'
import { formatDate } from '~/utils/dates.util'

// Get route params
const route = useRoute()
const { slug } = route.params

// Store
const projectsStore = useProjectsStore()

// Computed
const project = computed(() => projectsStore.currentProject)

// SEO - Dynamic based on project
watchEffect(() => {
  if (project.value) {
    useHead({
      title: `${project.value.title} - Reynan Tolentino`,
      meta: [
        {
          name: 'description',
          content: project.value.description
        },
        { property: 'og:title', content: project.value.title },
        { property: 'og:description', content: project.value.description },
        { property: 'og:type', content: 'website' },
        { property: 'og:image', content: project.value.thumbnail_url || '' },
        { name: 'twitter:card', content: 'summary_large_image' }
      ]
    })
  }
})

// Lifecycle
onMounted(async () => {
  if (!project.value || project.value.slug !== slug) {
    await projectsStore.fetchProjectBySlug(slug)
  }

  // Handle 404
  if (!projectsStore.loading && !project.value) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Project not found'
    })
  }
})

// Clear current project on unmount
onUnmounted(() => {
  projectsStore.clearCurrentProject()
})
</script>