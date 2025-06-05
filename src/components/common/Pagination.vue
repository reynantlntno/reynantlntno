<template>
  <nav v-if="totalPages > 1" class="flex items-center justify-between">
    <!-- Mobile pagination -->
    <div class="flex-1 flex justify-between sm:hidden">
      <BaseButton
        v-if="hasPrev"
        @click="goToPage(currentPage - 1)"
        variant="secondary"
        size="sm"
      >
        Previous
      </BaseButton>
      <BaseButton
        v-if="hasNext"
        @click="goToPage(currentPage + 1)"
        variant="secondary"
        size="sm"
      >
        Next
      </BaseButton>
    </div>

    <!-- Desktop pagination -->
    <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
      <div>
        <p class="text-sm text-gray-700 dark:text-gray-300">
          Showing
          <span class="font-medium">{{ startItem }}</span>
          to
          <span class="font-medium">{{ endItem }}</span>
          of
          <span class="font-medium">{{ total }}</span>
          results
        </p>
      </div>
      
      <div>
        <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
          <!-- Previous button -->
          <button
            @click="goToPage(currentPage - 1)"
            :disabled="!hasPrev"
            class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-custom-slate-600 bg-white dark:bg-custom-slate-700 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-custom-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeftIcon class="h-5 w-5" />
            <span class="sr-only">Previous</span>
          </button>

          <!-- Page numbers -->
          <template v-for="page in visiblePages" :key="page">
            <button
              v-if="page !== '...'"
              @click="goToPage(page)"
              :class="[
                'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
                page === currentPage
                  ? 'z-10 bg-custom-blue-800 border-custom-blue-800 text-white'
                  : 'bg-white dark:bg-custom-slate-700 border-gray-300 dark:border-custom-slate-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-custom-slate-600'
              ]"
            >
              {{ page }}
            </button>
            <span
              v-else
              class="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-custom-slate-600 bg-white dark:bg-custom-slate-700 text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              ...
            </span>
          </template>

          <!-- Next button -->
          <button
            @click="goToPage(currentPage + 1)"
            :disabled="!hasNext"
            class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-custom-slate-600 bg-white dark:bg-custom-slate-700 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-custom-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRightIcon class="h-5 w-5" />
            <span class="sr-only">Next</span>
          </button>
        </nav>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  currentPage: {
    type: Number,
    required: true
  },
  totalPages: {
    type: Number,
    required: true
  },
  total: {
    type: Number,
    required: true
  },
  perPage: {
    type: Number,
    required: true
  },
  maxVisible: {
    type: Number,
    default: 5
  }
})

const emit = defineEmits(['page-change'])

const hasPrev = computed(() => props.currentPage > 1)
const hasNext = computed(() => props.currentPage < props.totalPages)

const startItem = computed(() => {
  return (props.currentPage - 1) * props.perPage + 1
})

const endItem = computed(() => {
  return Math.min(props.currentPage * props.perPage, props.total)
})

const visiblePages = computed(() => {
  const pages = []
  const { currentPage, totalPages, maxVisible } = props

  if (totalPages <= maxVisible) {
    // Show all pages if total is less than max visible
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i)
    }
  } else {
    // Calculate range around current page
    const half = Math.floor(maxVisible / 2)
    let start = Math.max(1, currentPage - half)
    let end = Math.min(totalPages, start + maxVisible - 1)

    // Adjust start if we're near the end
    if (end === totalPages) {
      start = Math.max(1, end - maxVisible + 1)
    }

    // Add first page and ellipsis if needed
    if (start > 1) {
      pages.push(1)
      if (start > 2) {
        pages.push('...')
      }
    }

    // Add visible pages
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    // Add ellipsis and last page if needed
    if (end < totalPages) {
      if (end < totalPages - 1) {
        pages.push('...')
      }
      pages.push(totalPages)
    }
  }

  return pages
})

const goToPage = (page) => {
  if (page >= 1 && page <= props.totalPages && page !== props.currentPage) {
    emit('page-change', page)
  }
}
</script>