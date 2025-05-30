<template>
  <div class="container mx-auto px-4 py-16">
    <div class="max-w-lg mx-auto text-center">
      <div class="mb-8 text-primary">
        <svg class="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      </div>
      
      <h1 class="text-5xl md:text-6xl font-bold mb-4">404</h1>
      <h2 class="text-2xl md:text-3xl font-semibold mb-4">Page Not Found</h2>
      
      <p class="text-gray-600 dark:text-gray-400 mb-8">
        The page you are looking for doesn't exist or has been moved.
      </p>
      
      <div class="flex flex-wrap justify-center gap-4">
        <router-link to="/" class="btn-primary">
          Back to Home
        </router-link>
        <router-link to="/contact" class="btn-outline">
          Contact Me
        </router-link>
      </div>
    </div>
  </div>
</template>