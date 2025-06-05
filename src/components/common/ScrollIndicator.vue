<template>
  <div class="flex flex-col items-center space-y-3 text-white/70">
    <!-- Mouse -->
    <div class="relative w-6 h-10 border-2 border-current rounded-full flex justify-center">
      <div 
        class="w-1 h-3 bg-current rounded-full mt-2 animate-mouse-wheel"
      ></div>
    </div>
    
    <!-- Scroll text -->
    <div class="text-xs font-mono uppercase tracking-wider animate-fade-in-out">
      Scroll
    </div>
    
    <!-- Arrow indicator -->
    <svg 
      class="w-4 h-4 animate-bounce-slow" 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
    >
      <path 
        stroke-linecap="round" 
        stroke-linejoin="round" 
        stroke-width="2" 
        d="M19 14l-7 7m0 0l-7-7m7 7V3"
      />
    </svg>
  </div>
</template>

<script setup>
// No script needed for this component
</script>

<style scoped>
@keyframes mouse-wheel {
  0% {
    opacity: 1;
    transform: translateY(0);
  }
  50% {
    opacity: 0.5;
    transform: translateY(8px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fade-in-out {
  0%, 100% {
    opacity: 0.7;
  }
  50% {
    opacity: 1;
  }
}

@keyframes bounce-slow {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
  }
}

.animate-mouse-wheel {
  animation: mouse-wheel 2s ease-in-out infinite;
}

.animate-fade-in-out {
  animation: fade-in-out 3s ease-in-out infinite;
}

.animate-bounce-slow {
  animation: bounce-slow 2s ease-in-out infinite;
}
</style>