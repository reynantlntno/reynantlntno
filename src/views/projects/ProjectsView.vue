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
          <span class="font-mono text-xs text-accent-400">const projects = [</span>
        </div>
        <div class="floating-code-element absolute top-40 right-20 opacity-30 animate-float" style="animation-delay: 2s">
          <span class="font-mono text-xs text-syntax-variable">status: 'building'</span>
        </div>
        <div class="floating-code-element absolute bottom-32 left-1/4 opacity-30 animate-float" style="animation-delay: 4s">
          <span class="font-mono text-xs text-syntax-comment">// innovative solutions</span>
        </div>
      </div>

      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <!-- Terminal-style Header -->
          <div class="inline-flex items-center space-x-2 mb-6">
            <div class="w-3 h-3 rounded-full bg-syntax-error"></div>
            <div class="w-3 h-3 rounded-full bg-syntax-warning"></div>
            <div class="w-3 h-3 rounded-full bg-syntax-success"></div>
            <span class="font-mono text-sm text-carbon-400 ml-3">~/projects/portfolio.json</span>
          </div>
          
          <h1 class="text-4xl md:text-6xl font-bold text-carbon-100 mb-6 leading-tight font-mono">
            <span class="text-syntax-keyword">export</span>
            <span class="text-syntax-function"> projects</span>
            <span class="text-carbon-300">[]</span>
          </h1>
          <p class="text-xl md:text-2xl text-carbon-300 mb-8 max-w-3xl mx-auto font-mono">
            <span class="text-syntax-comment">// Collection of innovative applications built with modern tech</span>
          </p>
        </div>
      </div>
    </section>

    <!-- Filters Section -->
    <section class="py-8 bg-carbon-900/50 backdrop-blur-sm border-y border-carbon-700/30">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col lg:flex-row gap-6 items-start lg:items-center">
          <!-- Technology Filter -->
          <div class="flex flex-wrap items-center gap-3">
            <div class="flex items-center space-x-2">
              <span class="text-syntax-comment font-mono text-sm">$</span>
              <span class="text-carbon-100 font-mono text-sm">filter --by</span>
            </div>
            <button
              @click="clearTechnologyFilter"
              :class="[
                'px-3 py-1.5 rounded-ide text-xs font-mono transition-all duration-200',
                !selectedTechnology 
                  ? 'bg-accent-500 text-white shadow-glow-accent' 
                  : 'bg-carbon-800/50 text-carbon-300 hover:bg-carbon-700/50 hover:text-carbon-100 border border-carbon-600/50'
              ]"
            >
              all.tech
            </button>
            <button
              v-for="tech in availableTechnologies"
              :key="tech"
              @click="selectTechnology(tech)"
              :class="[
                'px-3 py-1.5 rounded-ide text-xs font-mono transition-all duration-200',
                selectedTechnology === tech 
                  ? 'bg-accent-500 text-white shadow-glow-accent' 
                  : 'bg-carbon-800/50 text-carbon-300 hover:bg-carbon-700/50 hover:text-carbon-100 border border-carbon-600/50'
              ]"
            >
              {{ tech.toLowerCase().replace(/\s+/g, '_') }}
            </button>
          </div>

          <!-- Featured Toggle -->
          <div class="flex items-center space-x-3">
            <div class="flex items-center space-x-2">
              <span class="text-syntax-comment font-mono text-sm">--featured</span>
              <label class="relative inline-flex items-center cursor-pointer">
                <input
                  v-model="showFeaturedOnly"
                  type="checkbox"
                  class="sr-only peer"
                />
                <div class="w-9 h-5 bg-carbon-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-accent-500"></div>
              </label>
              <span class="text-carbon-300 font-mono text-xs">{{ showFeaturedOnly ? 'true' : 'false' }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Projects Grid -->
    <section class="py-16 lg:py-24 bg-carbon-950">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div v-if="loading && projects.length === 0" class="flex justify-center">
          <Loader size="lg" text="compiling projects..." />
        </div>

        <div v-else-if="error" class="text-center">
          <div class="bg-syntax-error/10 border border-syntax-error/20 rounded-ide p-6 max-w-md mx-auto">
            <div class="text-syntax-error font-mono text-sm">
              <div class="flex items-center space-x-2 mb-2">
                <span class="text-syntax-comment">$</span>
                <span>npm run build</span>
              </div>
              <div>Build failed: {{ error }}</div>
            </div>
            <Button @click="refreshProjects" variant="outline" size="sm" class="mt-4">
              retry.build()
            </Button>
          </div>
        </div>

        <div v-else-if="filteredProjects.length === 0" class="text-center">
          <div class="max-w-md mx-auto">
            <!-- Empty State Icon -->
            <div class="w-16 h-16 mx-auto mb-6 bg-carbon-800/50 rounded-ide flex items-center justify-center">
              <svg class="w-8 h-8 text-carbon-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div class="bg-carbon-900/50 rounded-ide border border-carbon-700/50 p-6">
              <div class="font-mono text-sm text-carbon-300 mb-4">
                <div class="flex items-center justify-center space-x-2 mb-2">
                  <span class="text-syntax-comment">$</span>
                  <span>projects.filter({{ getCurrentFilter() }})</span>
                </div>
                <div class="text-center text-carbon-400">[] // empty result</div>
              </div>
              <Button @click="clearAllFilters" variant="outline" size="sm">
                clear.filters()
              </Button>
            </div>
          </div>
        </div>

        <div v-else>
          <!-- Projects Count Info -->
          <div class="mb-8">
            <div class="flex items-center space-x-2 text-sm font-mono text-carbon-400">
              <span class="text-syntax-comment">//</span>
              <span>Found {{ filteredProjects.length }} project{{ filteredProjects.length !== 1 ? 's' : '' }}</span>
              <span v-if="selectedTechnology || showFeaturedOnly" class="text-accent-400">
                (filtered{{ selectedTechnology ? ` by ${selectedTechnology}` : '' }}{{ showFeaturedOnly ? ', featured only' : '' }})
              </span>
            </div>
          </div>

          <!-- Projects Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ProjectCard
              v-for="(project, index) in displayedProjects"
              :key="project.id"
              :project="project"
              :class="[
                'transform hover:scale-105 transition-all duration-300',
                'opacity-0 animate-fade-in'
              ]"
              :style="{ animationDelay: `${index * 0.1}s` }"
            />
          </div>

          <!-- Load More / Pagination -->
          <div class="mt-12">
            <div v-if="hasMoreProjects && !showFeaturedOnly" class="text-center">
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

            <!-- Pagination for filtered/searched results -->
            <Pagination
              v-if="pagination.totalPages > 1 && !hasMoreProjects"
              :current-page="pagination.currentPage"
              :total-pages="pagination.totalPages"
              :total-items="pagination.totalItems"
              :items-per-page="12"
              :has-next="pagination.hasNext"
              :has-prev="pagination.hasPrev"
              @page-changed="handlePageChange"
              class="mt-8"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Project Stats Section -->
    <section class="py-16 bg-carbon-900 border-t border-carbon-700/30">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-2xl md:text-3xl font-bold text-carbon-100 mb-4 font-mono">
            <span class="text-syntax-comment"># </span>
            <span class="text-syntax-function">Project Statistics</span>
          </h2>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div class="bg-carbon-800/50 rounded-ide border border-carbon-700/50 p-6 text-center">
            <div class="text-2xl font-bold text-accent-400 font-mono mb-2">{{ projects.length }}+</div>
            <div class="text-carbon-300 font-mono text-sm">total_projects</div>
          </div>
          <div class="bg-carbon-800/50 rounded-ide border border-carbon-700/50 p-6 text-center">
            <div class="text-2xl font-bold text-syntax-success font-mono mb-2">{{ availableTechnologies.length }}+</div>
            <div class="text-carbon-300 font-mono text-sm">technologies</div>
          </div>
          <div class="bg-carbon-800/50 rounded-ide border border-carbon-700/50 p-6 text-center">
            <div class="text-2xl font-bold text-syntax-warning font-mono mb-2">{{ projects.filter(p => p.featured).length }}</div>
            <div class="text-carbon-300 font-mono text-sm">featured_work</div>
          </div>
          <div class="bg-carbon-800/50 rounded-ide border border-carbon-700/50 p-6 text-center">
            <div class="text-2xl font-bold text-syntax-variable font-mono mb-2">∞</div>
            <div class="text-carbon-300 font-mono text-sm">lines_of_code</div>
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
              <span class="text-syntax-function"> collaborate</span>
              <span class="text-carbon-300">() {</span>
            </h2>
            <p class="text-xl text-carbon-300 font-mono mb-4">
              <span class="text-syntax-comment">  // Ready to bring your ideas to life</span>
            </p>
            <p class="text-lg text-carbon-400 font-mono">
              <span class="text-syntax-keyword">  return</span>
              <span class="text-syntax-string"> 'Let\'s build something amazing'</span>
            </p>
          </div>
          
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              to="/appointments"
              variant="accent"
              size="lg"
              class="text-base px-8 py-3 font-mono"
            >
              <template #icon-left>
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </template>
              schedule.consultation()
            </Button>
            <Button
              to="/contact"
              variant="outline"
              size="lg"
              class="text-base px-8 py-3 font-mono"
            >
              <template #icon-left>
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </template>
              get.inTouch()
            </Button>
          </div>
          
          <div class="text-carbon-300 font-mono text-xl">
            <span class="text-carbon-300">}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- SEO Head -->
    <SeoHead
      title="Projects - Reynan Tolentino"
      description="Explore my portfolio of web applications and software projects built with modern technologies like Vue.js, Node.js, and more."
      keywords="projects, portfolio, web applications, software development, vue.js, node.js"
    />
  </div>
</template>

<script setup>
import { onMounted, computed, watch, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useProjectsStore } from '@/stores/projects/projects.store'
import Button from '@/components/ui/Button.vue'
import Loader from '@/components/ui/Loader.vue'
import ProjectCard from '@/components/projects/ProjectCard.vue'
import Pagination from '@/components/common/Pagination.vue'
import SeoHead from '@/components/common/SeoHead.vue'

const projectsStore = useProjectsStore()

const { 
  projects, 
  pagination, 
  availableTechnologies, 
  loading, 
  error, 
  hasMoreProjects 
} = storeToRefs(projectsStore)

// Local state
const selectedTechnology = ref(null)
const showFeaturedOnly = ref(false)

// Computed
const filteredProjects = computed(() => {
  let filtered = projects.value

  if (showFeaturedOnly.value) {
    filtered = filtered.filter(project => project.featured)
  }

  if (selectedTechnology.value) {
    filtered = filtered.filter(project =>
      project.technologies && project.technologies.includes(selectedTechnology.value)
    )
  }

  return filtered
})

const displayedProjects = computed(() => {
  // If filtering locally (featured or technology), show all filtered results
  if (showFeaturedOnly.value || selectedTechnology.value) {
    return filteredProjects.value
  }
  
  // Otherwise, show paginated results from store
  return projects.value
})

const getCurrentFilter = () => {
  const filters = []
  if (selectedTechnology.value) filters.push(`tech: '${selectedTechnology.value}'`)
  if (showFeaturedOnly.value) filters.push('featured: true')
  return filters.length > 0 ? filters.join(', ') : 'project => true'
}

// Methods
const selectTechnology = (technology) => {
  selectedTechnology.value = technology
  // Fetch projects filtered by technology
  projectsStore.fetchProjectsByTechnology(technology, 1, 12)
}

const clearTechnologyFilter = () => {
  selectedTechnology.value = null
  showFeaturedOnly.value = false
  projectsStore.clearFilters()
  projectsStore.fetchProjects({ page: 1, limit: 12 })
}

const clearAllFilters = () => {
  selectedTechnology.value = null
  showFeaturedOnly.value = false
  projectsStore.clearFilters()
  projectsStore.fetchProjects({ page: 1, limit: 12 })
}

const loadMore = () => {
  projectsStore.loadMoreProjects()
}

const handlePageChange = (page) => {
  const params = { page, limit: 12 }
  
  if (selectedTechnology.value) {
    params.technology = selectedTechnology.value
  }
  
  if (showFeaturedOnly.value) {
    params.featured = true
  }
  
  projectsStore.fetchProjects(params)
  
  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const refreshProjects = () => {
  projectsStore.refreshProjects()
}

// Watch for featured toggle
watch(showFeaturedOnly, (newValue) => {
  if (newValue) {
    projectsStore.fetchFeaturedProjects(1, 12)
  } else {
    clearAllFilters()
  }
})

// Initialize data
onMounted(() => {
  projectsStore.fetchProjects({ page: 1, limit: 12 })
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

/* Fade in animation for project cards */
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

/* Custom toggle switch styling */
input[type="checkbox"]:checked + div {
  background-color: theme('colors.accent.500');
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .floating-code-element {
    display: none;
  }
}

/* Hover effects for filter buttons */
button:hover {
  transform: translateY(-1px);
}

button:active {
  transform: translateY(0);
}
</style>