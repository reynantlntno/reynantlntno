<template>
  <div class="flex flex-col min-h-screen">
    <TheHeader />
    <main class="flex-grow">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    <TheFooter />
  </div>
</template>

<script setup>
import { onBeforeMount } from 'vue';
import TheHeader from '@components/TheHeader.vue';
import TheFooter from '@components/TheFooter.vue';
import { useDarkMode } from '@composables/useDarkMode';

const { initializeDarkMode } = useDarkMode();

// Initialize dark mode based on user preference
onBeforeMount(() => {
  initializeDarkMode();
});
</script>