<template>
  <div>
    <!-- Hero Section -->
    <section class="hero-section gradient-navy-slate text-white overflow-hidden">
      <!-- Particle Background -->
      <ParticleBackground 
        :particle-count="190"
        particle-color="rgba(96, 165, 250, 0.3)"
        line-color="rgba(96, 165, 250, 0.1)"
        :particle-speed="0.3"
        :connection-distance="120"
      />
      
      <!-- Background overlay -->
      <div class="absolute inset-0 bg-black/20"></div>
      
      <!-- Hero Content -->
      <div class="hero-content mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <div class="space-y-8">
          <!-- Greeting -->
          <div class="animate-hero-fade-in">
            <p class="hero-subtext text-custom-blue-400 mb-4 opacity-90">
              &lt; hello_world /&gt;
            </p>
          </div>
          
          <!-- Main heading -->
          <div class="animation-delay-200 animate-hero-fade-in">
            <h1 class="text-5xl md:text-7xl lg:text-8xl font-bold mb-6">
              Hi, I'm <span class="text-gradient">Reynan</span>
            </h1>
          </div>
          
          <!-- Subheading with mono font -->
          <div class="animation-delay-400 animate-hero-fade-in">
            <p class="hero-subtext text-custom-blue-300 mb-8 opacity-80">
              // Building meaningful digital experiences
            </p>
          </div>
          
          <!-- CTA Buttons -->
          <div class="animation-delay-600 animate-hero-fade-in">
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
              <BaseButton to="/projects" variant="primary" size="lg" class="animate-float">
                View My Work
              </BaseButton>
              <BaseButton to="/contact" variant="secondary" size="lg">
                Get In Touch
              </BaseButton>
            </div>
          </div>
          
          <!-- Tech stack preview -->
          <div class="animation-delay-600 animate-hero-fade-in mt-8">
            <p class="hero-subtext text-gray-400 mb-2 text-xs font-mono">
              Built with
            </p>
            <div class="flex flex-wrap justify-center gap-1">
              <span class="text-xs px-1.5 py-0.5 bg-white/10 rounded-full backdrop-blur-sm text-gray-300 font-mono">
                Nuxt 3
              </span>
              <span class="text-xs px-1.5 py-0.5 bg-white/10 rounded-full backdrop-blur-sm text-gray-300 font-mono">
                TypeScript
              </span>
              <span class="text-xs px-1.5 py-0.5 bg-white/10 rounded-full backdrop-blur-sm text-gray-300 font-mono">
                Tailwind CSS
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Scroll indicator with animated mouse -->
      <div class="absolute bottom-6 left-1/2 transform -translate-x-1/2 scale-75">
        <ScrollIndicator />
      </div>
    </section>

    <!-- About Preview Section -->
    <section class="py-20 bg-white dark:bg-custom-slate-800">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              About Me
            </h2>
            <div v-if="aboutStore.loading" class="space-y-4">
              <div class="h-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
              <div class="h-4 bg-gray-300 dark:bg-gray-600 rounded w-4/5 animate-pulse"></div>
              <div class="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/5 animate-pulse"></div>
            </div>
            <div v-else-if="aboutContent" class="prose dark:prose-invert max-w-none">
              <p class="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                {{ aboutContent.summary || aboutContent.content?.substring(0, 300) + '...' }}
              </p>
            </div>
            <BaseButton to="/about" variant="ghost" class="mt-6">
              Learn More About Me
              <ArrowRightIcon class="ml-2 h-4 w-4" />
            </BaseButton>
          </div>
          
          <!-- Skills Preview -->
          <div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">Top Skills</h3>
            <div v-if="aboutStore.loading" class="grid grid-cols-2 gap-4">
              <div v-for="i in 6" :key="i" class="h-16 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
            </div>
            <div v-else class="grid grid-cols-2 gap-4">
              <div
                v-for="skill in topSkills"
                :key="skill.id"
                class="flex items-center p-4 bg-gray-50 dark:bg-custom-slate-700 rounded-lg border border-gray-200 dark:border-custom-slate-600"
              >
                <div class="flex-shrink-0 mr-3">
                  <img
                    v-if="isImageUrl(skill.icon)"
                    :src="skill.icon"
                    :alt="skill.name"
                    class="w-8 h-8"
                    @error="handleIconError"
                  />
                  <CodeBracketIcon v-else class="w-8 h-8 text-custom-blue-800" />
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-gray-900 dark:text-white truncate">{{ skill.name }}</p>
                  <div class="flex items-center mt-1">
                    <div class="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <div 
                        class="bg-custom-blue-800 h-2 rounded-full" 
                        :style="{ width: `${skill.proficiency * 10}%` }"
                      ></div>
                    </div>
                    <span class="ml-2 text-xs text-gray-500 dark:text-gray-400">{{ skill.proficiency }}/10</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Projects Section -->
    <section class="py-20 bg-gray-50 dark:bg-custom-slate-700">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Featured Projects
          </h2>
          <p class="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            A selection of my recent work, showcasing various technologies and solutions.
          </p>
        </div>

        <div v-if="projectsStore.loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div v-for="i in 6" :key="i" class="card p-6">
            <div class="animate-pulse">
              <div class="h-48 bg-gray-300 dark:bg-gray-600 rounded mb-4"></div>
              <div class="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
              <div class="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
            </div>
          </div>
        </div>

        <div v-else-if="featuredProjects.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <ProjectCard
            v-for="project in featuredProjects.slice(0, 6)"
            :key="project.id"
            :project="project"
          />
        </div>

        <div v-else class="text-center py-12">
          <FolderIcon class="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No projects yet</h3>
          <p class="text-gray-600 dark:text-gray-400">Projects will appear here once they're added.</p>
        </div>

        <div class="text-center mt-12">
          <BaseButton to="/projects" variant="primary" size="lg">
            View All Projects
            <ArrowRightIcon class="ml-2 h-5 w-5" />
          </BaseButton>
        </div>
      </div>
    </section>

    <!-- Recent Blog Posts Section -->
    <section class="py-20 bg-white dark:bg-custom-slate-800">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Latest Blog Posts
          </h2>
          <p class="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Thoughts, tutorials, and insights on software development and technology.
          </p>
        </div>

        <div v-if="blogStore.loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div v-for="i in 3" :key="i" class="card p-6">
            <div class="animate-pulse">
              <div class="h-48 bg-gray-300 dark:bg-gray-600 rounded mb-4"></div>
              <div class="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
              <div class="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
            </div>
          </div>
        </div>

        <div v-else-if="recentPosts.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <BlogCard
            v-for="post in recentPosts.slice(0, 3)"
            :key="post.id"
            :post="post"
          />
        </div>

        <div v-else class="text-center py-12">
          <DocumentTextIcon class="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No blog posts yet</h3>
          <p class="text-gray-600 dark:text-gray-400">Blog posts will appear here once they're published.</p>
        </div>

        <div class="text-center mt-12">
          <BaseButton to="/blog" variant="primary" size="lg">
            Read More Posts
            <ArrowRightIcon class="ml-2 h-5 w-5" />
          </BaseButton>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 gradient-cobalt text-white">
      <div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl md:text-4xl font-bold mb-6">
          Ready to Work Together?
        </h2>
        <p class="text-xl mb-8 text-gray-300">
          Let's discuss your project and see how I can help bring your ideas to life.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <BaseButton to="/contact" variant="secondary" size="lg">
            Start a Conversation
          </BaseButton>
          <BaseButton to="/appointments" variant="ghost" size="lg" class="text-white hover:text-gray-900">
            Schedule a Meeting
          </BaseButton>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import {
  ArrowRightIcon,
  CodeBracketIcon,
  FolderIcon,
  DocumentTextIcon
} from '@heroicons/vue/24/outline'
import { useAboutStore } from '~/stores/about.store'
import { useProjectsStore } from '~/stores/projects.store'
import { useBlogStore } from '~/stores/blog.store'

// SEO
useHead({
  title: 'Reynan Tolentino - Software Developer Portfolio',
  meta: [
    {
      name: 'description',
      content: 'Full-stack software developer specializing in web applications, API development, and database design. View my portfolio, blog, and get in touch for your next project.'
    },
    { property: 'og:title', content: 'Reynan Tolentino - Software Developer Portfolio' },
    { property: 'og:description', content: 'Full-stack software developer specializing in web applications, API development, and database design.' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' }
  ]
})

// Stores
const aboutStore = useAboutStore()
const projectsStore = useProjectsStore()
const blogStore = useBlogStore()

// Computed
const aboutContent = computed(() => aboutStore.aboutContent)
const topSkills = computed(() => aboutStore.topSkills.slice(0, 6))
const featuredProjects = computed(() => projectsStore.featuredProjects)
const recentPosts = computed(() => blogStore.recentPosts)

// Methods
const isImageUrl = (icon) => {
  return icon && (icon.startsWith('http') || icon.startsWith('/') || icon.includes('.'))
}

const handleIconError = (event) => {
  event.target.style.display = 'none'
}

// Lifecycle
onMounted(async () => {
  // Load initial data
  await Promise.all([
    aboutStore.fetchAll(),
    projectsStore.fetchProjects({ featured: true, limit: 6 }),
    blogStore.fetchPosts({ limit: 3, sortBy: 'published_at', sortOrder: 'desc' })
  ])
})
</script>