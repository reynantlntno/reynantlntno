<template>
  <div class="min-h-screen flex flex-col md:flex-row bg-light-muted dark:bg-dark-muted">
    <!-- Sidebar -->
    <aside class="w-full md:w-64 glass md:min-h-screen">
      <div class="p-4 flex items-center justify-between">
        <router-link to="/admin/dashboard" class="flex items-center">
          <span class="text-xl font-bold text-primary dark:text-primary-light">Admin</span>
          <span class="text-lg text-dark-muted dark:text-light-muted">Panel</span>
        </router-link>
        
        <button 
          @click="isSidebarOpen = !isSidebarOpen" 
          class="md:hidden p-2 rounded-md text-dark-muted dark:text-light-muted"
        >
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path v-if="isSidebarOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
      
      <nav class="mt-8" :class="{ 'hidden': !isSidebarOpen, 'md:block': true }">
        <div class="px-4 space-y-1">
          <router-link 
            v-for="item in navigation" 
            :key="item.name"
            :to="item.href"
            class="flex items-center px-4 py-2 rounded-md transition-colors"
            :class="[
              isActive(item.href) ? 
                'bg-primary/10 text-primary dark:text-primary-light' : 
                'text-dark-muted dark:text-light-muted hover:bg-light hover:dark:bg-dark'
            ]"
            @click="isSidebarOpen = false"
          >
            <component :is="item.icon" class="mr-3 h-5 w-5" />
            {{ item.name }}
          </router-link>
        </div>
        
        <div class="mt-10 px-4">
          <button 
            @click="handleLogout" 
            class="w-full flex items-center px-4 py-2 rounded-md text-red-600 dark:text-red-400 hover:bg-light hover:dark:bg-dark transition-colors"
          >
            <svg class="mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </nav>
    </aside>
    
    <!-- Main content -->
    <main class="flex-1 p-4">
      <div class="glass p-4">
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-2xl font-bold">{{ title }}</h1>
          <div class="flex items-center space-x-4">
            <ThemeToggle />
            <div class="text-dark-muted dark:text-light-muted text-sm">
              <span>Welcome, Admin</span>
            </div>
          </div>
        </div>
        
        <div>
          <slot></slot>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import ThemeToggle from '@/components/shared/ThemeToggle.vue';

const props = defineProps({
  title: {
    type: String,
    required: true
  }
});

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const isSidebarOpen = ref(false);

// Navigation icons as components
const DashboardIcon = () => h('svg', { class: 'h-5 w-5', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' })
]);

const BlogIcon = () => h('svg', { class: 'h-5 w-5', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z' })
]);

const AppointmentIcon = () => h('svg', { class: 'h-5 w-5', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' })
]);

const MessagesIcon = () => h('svg', { class: 'h-5 w-5', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' })
]);

const SettingsIcon = () => h('svg', { class: 'h-5 w-5', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' }),
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z' })
]);

// Navigation items
const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: DashboardIcon },
  { name: 'Blog Posts', href: '/admin/blog', icon: BlogIcon },
  { name: 'Appointments', href: '/admin/appointments', icon: AppointmentIcon },
  { name: 'Messages', href: '/admin/messages', icon: MessagesIcon },
  { name: 'Settings', href: '/admin/settings', icon: SettingsIcon },
];

// Check if route is active
const isActive = (path) => {
  return route.path === path || route.path.startsWith(`${path}/`);
};

// Handle logout
const handleLogout = () => {
  authStore.logout();
};
</script>

<script>
import { h } from 'vue';
</script>