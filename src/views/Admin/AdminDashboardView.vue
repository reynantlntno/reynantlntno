<template>
  <AdminLayout title="Dashboard">
    <div v-if="isLoading" class="flex justify-center py-12">
      <LoadingSpinner size="lg" text="Loading dashboard data..." />
    </div>
    
    <div v-else>
      <!-- Stats Overview -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-white dark:bg-dark p-6 rounded-lg shadow">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-blue-500/20 text-blue-500">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <div class="ml-4">
              <h2 class="text-gray-500 dark:text-gray-400 text-sm font-medium">Blog Posts</h2>
              <p class="text-3xl font-semibold text-dark dark:text-light">{{ stats.blogCount }}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white dark:bg-dark p-6 rounded-lg shadow">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-green-500/20 text-green-500">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div class="ml-4">
              <h2 class="text-gray-500 dark:text-gray-400 text-sm font-medium">Appointments</h2>
              <p class="text-3xl font-semibold text-dark dark:text-light">{{ stats.appointmentCount }}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white dark:bg-dark p-6 rounded-lg shadow">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-purple-500/20 text-purple-500">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div class="ml-4">
              <h2 class="text-gray-500 dark:text-gray-400 text-sm font-medium">Messages</h2>
              <p class="text-3xl font-semibold text-dark dark:text-light">{{ stats.messageCount }}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Recent Blog Posts -->
        <div class="bg-white dark:bg-dark p-6 rounded-lg shadow">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium">Recent Posts</h3>
            <router-link to="/admin/blog" class="text-sm text-primary dark:text-primary-light">View all</router-link>
          </div>
          
          <div class="space-y-4">
            <div v-if="recentPosts.length === 0" class="text-center py-4 text-dark-muted dark:text-light-muted">
              No blog posts found
            </div>
            
            <div v-for="post in recentPosts" :key="post._id" class="flex items-center border-b dark:border-gray-700 pb-4 last:border-0 last:pb-0">
              <div class="flex-1">
                <h4 class="text-dark dark:text-light font-medium">{{ post.title }}</h4>
                <p class="text-dark-muted dark:text-light-muted text-sm">{{ formatDate(post.publishedAt) }}</p>
              </div>
              <router-link :to="`/admin/blog/edit/${post._id}`" class="text-primary dark:text-primary-light">
                Edit
              </router-link>
            </div>
          </div>
        </div>
        
        <!-- Recent Appointments -->
        <div class="bg-white dark:bg-dark p-6 rounded-lg shadow">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium">Recent Appointments</h3>
            <router-link to="/admin/appointments" class="text-sm text-primary dark:text-primary-light">View all</router-link>
          </div>
          
          <div class="space-y-4">
            <div v-if="recentAppointments.length === 0" class="text-center py-4 text-dark-muted dark:text-light-muted">
              No appointments found
            </div>
            
            <div v-for="appointment in recentAppointments" :key="appointment._id" class="flex items-center border-b dark:border-gray-700 pb-4 last:border-0 last:pb-0">
              <div class="flex-1">
                <h4 class="text-dark dark:text-light font-medium">{{ appointment.name }}</h4>
                <p class="text-dark-muted dark:text-light-muted text-sm">
                  {{ formatDate(appointment.date) }} at {{ formatTime(appointment.timeSlot) }}
                </p>
              </div>
              <span 
                class="px-2 py-1 text-xs rounded-full"
                :class="{
                  'bg-yellow-100 text-yellow-800 dark:bg-yellow-800/30 dark:text-yellow-300': appointment.status === 'pending',
                  'bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-300': appointment.status === 'confirmed',
                  'bg-red-100 text-red-800 dark:bg-red-800/30 dark:text-red-300': appointment.status === 'cancelled'
                }"
              >
                {{ appointment.status }}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Recent Messages -->
      <div class="mt-6 bg-white dark:bg-dark p-6 rounded-lg shadow">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium">Recent Messages</h3>
          <router-link to="/admin/messages" class="text-sm text-primary dark:text-primary-light">View all</router-link>
        </div>
        
        <div class="space-y-4">
          <div v-if="recentMessages.length === 0" class="text-center py-4 text-dark-muted dark:text-light-muted">
            No messages found
          </div>
          
          <div v-for="message in recentMessages" :key="message._id" class="border-b dark:border-gray-700 pb-4 last:border-0 last:pb-0">
            <div class="flex justify-between items-start">
              <div>
                <h4 class="text-dark dark:text-light font-medium">{{ message.name }}</h4>
                <p class="text-dark-muted dark:text-light-muted text-sm">{{ formatDate(message.createdAt) }}</p>
              </div>
              <span 
                class="px-2 py-1 text-xs rounded-full"
                :class="{
                  'bg-blue-100 text-blue-800 dark:bg-blue-800/30 dark:text-blue-300': message.status === 'new',
                  'bg-purple-100 text-purple-800 dark:bg-purple-800/30 dark:text-purple-300': message.status === 'read',
                  'bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-300': message.status === 'responded'
                }"
              >
                {{ message.status }}
              </span>
            </div>
            <p class="text-dark-muted dark:text-light-muted text-sm mt-1 line-clamp-2">
              {{ message.message }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { formatDate, formatTime } from '@/utils/formatters';
import axios from 'axios';
import AdminLayout from '@/components/Admin/AdminLayout.vue';
import LoadingSpinner from '@/components/shared/LoadingSpinner.vue';

const isLoading = ref(true);
const stats = ref({
  blogCount: 0,
  appointmentCount: 0,
  messageCount: 0
});
const recentPosts = ref([]);
const recentAppointments = ref([]);
const recentMessages = ref([]);

onMounted(async () => {
  try {
    // Fetch dashboard data
    const response = await axios.get('/api/admin/dashboard');
    
    // Update data
    stats.value = response.data.stats;
    recentPosts.value = response.data.recentPosts;
    recentAppointments.value = response.data.recentAppointments;
    recentMessages.value = response.data.recentMessages;
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>