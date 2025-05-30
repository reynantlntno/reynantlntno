<template>
  <footer class="py-8 mt-12 border-t border-gray-200 dark:border-gray-800">
    <div class="container mx-auto px-4">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Logo & Description -->
        <div>
          <h3 class="text-xl font-bold gradient-text mb-4">reynantlntno<span class="text-dark dark:text-light">.dev</span></h3>
          <p class="text-gray-600 dark:text-gray-400 mb-4">
            Modern software development portfolio showcasing projects, skills, and professional services.
          </p>
          <div class="flex space-x-4">
            <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer" 
              aria-label="GitHub Profile"
              class="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors">
              <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
              </svg>
            </a>
            <a href="https://linkedin.com/in/yourusername" target="_blank" rel="noopener noreferrer" 
              aria-label="LinkedIn Profile"
              class="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors">
              <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                <rect x="2" y="9" width="4" height="12"></rect>
                <circle cx="4" cy="4" r="2"></circle>
              </svg>
            </a>
            <a href="https://twitter.com/yourusername" target="_blank" rel="noopener noreferrer" 
              aria-label="Twitter Profile"
              class="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors">
              <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
              </svg>
            </a>
          </div>
        </div>
        
        <!-- Quick Links -->
        <div>
          <h3 class="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Quick Links</h3>
          <ul class="space-y-2">
            <li v-for="item in navItems" :key="item.path">
              <router-link :to="item.path" 
                class="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors">
                {{ item.name }}
              </router-link>
            </li>
          </ul>
        </div>
        
        <!-- Contact Info -->
        <div>
          <h3 class="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Contact</h3>
          <div class="space-y-2 text-gray-600 dark:text-gray-400">
            <p class="flex items-center">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
              <a href="mailto:contact@reynantlntno.dev" class="hover:text-primary dark:hover:text-primary transition-colors">
                contact@reynantlntno.dev
              </a>
            </p>
            <p class="flex items-center">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <a href="https://reynantlntno.netlify.app" target="_blank" rel="noopener noreferrer" 
                class="hover:text-primary dark:hover:text-primary transition-colors">
                reynantlntno.netlify.app
              </a>
            </p>
          </div>
        </div>
      </div>
      
      <div class="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800 text-center text-gray-500 dark:text-gray-400 text-sm">
        <p>© {{ new Date().getFullYear() }} Reynan Tolentino. All rights reserved.</p>
        <p class="mt-1">Built with Vue.js, Tailwind CSS, and hosted on Netlify.</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
const navItems = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Projects', path: '/projects' },
  { name: 'Blog', path: '/blog' },
  { name: 'Appointments', path: '/appointments' },
  { name: 'Contact', path: '/contact' },
];
</script>