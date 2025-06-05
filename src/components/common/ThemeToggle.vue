<template>
  <button
    @click="toggleTheme"
    class="relative p-2 rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-custom-blue-800 focus:ring-opacity-50"
    :title="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
  >
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="scale-0 rotate-90 opacity-0"
      enter-to-class="scale-100 rotate-0 opacity-100"
      leave-active-class="transition-all duration-150 ease-in"
      leave-from-class="scale-100 rotate-0 opacity-100"
      leave-to-class="scale-0 -rotate-90 opacity-0"
      mode="out-in"
    >
      <SunIcon
        v-if="isDark"
        key="sun"
        class="w-5 h-5 text-yellow-500"
      />
      <MoonIcon
        v-else
        key="moon"
        class="w-5 h-5 text-blue-600 dark:text-blue-400"
      />
    </Transition>
  </button>
</template>

<script setup>
import { SunIcon, MoonIcon } from '@heroicons/vue/24/outline'

const { isDark, toggleTheme } = useTheme()
</script>