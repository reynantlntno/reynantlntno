<template>
  <div>
    <slot v-if="!error"></slot>
    <div v-else class="error-boundary glass-card mx-auto max-w-2xl my-12 p-6">
      <h2 class="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
      <p class="text-dark-muted dark:text-light-muted mb-4">
        We're sorry, but an unexpected error has occurred. Please try refreshing the page or contact support if the problem persists.
      </p>
      <div class="flex gap-4">
        <BaseButton @click="reload" variant="primary">Refresh Page</BaseButton>
        <BaseButton @click="goHome" variant="outline">Go to Homepage</BaseButton>
      </div>
      <details class="mt-6 p-4 bg-light-muted dark:bg-dark rounded-md">
        <summary class="cursor-pointer text-dark-muted dark:text-light-muted mb-2 font-medium">
          Technical Details
        </summary>
        <pre class="text-sm bg-light dark:bg-dark p-3 rounded-md overflow-x-auto">{{ errorDetails }}</pre>
      </details>
    </div>
  </div>
</template>

<script setup>
import { ref, onErrorCaptured, provide } from 'vue';
import { useRouter } from 'vue-router';
import BaseButton from './BaseButton.vue';

const router = useRouter();
const error = ref(null);
const errorDetails = ref('');

const reload = () => {
  window.location.reload();
};

const goHome = () => {
  error.value = null;
  errorDetails.value = '';
  router.push('/');
};

onErrorCaptured((err, instance, info) => {
  error.value = err;
  errorDetails.value = `Error: ${err.message}\nInfo: ${info}\nComponent: ${instance?.$.type?.name || 'Unknown'}`;
  console.error('Error captured by ErrorBoundary:', err, info);
  return false; // prevent error from propagating further
});

provide('errorBoundary', {
  reportError: (err) => {
    error.value = err;
    errorDetails.value = `Error: ${err.message}\nStack: ${err.stack}`;
  }
});
</script>