<template>
  <div class="glass-card overflow-hidden transition-all duration-300 hover:shadow-lg">
    <div class="relative h-48 overflow-hidden">
      <img 
        :src="project.image" 
        :alt="project.title"
        class="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
      />
    </div>
    
    <div class="p-6">
      <h3 class="text-xl font-semibold mb-2 truncate">{{ project.title }}</h3>
      
      <p class="text-dark-muted dark:text-light-muted mb-4 text-sm line-clamp-3">
        {{ project.description }}
      </p>
      
      <div class="flex flex-wrap gap-2 mb-4">
        <span 
          v-for="(tag, index) in project.tags" 
          :key="index"
          class="px-2 py-1 text-xs font-medium bg-light-muted dark:bg-dark-muted rounded-full"
        >
          {{ tag }}
        </span>
      </div>
      
      <router-link :to="project.url" class="text-primary dark:text-primary-light font-medium flex items-center">
        View Project
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </router-link>
    </div>
  </div>
</template>

<script setup>
defineProps({
  project: {
    type: Object,
    required: true
  }
});
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>