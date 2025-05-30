<template>
  <div>
    <!-- Hero Section -->
    <section class="py-20 md:py-28">
      <div class="container mx-auto px-4">
        <div class="flex flex-col md:flex-row items-center">
          <div class="md:w-1/2 mb-8 md:mb-0">
            <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              Hi, I'm <span class="gradient-text">Reynan Tolentino</span>
            </h1>
            <h2 class="text-2xl md:text-3xl text-gray-600 dark:text-gray-300 mb-6">
              Software Developer & Tech Enthusiast
            </h2>
            <p class="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-lg">
              I create modern, responsive web applications using cutting-edge technologies.
              Let's build something amazing together.
            </p>
            <div class="flex flex-wrap gap-4">
              <router-link to="/projects" class="btn-primary">
                View My Projects
              </router-link>
              <router-link to="/contact" class="btn-outline">
                Get In Touch
              </router-link>
            </div>
          </div>
          <div class="md:w-1/2 flex justify-center">
            <div class="relative">
              <div class="w-64 h-64 md:w-80 md:h-80 rounded-full bg-gradient-to-r from-primary/20 to-blue-500/20 animate-gradient-shift"></div>
              <div class="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                <!-- Replace with your actual profile image -->
                <div class="w-56 h-56 md:w-72 md:h-72 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                  <svg class="w-36 h-36 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Skills Section -->
    <section class="py-16 bg-gray-50 dark:bg-gray-800/50">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-center mb-2">My Skills</h2>
        <div class="h-1 w-24 bg-primary mx-auto mb-12"></div>
        
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div class="glass-panel p-6 text-center">
            <div class="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-primary/10 rounded-full">
              <svg class="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-2">Frontend</h3>
            <p class="text-gray-600 dark:text-gray-400">Vue.js, React, Tailwind CSS</p>
          </div>
          
          <div class="glass-panel p-6 text-center">
            <div class="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-primary/10 rounded-full">
              <svg class="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-2">Backend</h3>
            <p class="text-gray-600 dark:text-gray-400">Node.js, PHP, Serverless</p>
          </div>
          
          <div class="glass-panel p-6 text-center">
            <div class="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-primary/10 rounded-full">
              <svg class="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-2">Database</h3>
            <p class="text-gray-600 dark:text-gray-400">MongoDB, MySQL, Firebase</p>
          </div>
          
          <div class="glass-panel p-6 text-center">
            <div class="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-primary/10 rounded-full">
              <svg class="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-2">DevOps</h3>
            <p class="text-gray-600 dark:text-gray-400">CI/CD, AWS, Netlify</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Projects Section -->
    <section class="py-16">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-center mb-2">Featured Projects</h2>
        <div class="h-1 w-24 bg-primary mx-auto mb-4"></div>
        <p class="text-center text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-12">
          Here are some of my recent projects. Check out my projects page to see more of my work.
        </p>

        <!-- Loading state -->
        <div v-if="projectsStore.isLoadingFeatured" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <div v-for="i in 3" :key="i" class="animate-pulse">
            <div class="glass-panel overflow-hidden">
              <div class="h-48 bg-gray-200 dark:bg-gray-700"></div>
              <div class="p-6">
                <div class="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4 w-3/4"></div>
                <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2 w-full"></div>
                <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2 w-full"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Error state -->
        <div v-else-if="projectsStore.error" class="glass-panel p-8 text-center mb-12">
          <p class="text-red-500 mb-4">{{ projectsStore.error }}</p>
          <button @click="projectsStore.fetchFeaturedProjects()" class="btn-primary">Try Again</button>
        </div>

        <!-- Featured Projects -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div 
            v-for="project in projectsStore.featuredProjects" 
            :key="project.id"
            class="glass-panel overflow-hidden flex flex-col h-full"
          >
            <div class="bg-gray-200 dark:bg-gray-700 h-48 overflow-hidden">
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
            <div class="p-6 flex-grow">
              <h3 class="text-xl font-bold mb-2">{{ project.title }}</h3>
              <p class="text-gray-600 dark:text-gray-400 mb-4">
                {{ project.description }}
              </p>
              <div class="flex flex-wrap gap-2 mb-4">
                <span 
                  v-for="tech in project.technologies.slice(0, 3)" 
                  :key="tech" 
                  class="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs rounded-full"
                >
                  {{ tech }}
                </span>
                <span 
                  v-if="project.technologies.length > 3" 
                  class="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs rounded-full"
                >
                  +{{ project.technologies.length - 3 }} more
                </span>
              </div>
            </div>
            <div class="px-6 pb-6">
              <router-link :to="`/projects/${project.slug}`" class="text-primary hover:underline font-medium">View Details →</router-link>
            </div>
          </div>
        </div>

        <div class="text-center mt-12">
          <router-link to="/projects" class="btn-primary inline-block">
            View All Projects
          </router-link>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-16 bg-gradient-to-r from-primary to-blue-600 text-white">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-3xl md:text-4xl font-bold mb-4">Ready to Start Your Project?</h2>
        <p class="text-xl mb-8 max-w-2xl mx-auto">
          Let's collaborate and bring your ideas to life with modern web technologies.
        </p>
        <div class="flex flex-wrap justify-center gap-4">
          <router-link to="/contact" class="px-8 py-3 bg-white text-primary font-semibold rounded-lg hover:bg-gray-100 transition shadow-lg">
            Contact Me
          </router-link>
          <router-link to="/appointments" class="px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition">
            Schedule a Call
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useProjectsStore } from '@store/index';

// Initialize store
const projectsStore = useProjectsStore();

// Load featured projects when component mounts
onMounted(() => {
  projectsStore.fetchFeaturedProjects(3);
});
</script>