<template>
  <div class="grid grid-cols-1 gap-6">
    <!-- Frontend Skills -->
    <div class="glass-card">
      <h3 class="text-xl font-bold mb-4">Frontend</h3>
      <div class="flex flex-wrap gap-2">
        <span v-for="(skill, index) in frontendSkills" :key="index" 
              class="px-3 py-1 bg-light-muted dark:bg-dark-muted rounded-full text-sm">
          {{ skill }}
        </span>
      </div>
    </div>
    
    <!-- Backend Skills -->
    <div class="glass-card">
      <h3 class="text-xl font-bold mb-4">Backend</h3>
      <div class="flex flex-wrap gap-2">
        <span v-for="(skill, index) in backendSkills" :key="index" 
              class="px-3 py-1 bg-light-muted dark:bg-dark-muted rounded-full text-sm">
          {{ skill }}
        </span>
      </div>
    </div>
    
    <!-- Database Skills -->
    <div class="glass-card">
      <h3 class="text-xl font-bold mb-4">Databases</h3>
      <div class="flex flex-wrap gap-2">
        <span v-for="(skill, index) in databaseSkills" :key="index" 
              class="px-3 py-1 bg-light-muted dark:bg-dark-muted rounded-full text-sm">
          {{ skill }}
        </span>
      </div>
    </div>
    
    <!-- Tools & Others -->
    <div class="glass-card">
      <h3 class="text-xl font-bold mb-4">Tools & Others</h3>
      <div class="flex flex-wrap gap-2">
        <span v-for="(skill, index) in otherSkills" :key="index" 
              class="px-3 py-1 bg-light-muted dark:bg-dark-muted rounded-full text-sm">
          {{ skill }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const frontendSkills = ref([
  'Vue.js', 'React', 'JavaScript', 'TypeScript', 'HTML5', 'CSS3', 'Sass/SCSS',
  'Tailwind CSS', 'Responsive Design', 'PWAs', 'Webpack', 'Vite'
]);

const backendSkills = ref([
  'Node.js', 'Express', 'RESTful APIs', 'GraphQL', 'API Design', 
  'Serverless Functions', 'Authentication', 'Authorization'
]);

const databaseSkills = ref([
  'MongoDB', 'Mongoose', 'PostgreSQL', 'MySQL', 'Redis', 'Firebase'
]);

const otherSkills = ref([
  'Git', 'GitHub', 'CI/CD', 'Docker', 'AWS', 'Netlify', 'Vercel',
  'Jest', 'Cypress', 'Performance Optimization', 'SEO', 'Figma'
]);
</script>