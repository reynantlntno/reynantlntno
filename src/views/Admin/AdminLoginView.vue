<template>
  <div class="min-h-screen flex items-center justify-center bg-light-muted dark:bg-dark-muted p-4">
    <div class="glass-card max-w-md w-full">
      <div class="text-center mb-8">
        <h1 class="text-2xl font-bold">Admin Login</h1>
        <p class="text-dark-muted dark:text-light-muted mt-2">Sign in to access admin panel</p>
      </div>
      
      <form @submit.prevent="handleLogin" class="space-y-6">
        <BaseInput
          v-model="username"
          id="username"
          name="username"
          label="Username"
          placeholder="Enter your username"
          required
          :error="errors.username"
          autocomplete="username"
        />
        
        <BaseInput
          v-model="password"
          id="password"
          name="password"
          type="password"
          label="Password"
          placeholder="Enter your password"
          required
          :error="errors.password"
          autocomplete="current-password"
        />
        
        <BaseButton 
          type="submit" 
          class="w-full"
          :loading="authStore.loading"
        >
          Sign In
        </BaseButton>
      </form>
      
      <div class="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 text-center">
        <router-link to="/" class="text-primary dark:text-primary-light text-sm">
          Return to Homepage
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import BaseInput from '@/components/shared/BaseInput.vue';
import BaseButton from '@/components/shared/BaseButton.vue';

const authStore = useAuthStore();
const username = ref('');
const password = ref('');
const errors = ref({});

const handleLogin = async () => {
  // Reset errors
  errors.value = {};
  
  // Basic validation
  if (!username.value) {
    errors.value.username = 'Username is required';
    return;
  }
  
  if (!password.value) {
    errors.value.password = 'Password is required';
    return;
  }
  
  // Attempt login
  await authStore.login({
    username: username.value,
    password: password.value
  });
};
</script>