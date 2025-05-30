<template>
  <div class="container mx-auto px-4 py-12">
    <div class="max-w-5xl mx-auto">
      <h1 class="text-4xl font-bold mb-2">My Projects</h1>
      <div class="h-1 w-24 bg-primary mb-6"></div>
      
      <p class="text-lg mb-8 text-gray-600 dark:text-gray-300">
        Here's a showcase of my recent projects, highlighting my technical skills and problem-solving approach.
      </p>
      
      <!-- Project Categories -->
      <div class="flex flex-wrap gap-3 mb-8">
        <button 
          @click="activeCategory = 'all'"
          :class="[
            'px-4 py-2 rounded-lg transition',
            activeCategory === 'all' 
              ? 'bg-primary text-white' 
              : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
          ]"
        >
          All Projects
        </button>
        <button 
          v-for="category in categories"
          :key="category"
          @click="activeCategory = category"
          :class="[
            'px-4 py-2 rounded-lg transition',
            activeCategory === category
              ? 'bg-primary text-white' 
              : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
          ]"
        >
          {{ category }}
        </button>
      </div>
      
      <!-- Loading State -->
      <div v-if="projectsStore.isLoading" class="my-12 space-y-8">
        <div v-for="i in 4" :key="i" class="animate-pulse">
          <div class="h-48 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
          <div class="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2 w-full"></div>
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2 w-full"></div>
        </div>
      </div>
      
      <!-- Error State -->
      <div v-else-if="projectsStore.error" class="glass-panel p-8 text-center my-12">
        <svg class="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <h2 class="text-2xl font-bold mb-2">Failed to Load Projects</h2>
        <p class="text-gray-600 dark:text-gray-400 mb-6">
          {{ projectsStore.error }}
        </p>
        <button @click="loadProjects" class="btn-primary">
          Try Again
        </button>
      </div>
      
      <!-- Empty State -->
      <div v-else-if="filteredProjects.length === 0" class="glass-panel p-8 text-center my-12">
        <svg class="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
        </svg>
        <h2 class="text-2xl font-bold mb-2">No Projects Found</h2>
        <p class="text-gray-600 dark:text-gray-400">
          No projects match the selected category. Try another category or check back later.
        </p>
      </div>
      
      <!-- Project Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div 
          v-for="project in filteredProjects" 
          :key="project.id" 
          class="glass-panel overflow-hidden flex flex-col h-full"
        >
          <div class="h-60 bg-gray-200 dark:bg-gray-700 overflow-hidden">
            <img 
              v-if="project.image" 
              :src="project.image" 
              :alt="project.title" 
              class="w-full h-full object-cover hover:scale-105 transition-transform duration-500" 
            />
            <div v-else class="w-full h-full flex items-center justify-center">
              <svg class="w-20 h-20 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd"></path>
              </svg>
            </div>
          </div>
          
          <div class="p-6 flex-grow flex flex-col">
            <div class="flex-grow">
              <h2 class="text-xl font-bold mb-3">{{ project.title }}</h2>
              <p class="text-gray-600 dark:text-gray-400 mb-4">{{ project.description }}</p>
              <div class="flex flex-wrap gap-2 mb-4">
                <span 
                  v-for="tech in project.technologies" 
                  :key="tech" 
                  class="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs rounded-full"
                >
                  {{ tech }}
                </span>
              </div>
            </div>
            <div class="pt-4 mt-auto flex gap-3">
              <a
                v-if="project.liveUrl"
                :href="project.liveUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="btn-primary py-2 px-4 text-sm"
              >
                View Live
              </a>
              <a
                v-if="project.repoUrl"
                :href="project.repoUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="btn-outline py-2 px-4 text-sm"
              >
                View Code
              </a>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Interested in working together CTA -->
      <div class="glass-panel p-8 text-center">
        <h2 class="text-2xl font-bold mb-4">Interested in working together?</h2>
        <p class="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
          I'm always open to discussing new projects, creative ideas or opportunities to be part of your vision.
        </p>
        <div class="flex flex-wrap justify-center gap-4">
          <router-link to="/contact" class="btn-primary">
            Get In Touch
          </router-link>
          <router-link to="/appointments" class="btn-outline">
            Schedule a Call
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useProjectsStore } from '@store/index';

// Initialize store
const projectsStore = useProjectsStore();

// State
const activeCategory = ref('all');
const categories = ref([]);

// Computed properties
const filteredProjects = computed(() => {
  if (activeCategory.value === 'all') {
    return projectsStore.projects;
  }
  return projectsStore.projects.filter(project => project.category === activeCategory.value);
});

// Load projects
const loadProjects = async () => {
  await projectsStore.fetchProjects();
  
  // Extract unique categories from projects
  if (projectsStore.projects.length > 0) {
    const categorySet = new Set();
    projectsStore.projects.forEach(project => {
      if (project.category) {
        categorySet.add(project.category);
      }
    });
    categories.value = Array.from(categorySet);
  }
};

// Watch for category changes
watch(activeCategory, (newCategory) => {
  if (newCategory !== 'all') {
    projectsStore.fetchProjects(newCategory);
  } else {
    projectsStore.fetchProjects();
  }
});

// Load projects when component mounts
onMounted(() => {
  loadProjects();
});
</script>