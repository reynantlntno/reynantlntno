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
          <span class="font-mono text-xs text-accent-400">const about = {</span>
        </div>
        <div class="floating-code-element absolute top-40 right-20 opacity-30 animate-float" style="animation-delay: 2s">
          <span class="font-mono text-xs text-syntax-variable">developer: true</span>
        </div>
        <div class="floating-code-element absolute bottom-32 left-1/4 opacity-30 animate-float" style="animation-delay: 4s">
          <span class="font-mono text-xs text-syntax-comment">// passionate coder</span>
        </div>
      </div>

      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <!-- Terminal-style Header -->
          <div class="inline-flex items-center space-x-2 mb-6">
            <div class="w-3 h-3 rounded-full bg-syntax-error"></div>
            <div class="w-3 h-3 rounded-full bg-syntax-warning"></div>
            <div class="w-3 h-3 rounded-full bg-syntax-success"></div>
            <span class="font-mono text-sm text-carbon-400 ml-3">~/about/developer.md</span>
          </div>
          
          <h1 class="text-4xl md:text-6xl font-bold text-carbon-100 mb-6 leading-tight font-mono">
            <span class="text-syntax-keyword">about</span>
            <span class="text-syntax-function">.me</span>
            <span class="text-carbon-300">()</span>
          </h1>
          <p class="text-xl md:text-2xl text-carbon-300 mb-8 max-w-3xl mx-auto font-mono">
            <span class="text-syntax-comment">// Passionate developer crafting innovative solutions</span>
          </p>
        </div>
      </div>
    </section>

    <!-- About Content Section -->
    <section class="py-16 lg:py-24 bg-carbon-900">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div v-if="loading" class="flex justify-center">
          <Loader size="lg" text="Loading about content..." />
        </div>

        <div v-else-if="error" class="text-center">
          <div class="bg-syntax-error/10 border border-syntax-error/20 rounded-ide p-6 max-w-md mx-auto">
            <div class="text-syntax-error font-mono text-sm">
              <div class="flex items-center space-x-2 mb-2">
                <span class="text-syntax-comment">$</span>
                <span>cat about.md</span>
              </div>
              <div>Error: {{ error }}</div>
            </div>
            <Button @click="refreshData" variant="outline" size="sm" class="mt-4">
              retry.command()
            </Button>
          </div>
        </div>

        <div v-else-if="content" class="bg-carbon-800/50 rounded-ide border border-carbon-700/50 p-8">
          <!-- Code-style Content Header -->
          <div class="flex items-center justify-between mb-6 pb-4 border-b border-carbon-700/50">
            <div class="flex items-center space-x-2">
              <span class="text-syntax-comment font-mono text-sm">1</span>
              <span class="text-syntax-comment font-mono text-sm">/* About Me */</span>
            </div>
            <div class="flex items-center space-x-2">
              <div class="w-2 h-2 bg-syntax-success rounded-full"></div>
              <span class="text-xs font-mono text-carbon-400">markdown</span>
            </div>
          </div>
          
          <div class="prose prose-lg prose-invert max-w-none">
            <div v-html="formattedContent" class="text-carbon-300 leading-relaxed"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- Skills Section -->
    <section class="py-16 lg:py-24 bg-carbon-950">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Section Header -->
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-carbon-100 mb-4 font-mono">
            <span class="text-syntax-keyword">const</span>
            <span class="text-syntax-variable"> skills</span>
            <span class="text-carbon-300"> = [</span>
          </h2>
          <p class="text-lg text-carbon-300 max-w-2xl mx-auto font-mono">
            <span class="text-syntax-comment">// Technologies and tools for exceptional solutions</span>
          </p>
        </div>

        <div v-if="loading" class="flex justify-center">
          <Loader size="lg" text="Loading skills..." />
        </div>

        <div v-else-if="error" class="text-center">
          <div class="bg-syntax-error/10 border border-syntax-error/20 rounded-ide p-6 max-w-md mx-auto">
            <div class="text-syntax-error font-mono text-sm">Failed to load skills: {{ error }}</div>
            <Button @click="refreshData" variant="outline" size="sm" class="mt-4">
              retry.fetch()
            </Button>
          </div>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <SkillsCard
            v-for="(skillList, category) in skills"
            :key="category"
            :category="category"
            :skills="skillList"
          />
        </div>
        
        <!-- Closing Bracket -->
        <div class="text-center mt-12">
          <span class="text-carbon-300 font-mono text-2xl">]</span>
        </div>
      </div>
    </section>

    <!-- Experience Timeline -->
    <section v-if="hasEducationContent" class="py-16 lg:py-24 bg-carbon-900">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Section Header -->
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-carbon-100 mb-4 font-mono">
            <span class="text-syntax-comment"># </span>
            <span class="text-syntax-function">Education</span>
          </h2>
          <p class="text-lg text-carbon-300 max-w-2xl mx-auto font-mono">
            <span class="text-syntax-comment">// My academic background</span>
          </p>
        </div>

        <div v-if="loading" class="flex justify-center">
          <Loader size="lg" text="Loading education data..." />
        </div>

        <div v-else-if="error" class="text-center">
          <div class="bg-syntax-error/10 border border-syntax-error/20 rounded-ide p-6 max-w-md mx-auto">
            <div class="text-syntax-error font-mono text-sm">Failed to load education data: {{ error }}</div>
            <Button @click="refreshData" variant="outline" size="sm" class="mt-4">
              retry.fetch()
            </Button>
          </div>
        </div>

        <!-- Timeline -->
        <div v-else-if="education.length" class="relative">
          <div class="absolute left-4 top-0 bottom-0 w-0.5 bg-accent-500"></div>
          <div class="space-y-8">
            <!-- Education Items (from JSON) -->
            <div 
              v-for="(item, index) in education" 
              :key="index" 
              class="relative flex items-start space-x-6"
            >
              <div class="flex-shrink-0 w-8 h-8 bg-accent-500 rounded-full flex items-center justify-center">
                <div class="w-3 h-3 bg-carbon-100 rounded-full"></div>
              </div>
              <div class="flex-1 bg-carbon-800/50 rounded-ide p-6 border border-carbon-700/50">
                <div class="flex items-center justify-between mb-2">
                  <p class="text-carbon-400 text-sm font-mono">{{ item.year }}</p>
                  <div class="flex items-center space-x-2" v-if="item.current">
                    <div class="w-2 h-2 bg-syntax-success rounded-full animate-pulse"></div>
                    <span class="text-xs font-mono text-carbon-400">current</span>
                  </div>
                </div>
                <h3 class="text-xl font-semibold text-carbon-100 mb-2 font-mono">{{ item.degree }}</h3>
                <p class="text-carbon-300 mb-1">{{ item.institution }}</p>
                <p v-if="item.description" class="text-carbon-400 text-sm">{{ item.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Call to Action -->
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
              <span class="text-syntax-comment">  // Ready to work on your next project</span>
            </p>
            <p class="text-lg text-carbon-400 font-mono">
              <span class="text-syntax-keyword">  return</span>
              <span class="text-syntax-string"> 'Let\'s build something amazing together'</span>
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
import { onMounted, computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useAboutStore } from '@/stores/about/about.store'
import { formatMarkdown } from '@/utils/format.util'
import Button from '@/components/ui/Button.vue'
import Loader from '@/components/ui/Loader.vue'
import SkillsCard from '@/components/about/SkillsCard.vue'

// Store
const aboutStore = useAboutStore()
const { content, skills, loading, error } = storeToRefs(aboutStore)
const education = ref([])

// Computed
const formattedContent = computed(() => {
  if (!content.value?.content) return ''
  
  if (content.value.format === 'markdown') {
    return formatMarkdown(content.value.content)
  }
  
  return content.value.content
})

const hasEducationContent = computed(() => {
  return education.value && education.value.length > 0
})

// Methods
const refreshData = async () => {
  await aboutStore.refreshData()
  fetchEducationData()
}

const fetchEducationData = async () => {
  try {
    // Send the correct parameters to match API expectations
    const response = await aboutStore.fetchContentByType('education')
    
    if (response.success && response.data) {
      try {
        // Check if we have content to parse
        if (!response.data.content) {
          console.log('No education content found')
          education.value = []
          return
        }
        
        // Parse the response based on its type
        if (typeof response.data.content === 'string') {
          education.value = JSON.parse(response.data.content)
        } else if (Array.isArray(response.data.content)) {
          education.value = response.data.content
        } else {
          console.warn('Unexpected education data format:', response.data.content)
          education.value = []
        }
      } catch (parseError) {
        console.error('Failed to parse education data:', parseError)
        education.value = []
      }
    } else {
      console.log('API response unsuccessful or empty')
      education.value = []
    }
  } catch (e) {
    console.error('Error fetching education data:', e)
    education.value = []
  }
}

// Initialize data
onMounted(() => {
  aboutStore.fetchAboutData()
  fetchEducationData()
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

/* Responsive adjustments */
@media (max-width: 768px) {
  .floating-code-element {
    display: none;
  }
}

/* Prose styling for content */
.prose h1 { @apply text-carbon-100 font-mono; }
.prose h2 { @apply text-carbon-200 font-mono; }
.prose h3 { @apply text-carbon-200 font-mono; }
.prose p { @apply text-carbon-300; }
.prose a { @apply text-accent-400 hover:text-accent-300; }
.prose strong { @apply text-carbon-100; }
.prose code { @apply text-accent-400 bg-carbon-800 px-1 py-0.5 rounded; }
.prose blockquote { @apply border-l-accent-500 bg-carbon-800/30 text-carbon-300; }
</style>