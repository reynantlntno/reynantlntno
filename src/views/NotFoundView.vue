
<template>
  <div class="min-h-[70vh] flex flex-col items-center justify-center px-4">
    <div class="text-center">
      <h1 class="text-9xl font-bold text-primary dark:text-primary-light">404</h1>
      <h2 class="text-3xl md:text-4xl font-bold mt-4 mb-8">Page Not Found</h2>
      <p class="text-dark-muted dark:text-light-muted mb-8 max-w-lg mx-auto">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <div class="flex flex-wrap justify-center gap-4">
        <router-link to="/">
          <BaseButton>Return Home</BaseButton>
        </router-link>
        <router-link to="/contact">
          <BaseButton variant="outline">Contact Support</BaseButton>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import BaseButton from '@/components/shared/BaseButton.vue';
</script>