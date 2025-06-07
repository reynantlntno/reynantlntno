<template>
  <div
    class="bg-carbon-800/50 rounded-ide border border-carbon-700/50 p-6 hover:border-accent-500/50 hover:shadow-glow-accent transition-all duration-300"
  >
    <!-- Category Header -->
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-xl font-semibold text-carbon-100 font-mono capitalize">
        {{ formatCategoryName(category) }}
      </h3>
      <div class="flex items-center space-x-2">
        <div class="w-2 h-2 bg-syntax-success rounded-full"></div>
        <span class="text-xs font-mono text-carbon-400">active</span>
      </div>
    </div>
    
    <!-- Skills List -->
    <div class="space-y-4">
      <div
        v-for="(skill, index) in skills"
        :key="skill.id"
        class="skill-item"
        :style="{ animationDelay: `${(index + 1) * 0.1}s` }"
      >
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center space-x-3">
            <img
              v-if="skill.icon"
              :src="skill.icon"
              :alt="skill.name"
              class="w-6 h-6 object-contain"
              @error="handleIconError"
            />
            <div v-else class="w-6 h-6 bg-accent-500/20 rounded flex items-center justify-center">
              <div class="w-3 h-3 bg-accent-400 rounded"></div>
            </div>
            <span class="text-carbon-200 font-mono text-sm">{{ skill.name }}</span>
          </div>
          <span class="text-xs font-mono text-accent-400">{{ skill.proficiency }}/10</span>
        </div>
        
        <!-- Progress Bar -->
        <div class="w-full bg-carbon-700 rounded-full h-2 overflow-hidden">
          <div
            class="bg-gradient-to-r from-accent-500 to-accent-400 h-2 rounded-full skill-bar"
            :style="{ 
              '--target-width': `${(skill.proficiency / 10) * 100}%`,
              animationDelay: `${(index + 1) * 0.1 + 0.3}s`
            }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Props
defineProps({
  category: {
    type: String,
    required: true
  },
  skills: {
    type: Array,
    required: true
  }
})

// Methods
const formatCategoryName = (category) => {
  return category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}

const handleIconError = (event) => {
  event.target.style.display = 'none'
}
</script>

<style scoped>
/* Skill Bar Animation */
.skill-bar {
  width: 0;
  animation: skill-fill 1.5s ease-out forwards;
}

@keyframes skill-fill {
  0% {
    width: 0;
  }
  100% {
    width: var(--target-width);
  }
}

/* Skill item animations */
.skill-item {
  opacity: 0;
  animation: slide-in-up 0.6s ease-out forwards;
}

@keyframes slide-in-up {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>