<template>
  <div>
    <!-- Hero Section -->
    <section class="relative overflow-hidden">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div class="md:w-3/5">
          <h1 class="text-5xl md:text-6xl font-bold mb-6">
            <span class="text-primary dark:text-primary-light">Software Developer</span> Building Modern Web Solutions
          </h1>
          <p class="text-xl md:text-2xl mb-8 text-dark-muted dark:text-light-muted">
            Creating performant, accessible, and beautiful web applications with Vue, Node.js, and modern frontend technologies.
          </p>
          <div class="flex flex-wrap gap-4">
            <router-link to="/projects">
              <BaseButton size="lg">View My Work</BaseButton>
            </router-link>
            <router-link to="/contact">
              <BaseButton size="lg" variant="outline">Get In Touch</BaseButton>
            </router-link>
          </div>
        </div>
        
        <!-- Background decoration -->
        <div aria-hidden="true" class="absolute top-0 right-0 -z-10 transform translate-x-1/3 -translate-y-1/4">
          <div class="w-96 h-96 bg-gradient-to-r from-primary/20 to-primary-light/20 rounded-full blur-3xl opacity-70 dark:opacity-50"></div>
        </div>
      </div>
    </section>
    
    <!-- Featured Projects -->
    <section class="py-16 bg-light-muted dark:bg-dark-muted">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-bold mb-4">Featured Projects</h2>
          <p class="text-lg text-dark-muted dark:text-light-muted max-w-2xl mx-auto">
            Explore some of my recent work and technical solutions.
          </p>
        </div>
        
        <div v-if="isLoading" class="flex justify-center">
          <LoadingSpinner size="lg" text="Loading projects..." />
        </div>
        
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <ProjectCard 
            v-for="project in featuredProjects" 
            :key="project.id" 
            :project="project" 
          />
        </div>
        
        <div class="text-center mt-12">
          <router-link to="/projects">
            <BaseButton variant="outline">View All Projects</BaseButton>
          </router-link>
        </div>
      </div>
    </section>
    
    <!-- Skills Overview -->
    <section class="py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-bold mb-4">My Expertise</h2>
          <p class="text-lg text-dark-muted dark:text-light-muted max-w-2xl mx-auto">
            Technologies and skills that I specialize in.
          </p>
        </div>
        
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          <div v-for="(skill, index) in skills" :key="index" class="glass-card flex flex-col items-center p-6 text-center transition-all hover:shadow-lg">
            <div class="text-primary dark:text-primary-light text-4xl mb-3">
              <component :is="skill.icon" />
            </div>
            <h3 class="font-semibold text-lg mb-2">{{ skill.name }}</h3>
            <p class="text-dark-muted dark:text-light-muted text-sm">{{ skill.description }}</p>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Featured Blog Posts -->
    <section class="py-16 bg-light-muted dark:bg-dark-muted">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-bold mb-4">Latest Insights</h2>
          <p class="text-lg text-dark-muted dark:text-light-muted max-w-2xl mx-auto">
            Technical articles and thoughts on web development.
          </p>
        </div>
        
        <div v-if="loadingPosts" class="flex justify-center">
          <LoadingSpinner size="lg" text="Loading blog posts..." />
        </div>
        
        <div v-else-if="featuredPosts.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <BlogCard 
            v-for="post in featuredPosts" 
            :key="post._id" 
            :post="post" 
          />
        </div>
        
        <div v-else class="text-center py-8">
          <p class="text-dark-muted dark:text-light-muted">No blog posts available yet.</p>
        </div>
        
        <div class="text-center mt-12">
          <router-link to="/blog">
            <BaseButton variant="outline">Read All Articles</BaseButton>
          </router-link>
        </div>
      </div>
    </section>
    
    <!-- CTA Section -->
    <section class="py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="glass-card text-center p-8 md:p-12">
          <h2 class="text-3xl md:text-4xl font-bold mb-6">Ready to Work Together?</h2>
          <p class="text-lg text-dark-muted dark:text-light-muted max-w-2xl mx-auto mb-8">
            Whether you need a website, web application, or technical consultation, I'm here to help turn your ideas into reality.
          </p>
          <div class="flex flex-wrap justify-center gap-4">
            <router-link to="/appointment">
              <BaseButton size="lg">Schedule a Consultation</BaseButton>
            </router-link>
            <router-link to="/contact">
              <BaseButton size="lg" variant="outline">Contact Me</BaseButton>
            </router-link>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useBlogStore } from '@/stores/blogStore';
import BaseButton from '@/components/shared/BaseButton.vue';
import LoadingSpinner from '@/components/shared/LoadingSpinner.vue';
import ProjectCard from '@/components/Projects/ProjectCard.vue';
import BlogCard from '@/components/Blog/BlogCard.vue';

// Blog store
const blogStore = useBlogStore();
const loadingPosts = ref(false);
const featuredPosts = ref([]);

// Projects data
const isLoading = ref(false);
const featuredProjects = ref([
  {
    id: 1,
    title: 'E-commerce Platform',
    description: 'A modern e-commerce solution built with Vue 3, Pinia, and Node.js',
    image: 'https://picsum.photos/seed/ecommerce/600/400',
    tags: ['Vue 3', 'Node.js', 'MongoDB'],
    url: '/projects/ecommerce-platform'
  },
  {
    id: 2,
    title: 'Health Tracking App',
    description: 'Mobile-first PWA for tracking health metrics with data visualization',
    image: 'https://picsum.photos/seed/health/600/400',
    tags: ['Vue', 'PWA', 'Chart.js'],
    url: '/projects/health-tracking'
  },
  {
    id: 3,
    title: 'Portfolio Generator',
    description: 'SaaS tool that helps developers create professional portfolios',
    image: 'https://picsum.photos/seed/portfolio/600/400',
    tags: ['Vue', 'Tailwind CSS', 'Firebase'],
    url: '/projects/portfolio-generator'
  }
]);

// Skills data
const skills = [
  { 
    name: 'Frontend Development', 
    description: 'Vue.js, React, JavaScript, HTML/CSS',
    icon: 'IconCode'
  },
  { 
    name: 'Backend Development', 
    description: 'Node.js, Express, MongoDB, RESTful APIs',
    icon: 'IconServer'
  },
  { 
    name: 'UI/UX Design', 
    description: 'Responsive design, Figma, User experience',
    icon: 'IconDesign'
  },
  { 
    name: 'DevOps', 
    description: 'CI/CD, Docker, AWS, Netlify',
    icon: 'IconCloud'
  },
  { 
    name: 'Performance', 
    description: 'Optimization, Lazy loading, PWA',
    icon: 'IconSpeed'
  },
  { 
    name: 'Best Practices', 
    description: 'Clean code, Testing, SOLID principles',
    icon: 'IconCheck'
  },
  { 
    name: 'Version Control', 
    description: 'Git, GitHub, GitLab',
    icon: 'IconGit'
  },
  { 
    name: 'Project Management', 
    description: 'Agile, Scrum, JIRA',
    icon: 'IconProject'
  }
];

// For simplicity, we'll use functional components for icons
const IconCode = () => h('svg', { class: 'w-8 h-8', fill: 'currentColor', viewBox: '0 0 20 20' }, [
  h('path', { 'fill-rule': 'evenodd', d: 'M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z', 'clip-rule': 'evenodd' })
]);

const IconServer = () => h('svg', { class: 'w-8 h-8', fill: 'currentColor', viewBox: '0 0 20 20' }, [
  h('path', { 'fill-rule': 'evenodd', d: 'M2 5a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm14 1a1 1 0 11-2 0 1 1 0 012 0zM2 13a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 01-2 2H4a2 2 0 01-2-2v-2zm14 1a1 1 0 11-2 0 1 1 0 012 0z', 'clip-rule': 'evenodd' })
]);

const IconDesign = () => h('svg', { class: 'w-8 h-8', fill: 'currentColor', viewBox: '0 0 20 20' }, [
  h('path', { d: 'M10 3.5a1.5 1.5 0 013 0V4a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-.5a1.5 1.5 0 000 3h.5a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-.5a1.5 1.5 0 00-3 0v.5a1 1 0 01-1 1H6a1 1 0 01-1-1v-3a1 1 0 00-1-1h-.5a1.5 1.5 0 010-3H4a1 1 0 001-1V6a1 1 0 011-1h3a1 1 0 001-1v-.5z' })
]);

const IconCloud = () => h('svg', { class: 'w-8 h-8', fill: 'currentColor', viewBox: '0 0 20 20' }, [
  h('path', { d: 'M5.5 16a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 16h-8z' })
]);

const IconSpeed = () => h('svg', { class: 'w-8 h-8', fill: 'currentColor', viewBox: '0 0 20 20' }, [
  h('path', { 'fill-rule': 'evenodd', d: 'M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z', 'clip-rule': 'evenodd' })
]);

const IconCheck = () => h('svg', { class: 'w-8 h-8', fill: 'currentColor', viewBox: '0 0 20 20' }, [
  h('path', { 'fill-rule': 'evenodd', d: 'M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z', 'clip-rule': 'evenodd' })
]);

const IconGit = () => h('svg', { class: 'w-8 h-8', fill: 'currentColor', viewBox: '0 0 20 20' }, [
  h('path', { 'fill-rule': 'evenodd', d: 'M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z', 'clip-rule': 'evenodd' })
]);

const IconProject = () => h('svg', { class: 'w-8 h-8', fill: 'currentColor', viewBox: '0 0 20 20' }, [
  h('path', { 'fill-rule': 'evenodd', d: 'M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm2 10a1 1 0 10-2 0v3a1 1 0 102 0v-3zm2-3a1 1 0 011 1v5a1 1 0 11-2 0v-5a1 1 0 011-1zm4-1a1 1 0 10-2 0v7a1 1 0 102 0V8z', 'clip-rule': 'evenodd' })
]);

onMounted(async () => {
  // Load blog posts
  loadingPosts.value = true;
  try {
    await blogStore.fetchPosts();
    featuredPosts.value = blogStore.featuredPosts;
  } catch (error) {
    console.error('Error loading blog posts:', error);
  } finally {
    loadingPosts.value = false;
  }
});
</script>

<script>
import { h } from 'vue';
</script>