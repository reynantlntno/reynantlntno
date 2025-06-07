<template>
  <div v-if="totalPages > 1" class="ide-panel">
    <!-- Terminal Header -->
    <div class="ide-panel-header">
      <div class="flex items-center space-x-2">
        <div class="terminal-controls">
          <div class="terminal-control close"></div>
          <div class="terminal-control minimize"></div>
          <div class="terminal-control maximize"></div>
        </div>
        <div class="ide-panel-title">pagination.js</div>
      </div>
      <div class="flex items-center space-x-2">
        <div class="w-2 h-2 bg-syntax-success rounded-full"></div>
        <span class="text-xs font-mono text-carbon-400">{{ totalItems }} items</span>
      </div>
    </div>

    <!-- Mobile pagination -->
    <div class="flex flex-1 justify-between items-center sm:hidden p-4">
      <button
        @click="goToPrevious"
        :disabled="!hasPrev"
        :class="[
          'relative inline-flex items-center px-3 py-2 text-sm font-mono rounded-ide transition-all duration-200',
          'border focus:outline-none focus:ring-2 focus:ring-accent-500/50',
          hasPrev
            ? 'text-carbon-100 bg-carbon-800 hover:bg-carbon-700 border-carbon-600/50 hover:border-carbon-500/50'
            : 'text-carbon-500 bg-carbon-900/50 border-carbon-700/30 cursor-not-allowed'
        ]"
      >
        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        prev
      </button>
      
      <div class="flex items-center space-x-2 text-sm font-mono text-carbon-300">
        <span class="text-syntax-comment">//</span>
        <span class="text-syntax-keyword">page</span>
        <span class="text-accent-400">{{ currentPage }}</span>
        <span class="text-carbon-500">/</span>
        <span class="text-accent-400">{{ totalPages }}</span>
      </div>
      
      <button
        @click="goToNext"
        :disabled="!hasNext"
        :class="[
          'relative inline-flex items-center px-3 py-2 text-sm font-mono rounded-ide transition-all duration-200',
          'border focus:outline-none focus:ring-2 focus:ring-accent-500/50',
          hasNext
            ? 'text-carbon-100 bg-carbon-800 hover:bg-carbon-700 border-carbon-600/50 hover:border-carbon-500/50'
            : 'text-carbon-500 bg-carbon-900/50 border-carbon-700/30 cursor-not-allowed'
        ]"
      >
        next
        <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>

    <!-- Desktop pagination -->
    <div class="hidden sm:block p-4">
      <div class="flex items-center justify-between mb-4">
        <!-- Code-style info -->
        <div class="text-sm font-mono text-carbon-300">
          <span class="text-syntax-comment">// </span>
          <span class="text-syntax-keyword">showing</span>
          <span class="text-accent-400 mx-1">{{ itemsStart }}</span>
          <span class="text-carbon-500">to</span>
          <span class="text-accent-400 mx-1">{{ itemsEnd }}</span>
          <span class="text-carbon-500">of</span>
          <span class="text-accent-400 mx-1">{{ totalItems }}</span>
          <span class="text-syntax-keyword">results</span>
        </div>

        <!-- Page indicator -->
        <div class="flex items-center space-x-2 text-xs font-mono">
          <span class="text-carbon-500">current:</span>
          <span class="px-2 py-1 bg-accent-500/20 text-accent-400 rounded border border-accent-500/30">
            {{ currentPage }}
          </span>
        </div>
      </div>
      
      <!-- Navigation -->
      <nav class="flex items-center space-x-1" aria-label="Pagination">
        <!-- Previous button -->
        <button
          @click="goToPrevious"
          :disabled="!hasPrev"
          :class="[
            'relative inline-flex items-center px-3 py-2 rounded-ide border transition-all duration-200',
            'text-sm font-mono focus:outline-none focus:ring-2 focus:ring-accent-500/50',
            hasPrev
              ? 'text-carbon-100 bg-carbon-800 hover:bg-carbon-700 border-carbon-600/50 hover:border-carbon-500/50 hover:shadow-ide'
              : 'text-carbon-500 bg-carbon-900/50 border-carbon-700/30 cursor-not-allowed'
          ]"
        >
          <svg class="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          <span class="hidden md:inline">prev</span>
        </button>

        <!-- Page numbers -->
        <div class="flex items-center space-x-1">
          <template v-for="(page, index) in displayedPages" :key="`page-${index}`">
            <button
              v-if="typeof page === 'number'"
              @click="goToPage(page)"
              :class="[
                'relative inline-flex items-center justify-center w-10 h-10 text-sm font-mono rounded-ide border transition-all duration-200',
                'focus:outline-none focus:ring-2 focus:ring-accent-500/50',
                page === currentPage
                  ? 'bg-accent-600 text-white border-accent-500 shadow-glow-accent hover:bg-accent-700'
                  : 'text-carbon-300 bg-carbon-800 hover:bg-carbon-700 border-carbon-600/50 hover:border-carbon-500/50 hover:text-carbon-100'
              ]"
            >
              {{ page }}
            </button>
            <span
              v-else
              class="relative inline-flex items-center justify-center w-10 h-10 text-sm font-mono text-carbon-500"
            >
              <span class="text-syntax-comment">...</span>
            </span>
          </template>
        </div>

        <!-- Next button -->
        <button
          @click="goToNext"
          :disabled="!hasNext"
          :class="[
            'relative inline-flex items-center px-3 py-2 rounded-ide border transition-all duration-200',
            'text-sm font-mono focus:outline-none focus:ring-2 focus:ring-accent-500/50',
            hasNext
              ? 'text-carbon-100 bg-carbon-800 hover:bg-carbon-700 border-carbon-600/50 hover:border-carbon-500/50 hover:shadow-ide'
              : 'text-carbon-500 bg-carbon-900/50 border-carbon-700/30 cursor-not-allowed'
          ]"
        >
          <span class="hidden md:inline">next</span>
          <svg class="h-4 w-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </nav>

      <!-- Terminal-style command hint -->
      <div class="mt-4 pt-3 border-t border-carbon-700/30">
        <div class="flex items-center space-x-2 text-xs font-mono text-carbon-500">
          <span class="text-syntax-comment">$</span>
          <span>goto --page {{ currentPage }} --total {{ totalPages }}</span>
          <div class="flex-1"></div>
          <kbd class="px-1 py-0.5 bg-carbon-800 text-carbon-300 rounded text-xs">← →</kbd>
          <span>navigate</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  currentPage: {
    type: Number,
    required: true
  },
  totalPages: {
    type: Number,
    required: true
  },
  totalItems: {
    type: Number,
    required: true
  },
  itemsPerPage: {
    type: Number,
    default: 10
  },
  hasNext: {
    type: Boolean,
    default: false
  },
  hasPrev: {
    type: Boolean,
    default: false
  },
  maxVisiblePages: {
    type: Number,
    default: 7
  }
})

const emit = defineEmits(['page-changed'])

// Computed properties
const itemsStart = computed(() => {
  return (props.currentPage - 1) * props.itemsPerPage + 1
})

const itemsEnd = computed(() => {
  return Math.min(props.currentPage * props.itemsPerPage, props.totalItems)
})

const displayedPages = computed(() => {
  const pages = []
  const { currentPage, totalPages, maxVisiblePages } = props
  
  if (totalPages <= maxVisiblePages) {
    // Show all pages if total is less than max visible
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i)
    }
  } else {
    // Calculate start and end page numbers
    let start = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    let end = Math.min(totalPages, start + maxVisiblePages - 1)
    
    // Adjust start if end is at the limit
    if (end === totalPages) {
      start = Math.max(1, end - maxVisiblePages + 1)
    }
    
    // Add first page and ellipsis if needed
    if (start > 1) {
      pages.push(1)
      if (start > 2) {
        pages.push('...')
      }
    }
    
    // Add page numbers
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

// Methods
const goToPage = (page) => {
  if (page !== props.currentPage && page >= 1 && page <= props.totalPages) {
    emit('page-changed', page)
  }
}

const goToPrevious = () => {
  if (props.hasPrev) {
    goToPage(props.currentPage - 1)
  }
}

const goToNext = () => {
  if (props.hasNext) {
    goToPage(props.currentPage + 1)
  }
}

// Keyboard navigation
const handleKeydown = (event) => {
  if (event.key === 'ArrowLeft' && props.hasPrev) {
    goToPrevious()
  } else if (event.key === 'ArrowRight' && props.hasNext) {
    goToNext()
  }
}

// Add keyboard listeners
onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>