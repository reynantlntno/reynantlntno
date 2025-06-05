<template>
  <div class="bg-white dark:bg-custom-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-custom-slate-600 overflow-hidden">
    <!-- Calendar Header -->
    <div class="bg-custom-blue-800 text-white p-4">
      <div class="flex items-center justify-between">
        <button
          @click="previousMonth"
          class="p-2 hover:bg-custom-blue-700 rounded-lg transition-colors duration-200"
          :disabled="!canNavigatePrevious"
        >
          <ChevronLeftIcon class="h-5 w-5" />
        </button>

        <h2 class="text-xl font-bold">
          {{ currentMonthName }} {{ appointmentsStore.calendar.currentYear }}
        </h2>

        <button
          @click="nextMonth"
          class="p-2 hover:bg-custom-blue-700 rounded-lg transition-colors duration-200"
          :disabled="!canNavigateNext"
        >
          <ChevronRightIcon class="h-5 w-5" />
        </button>
      </div>
    </div>

    <!-- Days of Week Header -->
    <div class="grid grid-cols-7 border-b border-gray-200 dark:border-custom-slate-600">
      <div
        v-for="day in daysOfWeek"
        :key="day"
        class="p-3 text-center text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-custom-slate-700"
      >
        {{ day }}
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="appointmentsStore.loading" class="p-8 text-center">
      <LoadingSpinner size="lg" />
      <p class="mt-4 text-gray-600 dark:text-gray-400">Loading calendar...</p>
    </div>

    <!-- Calendar Grid -->
    <div v-else class="grid grid-cols-7">
      <div
        v-for="day in calendarDays"
        :key="`${day.date}-${day.day}`"
        :class="getDayClasses(day)"
        @click="selectDate(day)"
      >
        <!-- Day Number -->
        <div class="flex items-center justify-between mb-2">
          <span :class="getDayNumberClasses(day)">
            {{ day.day }}
          </span>
          
          <!-- Available Slots Indicator -->
          <div v-if="day.isCurrentMonth && day.hasAvailableSlots" class="flex space-x-1">
            <div 
              v-for="slot in getVisibleSlots(day)"
              :key="slot.id"
              class="w-2 h-2 rounded-full bg-green-400"
            ></div>
            <div 
              v-if="day.slots.length > 3"
              class="text-xs text-gray-500 dark:text-gray-400"
            >
              +{{ day.slots.length - 3 }}
            </div>
          </div>
        </div>

        <!-- Slots Preview -->
        <div v-if="day.isCurrentMonth && day.slots.length > 0" class="space-y-1">
          <div
            v-for="slot in getVisibleSlots(day)"
            :key="slot.id"
            :class="getSlotPreviewClasses(slot)"
          >
            <span class="text-xs font-medium">
              {{ formatTime(slot.start_time) }}
            </span>
            <span v-if="slot.available" class="text-xs text-green-600 dark:text-green-400">
              ({{ slot.capacity - (slot.booked_count || 0) }} left)
            </span>
            <span v-else class="text-xs text-red-600 dark:text-red-400">
              (Full)
            </span>
          </div>
        </div>

        <!-- No slots available -->
        <div v-else-if="day.isCurrentMonth && !day.hasAvailableSlots && day.slots.length === 0" class="text-center">
          <span class="text-xs text-gray-400 dark:text-gray-500">No slots</span>
        </div>
      </div>
    </div>

    <!-- Selected Date Details -->
    <div v-if="appointmentsStore.selectedDate" class="border-t border-gray-200 dark:border-custom-slate-600 p-4 bg-gray-50 dark:bg-custom-slate-700">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">
        Available Slots for {{ formatSelectedDate }}
      </h3>
      
      <div v-if="appointmentsStore.selectedDateSlots.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <button
          v-for="slot in appointmentsStore.selectedDateSlots"
          :key="slot.id"
          @click="selectSlot(slot)"
          :class="getSlotButtonClasses(slot)"
          :disabled="!slot.available"
        >
          <div class="flex items-center justify-between">
            <div>
              <div class="font-medium">
                {{ formatTime(slot.start_time) }} - {{ formatTime(slot.end_time) }}
              </div>
              <div class="text-sm opacity-75">
                {{ slot.capacity - (slot.booked_count || 0) }} of {{ slot.capacity }} available
              </div>
            </div>
            <div v-if="appointmentsStore.selectedSlot?.id === slot.id" class="text-green-500">
              <CheckIcon class="h-5 w-5" />
            </div>
          </div>
        </button>
      </div>
      
      <div v-else class="text-center py-6">
        <CalendarIcon class="h-12 w-12 text-gray-400 mx-auto mb-3" />
        <p class="text-gray-600 dark:text-gray-400">No available slots for this date</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-if="appointmentsStore.error" class="p-4 bg-red-50 dark:bg-red-900/20 border-t border-red-200 dark:border-red-800">
      <p class="text-red-600 dark:text-red-400 text-sm">{{ appointmentsStore.error }}</p>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, watch } from 'vue'
import { 
  ChevronLeftIcon, 
  ChevronRightIcon, 
  CalendarIcon,
  CheckIcon 
} from '@heroicons/vue/24/outline'
import { useAppointmentsStore } from '~/stores/appointments.store'
import { formatDate, formatTime, getMonthName, getDaysInMonth, addMonths } from '~/utils/dates.util'

const appointmentsStore = useAppointmentsStore()

const emit = defineEmits(['slot-selected', 'date-selected'])

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const currentMonthName = computed(() => {
  return getMonthName(appointmentsStore.calendar.currentMonth)
})

const canNavigatePrevious = computed(() => {
  const today = new Date()
  const currentCalendarDate = new Date(appointmentsStore.calendar.currentYear, appointmentsStore.calendar.currentMonth, 1)
  return currentCalendarDate > new Date(today.getFullYear(), today.getMonth(), 1)
})

const canNavigateNext = computed(() => {
  const maxDate = addMonths(new Date(), 6) // Limit to 6 months ahead
  const currentCalendarDate = new Date(appointmentsStore.calendar.currentYear, appointmentsStore.calendar.currentMonth, 1)
  return currentCalendarDate < new Date(maxDate.getFullYear(), maxDate.getMonth(), 1)
})

const calendarDays = computed(() => {
  const year = appointmentsStore.calendar.currentYear
  const month = appointmentsStore.calendar.currentMonth
  const daysInMonth = getDaysInMonth(year, month)
  const firstDay = new Date(year, month, 1).getDay()
  const today = new Date()
  
  const days = []
  
  // Previous month's trailing days
  const prevMonth = month === 0 ? 11 : month - 1
  const prevYear = month === 0 ? year - 1 : year
  const daysInPrevMonth = getDaysInMonth(prevYear, prevMonth)
  
  for (let i = firstDay - 1; i >= 0; i--) {
    const day = daysInPrevMonth - i
    const dateStr = `${prevYear}-${String(prevMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    days.push({
      day,
      date: dateStr,
      isCurrentMonth: false,
      isToday: false,
      slots: [],
      hasAvailableSlots: false
    })
  }
  
  // Current month's days
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    const isToday = today.toDateString() === new Date(year, month, day).toDateString()
    const daySlots = appointmentsStore.slotsByDate(dateStr)
    const hasAvailableSlots = appointmentsStore.hasAvailableSlots(dateStr)
    
    days.push({
      day,
      date: dateStr,
      isCurrentMonth: true,
      isToday,
      slots: daySlots,
      hasAvailableSlots
    })
  }
  
  // Next month's leading days
  const remainingDays = 42 - days.length // 6 rows × 7 days
  const nextMonth = month === 11 ? 0 : month + 1
  const nextYear = month === 11 ? year + 1 : year
  
  for (let day = 1; day <= remainingDays; day++) {
    const dateStr = `${nextYear}-${String(nextMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    days.push({
      day,
      date: dateStr,
      isCurrentMonth: false,
      isToday: false,
      slots: [],
      hasAvailableSlots: false
    })
  }
  
  return days
})

const formatSelectedDate = computed(() => {
  if (!appointmentsStore.selectedDate) return ''
  return formatDate(appointmentsStore.selectedDate, { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
})

const getDayClasses = (day) => {
  const classes = [
    'min-h-[100px] p-2 border-r border-b border-gray-200 dark:border-custom-slate-600 cursor-pointer transition-all duration-200'
  ]
  
  if (!day.isCurrentMonth) {
    classes.push('bg-gray-50 dark:bg-custom-slate-800 text-gray-400 dark:text-gray-600')
  } else {
    classes.push('bg-white dark:bg-custom-slate-700 hover:bg-gray-50 dark:hover:bg-custom-slate-600')
    
    if (day.isToday) {
      classes.push('ring-2 ring-custom-blue-800 ring-inset')
    }
    
    if (appointmentsStore.selectedDate === day.date) {
      classes.push('bg-custom-blue-50 dark:bg-custom-blue-900/20')
    }
    
    if (day.hasAvailableSlots) {
      classes.push('hover:shadow-md')
    }
  }
  
  return classes
}

const getDayNumberClasses = (day) => {
  const classes = ['text-sm font-semibold']
  
  if (day.isToday) {
    classes.push('bg-custom-blue-800 text-white rounded-full w-6 h-6 flex items-center justify-center')
  } else if (!day.isCurrentMonth) {
    classes.push('text-gray-400 dark:text-gray-600')
  } else {
    classes.push('text-gray-900 dark:text-white')
  }
  
  return classes
}

const getVisibleSlots = (day) => {
  return day.slots.slice(0, 3)
}

const getSlotPreviewClasses = (slot) => {
  const classes = ['px-2 py-1 rounded text-xs']
  
  if (slot.available) {
    classes.push('bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400')
  } else {
    classes.push('bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400')
  }
  
  return classes
}

const getSlotButtonClasses = (slot) => {
  const classes = [
    'p-3 rounded-lg border text-left transition-all duration-200 w-full'
  ]
  
  if (slot.available) {
    if (appointmentsStore.selectedSlot?.id === slot.id) {
      classes.push('bg-custom-blue-100 dark:bg-custom-blue-900/20 border-custom-blue-800 text-custom-blue-900 dark:text-custom-blue-400')
    } else {
      classes.push('bg-white dark:bg-custom-slate-800 border-gray-200 dark:border-custom-slate-600 hover:border-custom-blue-800 hover:bg-custom-blue-50 dark:hover:bg-custom-blue-900/10 text-gray-900 dark:text-white')
    }
  } else {
    classes.push('bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed')
  }
  
  return classes
}

const selectDate = (day) => {
  if (!day.isCurrentMonth) return
  
  const today = new Date()
  const selectedDate = new Date(day.date)
  
  // Don't allow selection of past dates
  if (selectedDate < today.setHours(0, 0, 0, 0)) return
  
  appointmentsStore.setSelectedDate(day.date)
  emit('date-selected', day.date)
}

const selectSlot = (slot) => {
  if (!slot.available) return
  
  appointmentsStore.setSelectedSlot(slot)
  emit('slot-selected', slot)
}

const previousMonth = () => {
  if (canNavigatePrevious.value) {
    appointmentsStore.previousMonth()
    fetchSlotsForCurrentMonth()
  }
}

const nextMonth = () => {
  if (canNavigateNext.value) {
    appointmentsStore.nextMonth()
    fetchSlotsForCurrentMonth()
  }
}

const fetchSlotsForCurrentMonth = () => {
  const year = appointmentsStore.calendar.currentYear
  const month = appointmentsStore.calendar.currentMonth
  
  const startDate = `${year}-${String(month + 1).padStart(2, '0')}-01`
  const endDate = `${year}-${String(month + 1).padStart(2, '0')}-${getDaysInMonth(year, month)}`
  
  appointmentsStore.fetchSlotsByDateRange(startDate, endDate)
}

// Watch for calendar month changes
watch(
  () => [appointmentsStore.calendar.currentMonth, appointmentsStore.calendar.currentYear],
  () => {
    fetchSlotsForCurrentMonth()
  }
)

onMounted(() => {
  fetchSlotsForCurrentMonth()
})
</script>