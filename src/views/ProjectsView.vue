<template>
  <div>
    <!-- Header Section -->
    <section class="py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h1 class="text-4xl md:text-5xl font-bold mb-4">My Projects</h1>
          <p class="text-lg text-dark-muted dark:text-light-muted max-w-2xl mx-auto">
            A showcase of my recent work, side projects, and contributions to open-source.
          </p>
        </div>
      </div>
    </section>
    
    <!-- Project Filters -->
    <section class="mb-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-wrap justify-center gap-2">
          <button 
            v-for="category in categories" 
            :key="category"
            @click="filterCategory = category"
            class="px-4 py-2 rounded-full text-sm font-medium transition-colors"
            :class="filterCategory === category ? 
              'bg-primary text-white' : 
              'bg-light-muted dark:bg-dark-muted text-dark-muted dark:text-light-muted hover:bg-light hover:dark:bg-dark'"
          >
            {{ category }}
          </button>
        </div>
      </div>
    </section>
    
    <!-- Projects Grid -->
    <section class="pb-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div v-if="isLoading" class="flex justify-center py-12">
          <LoadingSpinner size="lg" text="Loading projects..." />
        </div>
        
        <div v-else-if="filteredProjects.length === 0" class="text-center py-12">
          <p class="text-dark-muted dark:text-light-muted text-lg">No projects found in this category.</p>
        </div>
        
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <ProjectCard 
            v-for="project in filteredProjects" 
            :key="project.id" 
            :project="project" 
          />
        </div>
      </div>
    </section>
    
    <!-- Call to Action -->
    <section class="py-16 bg-light-muted dark:bg-dark-muted">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="glass-card text-center p-8">
          <h2 class="text-2xl md:text-3xl font-bold mb-4">Have a project in mind?</h2>
          <p class="text-dark-muted dark:text-light-muted mb-6">
            Let's discuss how I can help bring your vision to life.
          </p>
          <div class="flex justify-center">
            <router-link to="/contact">
              <BaseButton>Get in Touch</BaseButton>
            </router-link>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import ProjectCard from '@/components/Projects/ProjectCard.vue';
import LoadingSpinner from '@/components/shared/LoadingSpinner.vue';
import BaseButton from '@/components/shared/BaseButton.vue';

const categories = ['All', 'Web Apps', 'Mobile', 'UI/UX', 'Backend'];
const filterCategory = ref('All');
const isLoading = ref(true);

// Sample project data (in a real app, this would come from an API)
const projects = ref([
  {
    id: 1,
    title: 'E-commerce Platform',
    description: 'A full-stack e-commerce solution with product management, shopping cart, and payment processing.',
    image: 'https://picsum.photos/seed/ecommerce/600/400',
    tags: ['Vue 3', 'Node.js', 'MongoDB', 'Stripe'],
    category: 'Web Apps',
    url: '/projects/ecommerce-platform'
  },
  {
    id: 2,
    title: 'Health Tracking App',
    description: 'Mobile-first PWA for tracking health metrics with data visualization and goal setting.',
    image: 'https://picsum.photos/seed/health/600/400',
    tags: ['Vue', 'PWA', 'Chart.js', 'IndexedDB'],
    category: 'Mobile',
    url: '/projects/health-tracking'
  },
  {
    id: 3,
    title: 'Portfolio Generator',
    description: 'SaaS tool that helps developers create professional portfolios without writing code.',
    image: 'https://picsum.photos/seed/portfolio/600/400',
    tags: ['Vue', 'Tailwind CSS', 'Firebase'],
    category: 'Web Apps',
    url: '/projects/portfolio-generator'
  },
  {
    id: 4,
    title: 'Banking UI Redesign',
    description: 'Modern redesign of a banking application interface focusing on accessibility and user experience.',
    image: 'https://picsum.photos/seed/banking/600/400',
    tags: ['UI/UX', 'Figma', 'Prototype'],
    category: 'UI/UX',
    url: '/projects/banking-ui-redesign'
  },
  {
    id: 5,
    title: 'API Microservices',
    description: 'Collection of microservices for handling authentication, payments, and data processing.',
    image: 'https://picsum.photos/seed/microservices/600/400',
    tags: ['Node.js', 'Express', 'Docker', 'MongoDB'],
    category: 'Backend',
    url: '/projects/api-microservices'
  },
  {
    id: 6,
    title: 'Real Estate Listings',
    description: 'Property listing platform with search, filtering, and virtual tours integration.',
    image: 'https://picsum.photos/seed/realestate/600/400',
    tags: ['Vue', 'Google Maps API', 'Firebase'],
    category: 'Web Apps',
    url: '/projects/real-estate-listings'
  }
]);

const filteredProjects = computed(() => {
  if (filterCategory.value === 'All') {
    return projects.value;
  }
  return projects.value.filter(project => project.category === filterCategory.value);
});

// Simulate loading data
onMounted(() => {
  setTimeout(() => {
    isLoading.value = false;
  }, 1000);
});
</script>