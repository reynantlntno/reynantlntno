<template>
  <div class="min-h-screen bg-gray-50 dark:bg-custom-slate-800">
    <!-- Hero Section -->
    <section class="gradient-steel text-white py-20">
      <div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <h1 class="text-4xl md:text-5xl font-bold mb-6">Projects</h1>
        <p class="text-xl text-gray-300">
          A showcase of my work, featuring various technologies and solutions I've built.
        </p>
      </div>
    </section>

    <!-- Filters and Search -->
    <section class="bg-white dark:bg-custom-slate-800 border-b border-gray-200 dark:border-custom-slate-700 sticky top-16 z-30">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <!-- Search -->
          <div class="w-full lg:w-1/3">
            <BaseSearch
              v-model="searchQuery"
              placeholder="Search projects..."
              :loading="projectsStore.loading"
              @search="handleSearch"
              @clear="clearSearch"
            />
          </div>

          <!-- Technology Filter -->
          <div class="flex flex-wrap gap-2">
            <button
              v-for="tech in popularTechnologies"
              :key="tech"
              @click="toggleTechnology(tech)"
              :class="[
                'px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200',
                selectedTechnologies.includes(tech)
                  ? 'bg-custom-blue-800 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-custom-blue-100 dark:hover:bg-custom-blue-900/20'
              ]"
            >
              {{ tech }}
            </button>
          </div>

          <!-- Filter Controls -->
          <div class="flex items-center gap-4">
            <button
              @click="toggleFeaturedFilter"
              :class="[
                'px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200',
                featuredFilter
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/20'
              ]"
            >
              Featured Only
            </button>

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
      </div>
    </section>

    <!-- Projects Grid -->
    <section class="py-16">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <!-- Loading State -->
        <div v-if="projectsStore.loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div v-for="i in 6" :key="i" class="card p-6">
            <div class="animate-pulse">
              <div class="h-48 bg-gray-300 dark:bg-gray-600 rounded mb-4"></div>
              <div class="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
              <div class="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
            </div>
          </div>
        </div>

        <!-- Error State -->
        <div v-else-if="projectsStore.error" class="text-center py-12">
          <ExclamationTriangleIcon class="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Failed to load projects</h3>
          <p class="text-gray-600 dark:text-gray-400 mb-6">{{ projectsStore.error }}</p>
          <BaseButton @click="projectsStore.fetchProjects()" variant="primary">
            Try Again
          </BaseButton>
        </div>

        <!-- Projects Grid -->
        <div v-else-if="projectsStore.projects.length > 0" class="space-y-8">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ProjectCard
              v-for="project in projectsStore.projects"
              :key="project.id"
              :project="project"
              @tech-click="handleTechClick"
            />
          </div>

          <!-- Pagination -->
          <div class="mt-12">
            <Pagination
              :current-page="projectsStore.pagination.page"
              :total-pages="projectsStore.pagination.totalPages"
              :total="projectsStore.pagination.total"
              :per-page="projectsStore.pagination.limit"
              @page-change="handlePageChange"
            />
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-12">
          <FolderIcon class="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {{ hasFilters ? 'No projects found' : 'No projects yet' }}
          </h3>
          <p class="text-gray-600 dark:text-gray-400">
            {{ hasFilters ? 'Try adjusting your search criteria.' : 'Projects will appear here once they\'re added.' }}
          </p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { FolderIcon, ExclamationTriangleIcon } from '@heroicons/vue/24/outline'
import { useProjectsStore } from '~/stores/projects.store'

// SEO
useHead({
  title: 'Projects - Reynan Tolentino',
  meta: [
    {
      name: 'description',
      content: 'Explore my portfolio of software development projects, featuring web applications, APIs, and innovative solutions.'
    },
    { property: 'og:title', content: 'Projects - Reynan Tolentino' },
    { property: 'og:description', content: 'Explore my portfolio of software development projects, featuring web applications, APIs, and innovative solutions.' }
  ]
})

// Store
const projectsStore = useProjectsStore()

// State
const searchQuery = ref('')
const selectedTechnologies = ref([])
const featuredFilter = ref(false)

// Computed
const popularTechnologies = computed(() => projectsStore.allTechnologies.slice(0, 10))

const hasFilters = computed(() => {
  return searchQuery.value || selectedTechnologies.value.length > 0 || featuredFilter.value
})

// Methods
const handleSearch = (query) => {
  searchQuery.value = query
  projectsStore.searchProjects(query)
}

const clearSearch = () => {
  searchQuery.value = ''
  projectsStore.clearFilters()
  projectsStore.fetchProjects()
}

const toggleTechnology = (tech) => {
  const index = selectedTechnologies.value.indexOf(tech)
  if (index > -1) {
    selectedTechnologies.value.splice(index, 1)
  } else {
    selectedTechnologies.value.push(tech)
  }
  
  projectsStore.filters.technologies = [...selectedTechnologies.value]
  projectsStore.pagination.page = 1
  projectsStore.fetchProjects()
}

const handleTechClick = (tech) => {
  if (!selectedTechnologies.value.includes(tech)) {
    toggleTechnology(tech)
  }
}

const toggleFeaturedFilter = () => {
  featuredFilter.value = !featuredFilter.value
  projectsStore.filters.featured = featuredFilter.value ? true : null
  projectsStore.pagination.page = 1
  projectsStore.fetchProjects()
}

const clearFilters = () => {
  searchQuery.value = ''
  selectedTechnologies.value = []
  featuredFilter.value = false
  projectsStore.clearFilters()
  projectsStore.fetchProjects()
}

const handlePageChange = (page) => {
  projectsStore.changePage(page)
  
  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// Lifecycle
onMounted(() => {
  projectsStore.fetchProjects()
})

// Watch route query parameters for deep linking
const route = useRoute()
watch(() => route.query, (newQuery) => {
  if (newQuery.search) {
    searchQuery.value = newQuery.search
    handleSearch(newQuery.search)
  }
  
  if (newQuery.tech) {
    const tech = Array.isArray(newQuery.tech) ? newQuery.tech[0] : newQuery.tech
    if (!selectedTechnologies.value.includes(tech)) {
      toggleTechnology(tech)
    }
  }
  
  if (newQuery.featured === 'true') {
    featuredFilter.value = true
    toggleFeaturedFilter()
  }
}, { immediate: true })
</script>