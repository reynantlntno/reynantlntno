<template>
  <div class="bg-carbon-800/50 rounded-ide border border-carbon-700/50 overflow-hidden">
    <!-- Calendar Header -->
    <div class="flex items-center justify-between px-4 py-2 bg-carbon-800 border-b border-carbon-700">
      <div class="flex items-center space-x-2">
        <span class="text-syntax-comment font-mono text-xs">1</span>
        <span class="text-syntax-comment font-mono text-xs">/* Date Selector */</span>
      </div>
      <div class="flex items-center space-x-2">
        <div class="w-2 h-2 bg-syntax-success rounded-full animate-pulse"></div>
        <span class="text-xs font-mono text-carbon-400">calendar</span>
      </div>
    </div>

    <div class="p-6">
      <!-- Month Navigation -->
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-lg font-semibold text-carbon-100 font-mono">
          <span class="text-syntax-function">selectDate</span>
          <span class="text-carbon-300">()</span>
        </h3>
        
        <div class="flex items-center space-x-2">
          <button
            @click="previousMonth"
            :disabled="!canGoPrevious"
            :class="[
              'p-2 rounded border font-mono text-sm transition-all duration-200',
              canGoPrevious
                ? 'bg-carbon-700/50 border-carbon-600/50 text-carbon-300 hover:bg-carbon-600/50 hover:border-accent-500/50'
                : 'bg-carbon-800/50 border-carbon-700/50 text-carbon-600 cursor-not-allowed'
            ]"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <div class="bg-carbon-700/50 border border-carbon-600/50 rounded px-4 py-2 min-w-[140px] text-center">
            <span class="text-carbon-100 font-medium font-mono text-sm">
              {{ currentMonthYear }}
            </span>
          </div>
          
          <button
            @click="nextMonth"
            :disabled="!canGoNext"
            :class="[
              'p-2 rounded border font-mono text-sm transition-all duration-200',
              canGoNext
                ? 'bg-carbon-700/50 border-carbon-600/50 text-carbon-300 hover:bg-carbon-600/50 hover:border-accent-500/50'
                : 'bg-carbon-800/50 border-carbon-700/50 text-carbon-600 cursor-not-allowed'
            ]"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Calendar Grid -->
      <div class="bg-carbon-900/50 rounded-ide border border-carbon-700/50 overflow-hidden">
        <!-- Calendar Header -->
        <div class="flex items-center px-3 py-2 bg-carbon-900 border-b border-carbon-700/50">
          <span class="text-syntax-comment font-mono text-xs mr-2">$</span>
          <span class="text-carbon-300 font-mono text-xs">calendar --month {{ currentMonthYear.toLowerCase().replace(' ', '-') }}</span>
        </div>

        <div class="p-4">
          <div class="grid grid-cols-7 gap-1">
            <!-- Day Headers -->
            <div
              v-for="day in dayHeaders"
              :key="day"
              class="p-3 text-center text-xs font-medium text-carbon-400 font-mono"
            >
              {{ day }}
            </div>

            <!-- Calendar Days -->
            <button
              v-for="date in calendarDays"
              :key="date.key"
              @click="selectDate(date)"
              :disabled="!date.isSelectable"
              :class="[
                'p-3 text-sm rounded border transition-all duration-200 relative font-mono group',
                {
                  // Current month days - selectable
                  'bg-carbon-700/50 border-carbon-600/50 text-carbon-300 hover:bg-carbon-600/50 hover:border-accent-500/50': 
                    date.isCurrentMonth && date.isSelectable,
                  
                  // Current month days - not selectable
                  'bg-carbon-800/50 border-carbon-700/50 text-carbon-600 cursor-not-allowed': 
                    date.isCurrentMonth && !date.isSelectable,
                  
                  // Other month days
                  'bg-carbon-900/50 border-carbon-800/50 text-carbon-700 cursor-not-allowed': 
                    !date.isCurrentMonth,
                  
                  // Selected date
                  'bg-accent-500 border-accent-400 text-white shadow-glow-accent': 
                    date.isSelected,
                  
                  // Today
                  'ring-2 ring-accent-400/50': 
                    date.isToday && !date.isSelected,
                }
              ]"
            >
              <span class="relative z-10">{{ date.day }}</span>
              
              <!-- Available slots indicator -->
              <div
                v-if="date.hasSlots && date.isCurrentMonth && date.isSelectable"
                class="absolute bottom-1 right-1 w-1 h-1 bg-syntax-success rounded-full"
                :class="{
                  'bg-white': date.isSelected,
                  'bg-syntax-success': !date.isSelected
                }"
              ></div>
              
              <!-- Today indicator -->
              <div
                v-if="date.isToday && !date.isSelected"
                class="absolute top-1 left-1 w-1 h-1 bg-accent-400 rounded-full"
              ></div>
            </button>
          </div>
        </div>
      </div>

      <!-- Legend -->
      <div class="mt-6 bg-carbon-900/50 rounded-ide border border-carbon-700/50 p-4">
        <div class="flex items-center justify-between px-3 py-2 bg-carbon-900 border-b border-carbon-700/50 mb-4 -mx-4 -mt-4">
          <span class="text-syntax-function font-mono text-sm text-carbon-200">calendar.legend</span>
        </div>
        
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
          <div class="flex items-center space-x-2">
            <div class="w-3 h-3 bg-accent-500 rounded border border-accent-400"></div>
            <span class="text-carbon-400">selected</span>
          </div>
          <div class="flex items-center space-x-2">
            <div class="w-3 h-3 bg-carbon-700 rounded border-2 border-accent-400"></div>
            <span class="text-carbon-400">today</span>
          </div>
          <div class="flex items-center space-x-2">
            <div class="w-3 h-3 bg-carbon-700 rounded border border-carbon-600 relative">
              <div class="absolute bottom-0 right-0 w-1 h-1 bg-syntax-success rounded-full"></div>
            </div>
            <span class="text-carbon-400">available</span>
          </div>
          <div class="flex items-center space-x-2">
            <div class="w-3 h-3 bg-carbon-800 rounded border border-carbon-700"></div>
            <span class="text-carbon-400">unavailable</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { formatDateForInput, getDayOfWeek, isToday, isFutureDate } from '@/utils/date.util'

const props = defineProps({
  selectedDate: {
    type: String,
    default: null
  },
  availableDates: {
    type: Array,
    default: () => []
  },
  minDate: {
    type: Date,
    default: () => new Date()
  },
  maxDate: {
    type: Date,
    default: () => {
      const date = new Date()
      date.setDate(date.getDate() + 60) // 60 days from now
      return date
    }
  }
})

const emit = defineEmits(['date-selected', 'month-changed'])

// State
const currentDate = ref(new Date())
const currentMonth = ref(new Date().getMonth())
const currentYear = ref(new Date().getFullYear())

// Helper function to create Philippines timezone date
const createPhilippinesDate = (year, month, day = 1) => {
  // Create date in Philippines timezone (UTC+8)
  const date = new Date()
  date.setFullYear(year, month, day)
  // Adjust for Philippines timezone
  const offset = date.getTimezoneOffset()
  const philippinesOffset = -480 // UTC+8 in minutes
  return new Date(date.getTime() + (offset + philippinesOffset) * 60000)
}

// Helper function to format date consistently
const formatDateConsistent = (date) => {
  if (!date) return null
  
  // Ensure we're working with Philippines timezone
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  
  return `${year}-${month}-${day}`
}

// Computed
const dayHeaders = computed(() => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'])

const currentMonthYear = computed(() => {
  const date = new Date(currentYear.value, currentMonth.value)
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
})

const calendarDays = computed(() => {
  const days = []
  const firstDay = new Date(currentYear.value, currentMonth.value, 1)
  const lastDay = new Date(currentYear.value, currentMonth.value + 1, 0)
  const startDate = new Date(firstDay)
  startDate.setDate(startDate.getDate() - firstDay.getDay())

  console.log('Calendar Debug:', {
    currentMonth: currentMonth.value,
    currentYear: currentYear.value,
    availableDates: props.availableDates.slice(0, 5),
    firstDay: firstDay.toISOString(),
    lastDay: lastDay.toISOString()
  })

  // Generate 42 days (6 weeks)
  for (let i = 0; i < 42; i++) {
    const date = new Date(startDate)
    date.setDate(startDate.getDate() + i)
    
    const dateString = formatDateConsistent(date)
    const isCurrentMonth = date.getMonth() === currentMonth.value
    const isSelectable = isCurrentMonth && 
                        isFutureDate(date) && 
                        date >= props.minDate && 
                        date <= props.maxDate
    
    const hasSlots = props.availableDates.includes(dateString)
    
    console.log(`Date ${dateString}:`, {
      isCurrentMonth,
      isSelectable,
      hasSlots,
      inAvailableDates: props.availableDates.includes(dateString)
    })
    
    days.push({
      key: `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`,
      date: date,
      day: date.getDate(),
      dateString: dateString,
      isCurrentMonth: isCurrentMonth,
      isToday: isToday(date),
      isSelected: props.selectedDate === dateString,
      isSelectable: isSelectable,
      hasSlots: hasSlots
    })
  }

  return days
})

const canGoPrevious = computed(() => {
  const prevMonth = new Date(currentYear.value, currentMonth.value - 1, 1)
  const minMonth = new Date(props.minDate.getFullYear(), props.minDate.getMonth(), 1)
  return prevMonth >= minMonth
})

const canGoNext = computed(() => {
  const nextMonth = new Date(currentYear.value, currentMonth.value + 1, 1)
  const maxMonth = new Date(props.maxDate.getFullYear(), props.maxDate.getMonth(), 1)
  return nextMonth <= maxMonth
})

// Methods
const selectDate = (dateObj) => {
  if (!dateObj.isSelectable) return
  console.log('Date selected:', dateObj.dateString)
  emit('date-selected', dateObj.dateString)
}

const previousMonth = () => {
  if (!canGoPrevious.value) return
  
  if (currentMonth.value === 0) {
    currentMonth.value = 11
    currentYear.value--
  } else {
    currentMonth.value--
  }
  
  emit('month-changed', currentYear.value, currentMonth.value)
}

const nextMonth = () => {
  if (!canGoNext.value) return
  
  if (currentMonth.value === 11) {
    currentMonth.value = 0
    currentYear.value++
  } else {
    currentMonth.value++
  }
  
  emit('month-changed', currentYear.value, currentMonth.value)
}

// Initialize calendar to selected date or current date
watch(() => props.selectedDate, (newDate) => {
  if (newDate) {
    const date = new Date(newDate + 'T00:00:00+08:00') // Force Philippines timezone
    currentMonth.value = date.getMonth()
    currentYear.value = date.getFullYear()
  }
}, { immediate: true })

watch(() => props.availableDates, (newDates) => {
  console.log('Available dates updated:', newDates?.slice(0, 10))
}, { deep: true })

onMounted(() => {
  // Always start with current month on first load
  const now = new Date()
  currentMonth.value = now.getMonth()
  currentYear.value = now.getFullYear()
  emit('month-changed', currentYear.value, currentMonth.value)
})
</script>

<style scoped>
/* Enhanced focus states for calendar navigation */
button:focus-visible {
  outline: 2px solid rgba(0, 122, 204, 0.5);
  outline-offset: 2px;
}

/* Calendar day hover effects */
.calendar-day:hover .day-indicator {
  transform: scale(1.1);
}

/* Smooth transitions for all interactive elements */
button,
.calendar-day {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Custom glow effect for selected date */
.shadow-glow-accent {
  box-shadow: 0 0 0 2px rgba(0, 122, 204, 0.2), 0 0 20px rgba(0, 122, 204, 0.3);
}

/* Enhanced grid layout for mobile */
@media (max-width: 640px) {
  .grid-cols-7 {
    gap: 0.125rem;
  }
  
  .p-3 {
    padding: 0.5rem;
  }
}

/* Animation for month changes */
.month-transition {
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  0% {
    opacity: 0;
    transform: translateX(20px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Accessibility improvements */
@media (prefers-reduced-motion: reduce) {
  * {
    animation: none !important;
    transition: none !important;
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .border-carbon-600\/50 {
    border-color: rgba(255, 255, 255, 0.3);
  }
  
  .text-carbon-300 {
    color: #ffffff;
  }
}
</style>