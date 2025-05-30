<template>
  <div :class="{'dark': isDarkMode}" class="min-h-screen">
    <ErrorBoundary>
      <TheHeader />
      <main class="min-h-[calc(100vh-152px)]">
        <router-view v-slot="{ Component }">
          <transition name="page" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
      <TheFooter />
    </ErrorBoundary>
  </div>
</template>

<script setup>
import { onMounted, watch } from 'vue';
import { useThemeStore } from '@/stores/themeStore';
import ErrorBoundary from '@/components/shared/ErrorBoundary.vue';
import TheHeader from '@/components/shared/TheHeader.vue';
import TheFooter from '@/components/shared/TheFooter.vue';

const themeStore = useThemeStore();
const isDarkMode = themeStore.darkMode;

onMounted(() => {
  themeStore.initTheme();
});

watch(() => themeStore.darkMode, (newValue) => {
  if (newValue) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}, { immediate: true });
</script>

<style>
.page-enter-active,
.page-leave-active {
  transition: opacity 0.15s ease-in-out, transform 0.15s ease-in-out;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.page-enter-to,
.page-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>