<template>
  <div class="min-h-screen bg-carbon-950">
    <div v-if="loading" class="flex justify-center items-center min-h-screen">
      <Loader size="lg" text="Loading project..." />
    </div>

    <div v-else-if="error" class="min-h-screen flex items-center justify-center">
      <div class="text-center max-w-md mx-auto px-4">
        <div class="bg-syntax-error/10 border border-syntax-error/20 rounded-ide p-8">
          <div class="w-16 h-16 mx-auto mb-6 bg-syntax-error/20 rounded-ide flex items-center justify-center">
            <svg class="w-8 h-8 text-syntax-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 class="text-2xl font-bold text-carbon-100 mb-4 font-mono">
            <span class="text-syntax-error">Error:</span>
            <span class="text-carbon-300"> Project Not Found</span>
          </h1>
          <p class="text-carbon-300 mb-6 font-mono text-sm">{{ error }}</p>
          <Button to="/projects" variant="outline">
            <template #icon-left>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </template>
            back.to.projects()
          </Button>
        </div>
      </div>
    </div>

    <div v-else-if="currentProject">
      <!-- Hero Section -->
      <section class="relative py-24 lg:py-32 overflow-hidden">
        <!-- Background Pattern -->
        <div class="absolute inset-0 opacity-5">
          <div class="grid-background"></div>
        </div>
        
        <!-- Project Background Image (if available) -->
        <div 
          v-if="currentProject.thumbnail_url" 
          class="absolute inset-0 opacity-10"
        >
          <img 
            :src="currentProject.thumbnail_url" 
            :alt="currentProject.title"
            class="w-full h-full object-cover"
          />
          <div class="absolute inset-0 bg-carbon-950/80"></div>
        </div>
        
        <div class="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <!-- Breadcrumb -->
          <nav class="mb-8">
            <div class="flex items-center space-x-2 text-sm font-mono">
              <router-link 
                to="/projects" 
                class="text-accent-400 hover:text-accent-300 transition-colors flex items-center space-x-1"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>projects</span>
              </router-link>
              <span class="text-carbon-500">/</span>
              <span class="text-carbon-300">{{ currentProject.slug || 'loading' }}</span>
            </div>
          </nav>

          <div class="text-center">
            <!-- File Header -->
            <div class="inline-flex items-center space-x-2 mb-6">
              <div class="w-3 h-3 rounded-full bg-syntax-error"></div>
              <div class="w-3 h-3 rounded-full bg-syntax-warning"></div>
              <div class="w-3 h-3 rounded-full bg-syntax-success"></div>
              <span class="font-mono text-sm text-carbon-400 ml-3">~/projects/{{ currentProject.slug || 'project' }}.md</span>
            </div>
            
            <h1 class="text-4xl md:text-6xl font-bold text-carbon-100 mb-6 leading-tight font-mono">
              <span class="text-syntax-variable"> {{ formatTitleForCode(currentProject.title) }}</span>
            </h1>
            
            <div v-if="currentProject.description" class="text-xl text-carbon-300 mb-8 max-w-4xl mx-auto font-mono">
              <span class="text-syntax-comment">// {{ currentProject.description }}</span>
            </div>

            <!-- Technologies -->
            <div v-if="currentProject.technologies && currentProject.technologies.length > 0" class="flex flex-wrap justify-center gap-2 mb-8">
              <span
                v-for="tech in currentProject.technologies"
                :key="tech"
                class="bg-carbon-800/50 text-accent-400 px-3 py-1.5 rounded-ide text-sm font-mono border border-carbon-700/50 hover:border-accent-500/50 transition-colors"
              >
                {{ tech.toLowerCase().replace(/\s+/g, '_') }}
              </span>
            </div>

            <!-- Action Buttons -->
            <div class="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <a
                v-if="currentProject.demo_url"
                :href="currentProject.demo_url"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center px-6 py-3 bg-accent-500 hover:bg-accent-600 text-white font-mono rounded-ide transition-all duration-200 hover:shadow-glow-accent"
              >
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                view.demo()
              </a>
              
              <a
                v-if="currentProject.github_url"
                :href="currentProject.github_url"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center px-6 py-3 bg-carbon-800/50 hover:bg-carbon-700/50 text-carbon-100 font-mono rounded-ide border border-carbon-700/50 hover:border-carbon-600/50 transition-all duration-200"
              >
                <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                view.source()
              </a>
            </div>

          </div>
        </div>
      </section>

      <!-- Project Images Gallery -->
      <ProjectGallery 
        v-if="currentProject.images && currentProject.images.length > 0"
        :images="currentProject.images"
        :project-title="currentProject.title"
      />

      <!-- Project Details -->
      <section class="py-16 lg:py-24 bg-carbon-900">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div v-if="currentProject.content" class="bg-carbon-800/50 rounded-ide border border-carbon-700/50 p-8">
            <!-- Content Header -->
            <div class="flex items-center justify-between mb-6 pb-4 border-b border-carbon-700/50">
              <div class="flex items-center space-x-2">
                <span class="text-syntax-comment font-mono text-sm">1</span>
                <span class="text-syntax-comment font-mono text-sm">/* Project Details */</span>
              </div>
              <div class="flex items-center space-x-2">
                <div class="w-2 h-2 bg-syntax-success rounded-full"></div>
                <span class="text-xs font-mono text-carbon-400">markdown</span>
              </div>
            </div>
            
            <div class="prose prose-lg prose-invert max-w-none">
              <div 
                v-html="formattedContent" 
                class="text-carbon-300 leading-relaxed"
              ></div>
            </div>
          </div>
          
          <div v-else class="text-center bg-carbon-800/30 rounded-ide border border-carbon-700/30 p-12">
            <div class="w-16 h-16 mx-auto mb-6 bg-carbon-700/50 rounded-ide flex items-center justify-center">
              <svg class="w-8 h-8 text-carbon-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p class="text-carbon-400 font-mono text-sm">// Detailed documentation coming soon...</p>
          </div>
        </div>
      </section>

      <!-- Related Projects -->
      <section v-if="relatedProjects.length > 0" class="py-16 lg:py-24 bg-carbon-950">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-12">
            <h2 class="text-3xl md:text-4xl font-bold text-carbon-100 mb-4 font-mono">
              <span class="text-syntax-comment"># </span>
              <span class="text-syntax-function">Related Projects</span>
            </h2>
            <p class="text-lg text-carbon-300 font-mono">
              <span class="text-syntax-comment">// More projects you might find interesting</span>
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ProjectCard
              v-for="(project, index) in relatedProjects"
              :key="project.id"
              :project="project"
              :class="[
                'transform hover:scale-105 transition-all duration-300',
                'opacity-0 animate-fade-in'
              ]"
              :style="{ animationDelay: `${index * 0.1}s` }"
            />
          </div>

          <div class="text-center mt-12">
            <Button to="/projects" variant="outline" size="lg" class="font-mono">
              <template #icon-left>
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </template>
              view.all.projects()
            </Button>
          </div>
        </div>
      </section>

      <!-- Contact CTA -->
      <section class="py-16 lg:py-24 bg-gradient-to-br from-carbon-950 via-carbon-900 to-accent-950/20 relative overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-r from-accent-900/10 to-accent-800/10"></div>
        <div class="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10">
          <div class="space-y-8">
            <div>
              <h2 class="text-3xl md:text-4xl font-bold text-carbon-100 mb-6 font-mono">
                <span class="text-syntax-keyword">function</span>
                <span class="text-syntax-function"> buildSimilar</span>
                <span class="text-carbon-300">() {</span>
              </h2>
              <p class="text-xl text-carbon-300 font-mono mb-4">
                <span class="text-syntax-comment">  // Interested in similar work?</span>
              </p>
              <p class="text-lg text-carbon-400 font-mono">
                <span class="text-syntax-keyword">  return</span>
                <span class="text-syntax-string"> 'Let\'s discuss your project ideas'</span>
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
                send.message()
              </Button>
            </div>
            
            <div class="text-carbon-300 font-mono text-xl">
              <span class="text-carbon-300">}</span>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- Fallback for when no project is found -->
    <div v-else class="min-h-screen flex items-center justify-center">
      <div class="text-center max-w-md mx-auto px-4">
        <div class="bg-carbon-800/30 rounded-ide border border-carbon-700/30 p-8">
          <div class="w-16 h-16 mx-auto mb-6 bg-carbon-700/50 rounded-ide flex items-center justify-center">
            <svg class="w-8 h-8 text-carbon-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 class="text-2xl font-bold text-carbon-100 mb-4 font-mono">
            <span class="text-carbon-300">Project Not Found</span>
          </h1>
          <p class="text-carbon-400 mb-6 font-mono text-sm">// The requested project could not be loaded</p>
          <Button to="/projects" variant="outline">
            <template #icon-left>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </template>
            back.to.projects()
          </Button>
        </div>
      </div>
    </div>

    <!-- SEO Head -->
    <SeoHead
      v-if="currentProject"
      :title="`${currentProject.title} - Reynan Tolentino`"
      :description="currentProject.description || `${currentProject.title} - A software project by Reynan Tolentino`"
      :keywords="currentProject.technologies ? currentProject.technologies.join(', ') : undefined"
      :image="currentProject.thumbnail_url"
    />
  </div>
</template>

<script setup>
import { onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useProjectsStore } from '@/stores/projects/projects.store'
import { formatMarkdown } from '@/utils/format.util'
import Button from '@/components/ui/Button.vue'
import Loader from '@/components/ui/Loader.vue'
import ProjectCard from '@/components/projects/ProjectCard.vue'
import ProjectGallery from '@/components/projects/ProjectGallery.vue'
import SeoHead from '@/components/common/SeoHead.vue'

const route = useRoute()
const router = useRouter()
const projectsStore = useProjectsStore()

const { currentProject, projects, loading, error } = storeToRefs(projectsStore)

// Computed
const formattedContent = computed(() => {
  if (!currentProject.value?.content) return ''
  return formatMarkdown(currentProject.value.content)
})

const formatTitleForCode = (title) => {
  if (!title) return 'project'
  return title.replace(/\s+/g, '')
}

const relatedProjects = computed(() => {
  if (!currentProject.value || !projects.value.length) return []
  
  // Find projects with similar technologies
  const currentTechnologies = currentProject.value.technologies || []
  const related = projects.value
    .filter(project => 
      project.id !== currentProject.value.id &&
      project.technologies && 
      project.technologies.some(tech => currentTechnologies.includes(tech))
    )
    .slice(0, 3)
  
  // If no related projects found, return random featured projects
  if (related.length === 0) {
    return projects.value
      .filter(project => 
        project.id !== currentProject.value.id && 
        project.featured
      )
      .slice(0, 3)
  }
  
  return related
})

// Lifecycle
onMounted(async () => {
  const slug = route.params.slug
  if (slug) {
    try {
      const result = await projectsStore.fetchProjectBySlug(slug)
      if (!result.success) {
        console.error('Failed to fetch project:', result.error)
        // Don't redirect immediately, let error state show
      }
    } catch (err) {
      console.error('Error fetching project:', err)
    }
  }
  
  // Also fetch projects list for related projects
  if (projects.value.length === 0) {
    projectsStore.fetchProjects({ limit: 50 })
  }
})

// Watch for route changes
watch(() => route.params.slug, async (newSlug) => {
  if (newSlug) {
    try {
      await projectsStore.fetchProjectBySlug(newSlug)
    } catch (err) {
      console.error('Error fetching project on route change:', err)
    }
  }
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

/* Fade in animation for related projects */
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

/* Prose styling for content */
.prose h1 { @apply text-carbon-100 font-mono; }
.prose h2 { @apply text-carbon-200 font-mono; }
.prose h3 { @apply text-carbon-200 font-mono; }
.prose p { @apply text-carbon-300; }
.prose a { @apply text-accent-400 hover:text-accent-300; }
.prose strong { @apply text-carbon-100; }
.prose code { @apply text-accent-400 bg-carbon-800 px-1 py-0.5 rounded font-mono; }
.prose blockquote { @apply border-l-accent-500 bg-carbon-800/30 text-carbon-300; }
.prose pre { @apply bg-carbon-800 border border-carbon-700/50 rounded-ide; }
.prose ul { @apply text-carbon-300; }
.prose ol { @apply text-carbon-300; }
.prose li { @apply text-carbon-300; }

/* Technology tags hover effect */
.technology-tag:hover {
  transform: translateY(-1px);
}

/* Action buttons hover effects */
a:hover {
  transform: translateY(-1px);
}

a:active {
  transform: translateY(0);
}
</style>