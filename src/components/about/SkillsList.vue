<template>
  <div class="space-y-8">
    <!-- Loading State -->
    <div v-if="aboutStore.loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="i in 6" :key="i" class="card p-6">
        <div class="animate-pulse">
          <div class="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-4"></div>
          <div class="space-y-2">
            <div class="h-3 bg-gray-300 dark:bg-gray-600 rounded"></div>
            <div class="h-3 bg-gray-300 dark:bg-gray-600 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="aboutStore.error" class="text-center py-8">
      <p class="text-red-600 dark:text-red-400 mb-4">{{ aboutStore.error }}</p>
      <BaseButton @click="aboutStore.fetchSkills()" variant="primary">
        Try Again
      </BaseButton>
    </div>

    <!-- Skills by Category -->
    <div v-else-if="aboutStore.hasSkills">
      <div v-for="(skills, category) in aboutStore.skillsByCategory" :key="category" class="mb-12">
        <!-- Category Header -->
        <div class="flex items-center mb-6">
          <h3 class="text-2xl font-bold text-gray-900 dark:text-white capitalize">
            {{ formatCategoryName(category) }}
          </h3>
          <div class="ml-4 flex-1 h-px bg-gradient-to-r from-custom-blue-800 to-transparent"></div>
        </div>

        <!-- Skills Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <div
            v-for="skill in skills"
            :key="skill.id"
            class="group relative bg-white dark:bg-custom-slate-700 rounded-lg p-4 border border-gray-200 dark:border-custom-slate-600 hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer"
            @click="selectSkill(skill)"
          >
            <!-- Skill Icon -->
            <div class="flex items-center mb-3">
              <div 
                v-if="skill.icon"
                class="w-8 h-8 mr-3 flex items-center justify-center rounded-full bg-custom-blue-100 dark:bg-custom-blue-800/20"
              >
                <img 
                  v-if="isImageUrl(skill.icon)"
                  :src="skill.icon" 
                  :alt="skill.name"
                  class="w-6 h-6 object-contain"
                  @error="handleIconError"
                />
                <span 
                  v-else
                  class="text-custom-blue-800 dark:text-custom-blue-400 text-sm font-mono"
                >
                  {{ skill.icon }}
                </span>
              </div>
              <div 
                v-else
                class="w-8 h-8 mr-3 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700"
              >
                <CodeBracketIcon class="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </div>
              
              <!-- Skill Name -->
              <h4 class="font-semibold text-gray-900 dark:text-white group-hover:text-custom-blue-800 dark:group-hover:text-custom-blue-400 transition-colors duration-200">
                {{ skill.name }}
              </h4>
            </div>

            <!-- Proficiency Bar -->
            <div class="mb-3">
              <div class="flex items-center justify-between mb-1">
                <span class="text-xs font-medium text-gray-600 dark:text-gray-400">
                  Proficiency
                </span>
                <span class="text-xs font-bold text-custom-blue-800 dark:text-custom-blue-400">
                  {{ skill.proficiency }}/10
                </span>
              </div>
              <div class="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                <div 
                  class="bg-gradient-to-r from-custom-blue-800 to-custom-blue-900 h-2 rounded-full transition-all duration-500 ease-out"
                  :style="{ width: `${skill.proficiency * 10}%` }"
                ></div>
              </div>
            </div>

            <!-- Description (if available) -->
            <p 
              v-if="skill.description"
              class="text-sm text-gray-600 dark:text-gray-300 line-clamp-2"
            >
              {{ skill.description }}
            </p>

            <!-- Proficiency Level Badge -->
            <div class="absolute top-2 right-2">
              <span 
                :class="getProficiencyBadgeClass(skill.proficiency)"
                class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
              >
                {{ getProficiencyLevel(skill.proficiency) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12">
      <CodeBracketIcon class="h-16 w-16 text-gray-400 mx-auto mb-4" />
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No skills found</h3>
      <p class="text-gray-600 dark:text-gray-400">Skills will appear here once they're added.</p>
    </div>

    <!-- Skill Detail Modal -->
    <Teleport to="body">
      <div
        v-if="selectedSkill"
        @click="selectedSkill = null"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm"
      >
        <div
          @click.stop
          class="bg-white dark:bg-custom-slate-800 rounded-xl shadow-2xl max-w-md w-full p-6 border border-gray-200 dark:border-custom-slate-600"
        >
          <!-- Modal Header -->
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center">
              <div 
                v-if="selectedSkill.icon"
                class="w-10 h-10 mr-3 flex items-center justify-center rounded-full bg-custom-blue-100 dark:bg-custom-blue-800/20"
              >
                <img 
                  v-if="isImageUrl(selectedSkill.icon)"
                  :src="selectedSkill.icon" 
                  :alt="selectedSkill.name"
                  class="w-7 h-7 object-contain"
                />
                <span 
                  v-else
                  class="text-custom-blue-800 dark:text-custom-blue-400 font-mono"
                >
                  {{ selectedSkill.icon }}
                </span>
              </div>
              <h3 class="text-xl font-bold text-gray-900 dark:text-white">
                {{ selectedSkill.name }}
              </h3>
            </div>
            <button
              @click="selectedSkill = null"
              class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
            >
              <XMarkIcon class="h-6 w-6" />
            </button>
          </div>

          <!-- Modal Content -->
          <div class="space-y-4">
            <!-- Category -->
            <div>
              <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Category:</span>
              <span class="ml-2 text-sm text-gray-900 dark:text-white capitalize">
                {{ formatCategoryName(selectedSkill.category) }}
              </span>
            </div>

            <!-- Proficiency -->
            <div>
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Proficiency Level
                </span>
                <span class="text-sm font-bold text-custom-blue-800 dark:text-custom-blue-400">
                  {{ selectedSkill.proficiency }}/10
                </span>
              </div>
              <div class="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3">
                <div 
                  class="bg-gradient-to-r from-custom-blue-800 to-custom-blue-900 h-3 rounded-full transition-all duration-500 ease-out"
                  :style="{ width: `${selectedSkill.proficiency * 10}%` }"
                ></div>
              </div>
              <div class="mt-1 text-center">
                <span 
                  :class="getProficiencyBadgeClass(selectedSkill.proficiency)"
                  class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                >
                  {{ getProficiencyLevel(selectedSkill.proficiency) }}
                </span>
              </div>
            </div>

            <!-- Description -->
            <div v-if="selectedSkill.description">
              <span class="text-sm font-medium text-gray-600 dark:text-gray-400 block mb-2">
                Description:
              </span>
              <p class="text-sm text-gray-900 dark:text-white leading-relaxed">
                {{ selectedSkill.description }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { CodeBracketIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import { useAboutStore } from '~/stores/about.store'
import { capitalizeWords } from '~/utils/format.util'

const aboutStore = useAboutStore()
const selectedSkill = ref(null)

const formatCategoryName = (category) => {
  return capitalizeWords(category.replace(/-/g, ' ').replace(/_/g, ' '))
}

const isImageUrl = (icon) => {
  return icon && (icon.startsWith('http') || icon.startsWith('/') || icon.includes('.'))
}

const handleIconError = (event) => {
  event.target.style.display = 'none'
}

const getProficiencyLevel = (proficiency) => {
  if (proficiency >= 9) return 'Expert'
  if (proficiency >= 7) return 'Advanced'
  if (proficiency >= 5) return 'Intermediate'
  if (proficiency >= 3) return 'Beginner'
  return 'Learning'
}

const getProficiencyBadgeClass = (proficiency) => {
  if (proficiency >= 9) return 'bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400'
  if (proficiency >= 7) return 'bg-blue-100 text-blue-800 dark:bg-blue-800/20 dark:text-blue-400'
  if (proficiency >= 5) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800/20 dark:text-yellow-400'
  if (proficiency >= 3) return 'bg-orange-100 text-orange-800 dark:bg-orange-800/20 dark:text-orange-400'
  return 'bg-gray-100 text-gray-800 dark:bg-gray-800/20 dark:text-gray-400'
}

const selectSkill = (skill) => {
  selectedSkill.value = skill
}

onMounted(() => {
  if (!aboutStore.hasSkills) {
    aboutStore.fetchSkills()
  }
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>