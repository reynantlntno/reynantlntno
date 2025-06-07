<template>
  <div class="min-h-screen">
    <!-- Hero Section - Full Viewport -->
    <section class="relative h-screen overflow-hidden bg-carbon-950">
      <!-- Animated Background -->
      <div class="absolute inset-0">
        <!-- Grid Pattern -->
        <div class="absolute inset-0 opacity-20">
          <div class="grid-background"></div>
        </div>
        
        <!-- Floating Code Blocks -->
        <div class="floating-elements">
          <div 
            v-for="(block, index) in codeBlocks" 
            :key="index"
            class="absolute code-float"
            :style="{ 
              left: `${block.x}%`, 
              top: `${block.y}%`,
              animationDelay: `${block.delay}s`,
              animationDuration: `${block.duration}s`
            }"
          >
            <div class="code-snippet opacity-80 transform rotate-3 hover:rotate-0 transition-transform duration-500">
              <div class="text-xs font-mono">
                <div v-for="(line, i) in block.code" :key="i" class="code-line">
                  <span class="code-line-number">{{ i + 1 }}</span>
                  <span v-html="line"></span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Particle System -->
        <div class="particles">
          <div 
            v-for="i in 50" 
            :key="i"
            class="particle"
            :style="{ 
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 20}s`,
              animationDuration: `${20 + Math.random() * 10}s`
            }"
          ></div>
        </div>
      </div>

      <!-- Hero Content -->
      <div class="relative z-10 flex items-center justify-center h-full">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <!-- Main Hero Terminal - Only one! -->
          <div class="terminal-window max-w-4xl mx-auto transform scale-105 hero-terminal">
            <div class="terminal-header">
              <div class="terminal-controls">
                <div class="terminal-control close"></div>
                <div class="terminal-control minimize"></div>
                <div class="terminal-control maximize"></div>
              </div>
              <span class="text-xs font-mono text-carbon-300 ml-2">~/reynantlntno.dev/developer.js</span>
              <div class="flex-1"></div>
              <div class="flex items-center space-x-2 text-xs font-mono text-carbon-500">
                <div class="w-2 h-2 bg-syntax-success rounded-full animate-pulse"></div>
                <span>online</span>
              </div>
            </div>
            <div class="terminal-content p-8 text-left">
              <!-- Code-style Introduction -->
              <div class="space-y-4 font-mono text-sm">
                <div class="flex items-center space-x-2 typing-animation">
                  <span class="text-syntax-comment">1</span>
                  <span class="text-syntax-comment">// Welcome to my digital workspace</span>
                </div>
                <div class="flex items-center space-x-2 typing-animation" style="animation-delay: 0.5s">
                  <span class="text-syntax-comment">2</span>
                  <span class="text-syntax-keyword">const</span>
                  <span class="text-syntax-variable"> developer</span>
                  <span class="text-carbon-300"> = {</span>
                </div>
                <div class="flex items-center space-x-2 typing-animation" style="animation-delay: 1s">
                  <span class="text-syntax-comment">3</span>
                  <span class="text-syntax-string ml-4">  name:</span>
                  <span class="text-syntax-string">'Reynan Tolentino'</span><span class="text-carbon-300">,</span>
                </div>
                <div class="flex items-center space-x-2 typing-animation" style="animation-delay: 1.5s">
                  <span class="text-syntax-comment">4</span>
                  <span class="text-syntax-string ml-4">  role:</span>
                  <span class="text-syntax-string">'Full-Stack Developer'</span><span class="text-carbon-300">,</span>
                </div>
                <div class="flex items-center space-x-2 typing-animation" style="animation-delay: 2s">
                  <span class="text-syntax-comment">5</span>
                  <span class="text-syntax-string ml-4">  specialties:</span>
                  <span class="text-carbon-300">[</span><span class="text-syntax-string">'Vue.js'</span><span class="text-carbon-300">,</span>
                  <span class="text-syntax-string">'Node.js'</span><span class="text-carbon-300">,</span>
                  <span class="text-syntax-string">'Modern Web'</span><span class="text-carbon-300">],</span>
                </div>
                <div class="flex items-center space-x-2 typing-animation" style="animation-delay: 2.5s">
                  <span class="text-syntax-comment">6</span>
                  <span class="text-syntax-string ml-4">  status:</span>
                  <span class="text-syntax-string">'available_for_work'</span>
                </div>
                <div class="flex items-center space-x-2 typing-animation" style="animation-delay: 3s">
                  <span class="text-syntax-comment">7</span>
                  <span class="text-carbon-300">}</span>
                </div>
              </div>

              <!-- CTA Buttons -->
              <div class="flex flex-col sm:flex-row gap-4 justify-center mt-8 opacity-0 slide-up-animation" style="animation-delay: 3.5s">
                <Button
                  to="/projects"
                  variant="accent"
                  size="lg"
                  class="text-base px-8 py-3"
                >
                  <template #icon-left>
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0l-4 4m4-4l-4-4" />
                    </svg>
                  </template>
                  explore.projects()
                </Button>
                <Button
                  to="/contact"
                  variant="outline"
                  size="lg"
                  class="text-base px-8 py-3"
                >
                  <template #icon-left>
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </template>
                  get.inTouch()
                </Button>
              </div>

              <!-- Terminal Command Prompt -->
              <div class="mt-8 opacity-0 slide-up-animation" style="animation-delay: 4s">
                <div class="flex items-center space-x-2 text-sm font-mono text-carbon-400">
                  <span class="text-syntax-comment">$</span>
                  <span class="typing-text">explore --portfolio --skills --experience</span>
                  <span class="animate-pulse text-accent-400">▊</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Scroll Indicator -->
      <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 bounce-animation" style="animation-delay: 5s">
        <div class="flex flex-col items-center space-y-2">
          <div class="text-xs font-mono text-carbon-400">scroll to explore</div>
          <div class="w-6 h-10 border-2 border-carbon-600 rounded-full flex justify-center">
            <div class="w-1 h-3 bg-accent-500 rounded-full mt-2 animate-bounce"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- Skills Section - Clean Card Layout -->
    <section class="py-24 bg-carbon-900 relative overflow-hidden">
      <!-- Background Pattern -->
      <div class="absolute inset-0 opacity-5">
        <div class="grid-background"></div>
      </div>
      
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <!-- Simple Header -->
        <div class="text-center mb-16">
          <h2 class="text-4xl md:text-5xl font-bold text-carbon-100 mb-4 font-mono">
            <span class="text-syntax-keyword">export</span> 
            <span class="text-syntax-function">skills</span>
          </h2>
          <p class="text-xl text-carbon-300 font-mono">
            <span class="text-syntax-comment">// Modern technologies for scalable solutions</span>
          </p>
        </div>

        <!-- Skills Grid - No Windows! -->
        <div v-if="aboutLoading" class="flex justify-center">
          <Loader variant="terminal" size="lg" text="loading skills..." />
        </div>

        <div v-else-if="aboutError" class="text-center">
          <div class="bg-syntax-error/10 border border-syntax-error/20 rounded-ide p-6 max-w-md mx-auto">
            <div class="text-syntax-error font-mono text-sm">
              <div class="flex items-center space-x-2 mb-2">
                <span class="text-syntax-comment">$</span>
                <span>npm run load-skills</span>
              </div>
              <div>Error: {{ aboutError }}</div>
            </div>
            <Button @click="refreshSkills" variant="outline" size="sm" class="mt-4">
              retry.command()
            </Button>
          </div>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <SkillsCard
            v-for="(skillList, category) in skills"
            :key="category"
            :category="category"
            :skills="skillList"
            class="skill-category"
          />
        </div>
      </div>
    </section>

    <!-- Featured Projects - Modern Card Layout -->
    <section class="py-24 bg-carbon-950 relative overflow-hidden">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <!-- Section Header -->
        <div class="text-center mb-16">
          <h2 class="text-4xl md:text-5xl font-bold text-carbon-100 mb-4 font-mono">
            <span class="text-syntax-keyword">const</span>
            <span class="text-syntax-variable"> projects</span>
            <span class="text-carbon-300"> = []</span>
          </h2>
          <p class="text-xl text-carbon-300 font-mono">
            <span class="text-syntax-comment">// Recent work and achievements</span>
          </p>
        </div>

        <div v-if="projectsLoading" class="flex justify-center">
          <Loader variant="code" size="lg" text="compiling projects..." />
        </div>

        <div v-else-if="projectsError" class="text-center">
          <div class="bg-syntax-error/10 border border-syntax-error/20 rounded-ide p-6 max-w-md mx-auto">
            <div class="text-syntax-error font-mono text-sm">Build failed: {{ projectsError }}</div>
            <Button @click="refreshProjects" variant="outline" size="sm" class="mt-4">
              rebuild.projects()
            </Button>
          </div>
        </div>

        <div v-else>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ProjectCard
              v-for="project in featuredProjects"
              :key="project.id"
              :project="project"
              class="transform hover:scale-105 transition-transform duration-300"
            />
          </div>

          <div class="text-center mt-12">
            <Button
              to="/projects"
              variant="accent"
              size="lg"
            >
              <template #icon-left>
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </template>
              view.allProjects()
            </Button>
          </div>
        </div>
      </div>
    </section>

    <!-- Recent Blog Posts - Simple Layout -->
    <section class="py-24 bg-carbon-900 relative overflow-hidden">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <!-- Section Header -->
        <div class="text-center mb-16">
          <h2 class="text-4xl md:text-5xl font-bold text-carbon-100 mb-4 font-mono">
            <span class="text-syntax-comment"># </span>
            <span class="text-syntax-function">Latest Articles</span>
          </h2>
          <p class="text-xl text-carbon-300 font-mono">
            <span class="text-syntax-comment">// Insights on web development and tech</span>
          </p>
        </div>

        <div v-if="blogLoading" class="flex justify-center">
          <Loader variant="spinner" size="lg" text="fetching articles..." />
        </div>

        <div v-else-if="blogError" class="text-center">
          <div class="bg-syntax-error/10 border border-syntax-error/20 rounded-ide p-6 max-w-md mx-auto">
            <div class="text-syntax-error font-mono text-sm">Failed to load blog posts: {{ blogError }}</div>
            <Button @click="refreshBlog" variant="outline" size="sm" class="mt-4">
              retry.fetch()
            </Button>
          </div>
        </div>

        <div v-else>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <BlogCard
              v-for="post in recentPosts"
              :key="post.id"
              :post="post"
              class="transform hover:scale-105 transition-transform duration-300"
            />
          </div>

          <div class="text-center mt-12">
            <Button
              to="/blog"
              variant="outline"
              size="lg"
            >
              <template #icon-left>
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </template>
              read.allPosts()
            </Button>
          </div>
        </div>
      </div>
    </section>

    <!-- Call to Action - Gradient Section -->
    <section class="py-24 bg-gradient-to-br from-carbon-950 via-carbon-900 to-accent-950/20 relative overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-r from-accent-900/10 to-accent-800/10"></div>
      <div class="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="space-y-8">
          <div>
            <h2 class="text-4xl md:text-5xl font-bold text-carbon-100 mb-6 font-mono">
              <span class="text-syntax-keyword">function</span>
              <span class="text-syntax-function"> startProject</span>
              <span class="text-carbon-300">() {</span>
            </h2>
            <p class="text-xl text-carbon-300 font-mono">
              <span class="text-syntax-comment">  // Let's build something amazing together</span>
            </p>
          </div>
          
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              to="/appointments"
              variant="accent"
              size="lg"
              class="text-base px-8 py-3"
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
              class="text-base px-8 py-3"
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
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useAboutStore } from '@/stores/about/about.store'
import { useProjectsStore } from '@/stores/projects/projects.store'
import { useBlogStore } from '@/stores/blog/blog.store'
import Button from '@/components/ui/Button.vue'
import Loader from '@/components/ui/Loader.vue'
import ProjectCard from '@/components/projects/ProjectCard.vue'
import BlogCard from '@/components/blog/BlogCard.vue'
import SkillsCard from '@/components/about/SkillsCard.vue'

// Stores
const aboutStore = useAboutStore()
const projectsStore = useProjectsStore()
const blogStore = useBlogStore()

// Store data - Get skills from about store instead of hardcoded
const { skills, loading: aboutLoading, error: aboutError } = storeToRefs(aboutStore)
const { featuredProjects, loading: projectsLoading, error: projectsError } = storeToRefs(projectsStore)
const { recentPosts, loading: blogLoading, error: blogError } = storeToRefs(blogStore)

// Simplified floating code blocks data
const codeBlocks = ref([
  {
    x: 10, y: 20, delay: 0, duration: 20,
    filename: 'app.vue',
    code: [
      '<span class="text-syntax-keyword">const</span> <span class="text-syntax-variable">app</span> = <span class="text-syntax-function">createApp</span>()'
    ]
  },
  {
    x: 75, y: 15, delay: 5, duration: 25,
    filename: 'server.js',
    code: [
      '<span class="text-syntax-keyword">const</span> <span class="text-syntax-variable">express</span> = <span class="text-syntax-function">require</span>(<span class="text-syntax-string">\'express\'</span>)'
    ]
  },
  {
    x: 15, y: 70, delay: 10, duration: 30,
    filename: 'utils.ts',
    code: [
      '<span class="text-syntax-keyword">interface</span> <span class="text-syntax-variable">User</span> {'
    ]
  }
])

// Methods
const refreshSkills = () => {
  aboutStore.refreshData()
}

const refreshProjects = () => {
  projectsStore.refreshProjects()
}

const refreshBlog = () => {
  blogStore.refreshPosts()
}

// Initialize data on mount
onMounted(async () => {
  await Promise.all([
    aboutStore.fetchAboutData(),
    projectsStore.fetchFeaturedProjects(1, 6),
    blogStore.fetchPosts({ limit: 6 })
  ])
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

/* Code Snippets - Simplified */
.code-snippet {
  background: rgba(30, 30, 30, 0.9);
  border: 1px solid rgba(0, 122, 204, 0.3);
  border-radius: 8px;
  padding: 8px 12px;
  backdrop-filter: blur(10px);
  max-width: 200px;
}

/* Floating Code Blocks */
.code-float {
  animation: float infinite ease-in-out;
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(3deg); }
  50% { transform: translateY(-20px) rotate(-2deg); }
}

/* Particle System */
.particles {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.particle {
  position: absolute;
  width: 2px;
  height: 2px;
  background: linear-gradient(45deg, #007acc, #569cd6);
  border-radius: 50%;
  animation: particle-float infinite linear;
}

@keyframes particle-float {
  0% {
    transform: translateY(100vh) scale(0);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(-100px) scale(1);
    opacity: 0;
  }
}

/* Hero Terminal */
.hero-terminal {
  animation: scale-in 1s ease-out;
}

@keyframes scale-in {
  0% {
    opacity: 0;
    transform: scale(0.9);
  }
  100% {
    opacity: 1;
    transform: scale(1.05);
  }
}

/* Typing Animation */
.typing-animation {
  opacity: 0;
  animation: typing-appear 0.5s ease-out forwards;
}

@keyframes typing-appear {
  0% {
    opacity: 0;
    transform: translateX(-20px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Slide Up Animation */
.slide-up-animation {
  opacity: 0;
  animation: slide-up 0.8s ease-out forwards;
}

@keyframes slide-up {
  0% {
    opacity: 0;
    transform: translateY(30px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Bounce Animation */
.bounce-animation {
  opacity: 0;
  animation: bounce-in 1s ease-out forwards;
}

@keyframes bounce-in {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  60% {
    opacity: 1;
    transform: translateY(-5px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Typing Text Effect */
.typing-text {
  border-right: 2px solid #007acc;
  animation: typing 3s steps(40, end), blink-caret 0.75s step-end infinite;
  white-space: nowrap;
  overflow: hidden;
}

@keyframes typing {
  from { width: 0; }
  to { width: 100%; }
}

@keyframes blink-caret {
  from, to { border-color: transparent; }
  50% { border-color: #007acc; }
}

/* Skill Categories */
.skill-category {
  backdrop-filter: blur(10px);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .floating-elements {
    display: none;
  }
  
  .hero-terminal {
    transform: scale(1);
  }
  
  .code-float {
    display: none;
  }
}
</style>