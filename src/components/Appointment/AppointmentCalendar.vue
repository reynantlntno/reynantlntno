<template>
  <div class="appointment-calendar">
    <div class="flex justify-between items-center mb-4">
      <button 
        @click="prevMonth" 
        class="p-2 rounded-md text-dark-muted dark:text-light-muted hover:bg-light-muted dark:hover:bg-dark-muted"
        aria-label="Previous month"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <h3 class="text-lg font-medium">{{ currentMonthName }}</h3>
      
      <button 
        @click="nextMonth" 
        class="p-2 rounded-md text-dark-muted dark:text-light-muted hover:bg-light-muted dark:hover:bg-dark-muted"
        aria-label="Next month"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
    
    <!-- Calendar -->
    <div class="grid grid-cols-7 gap-1">
      <!-- Day names -->
      <div 
        v-for="day in ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']" 
        :key="day"
        class="text-center text-sm py-2 font-medium"
      >
        {{ day }}
      </div>
      
      <!-- Empty cells for days before start of month -->
      <div 
        v-for="_ in startingDayOfWeek" 
        :key="`empty-${_}`"
        class="h-10 rounded-md"
      ></div>
      
      <!-- Days in month -->
      <button
        v-for="day in daysInMonth"
        :key="`day-${day}`"
        type="button"
        class="h-10 rounded-md flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary"
        :class="getDayClasses(day)"
        :disabled="!isDayAvailable(day)"
        @click="selectDate(day)"
      >
        {{ day }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { format, getDaysInMonth, startOfMonth, getDay, addMonths, subMonths, isSameDay } from 'date-fns';

const props = defineProps({
  availableDates: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['date-selected']);

const currentMonth = ref(new Date());
const selectedDate = ref(null);

const currentMonthName = computed(() => {
  return format(currentMonth.value, 'MMMM yyyy');
});

const daysInMonth = computed(() => {
  return getDaysInMonth(currentMonth.value);
});

const startingDayOfWeek = computed(() => {
  return getDay(startOfMonth(currentMonth.value));
});

const nextMonth = () => {
  currentMonth.value = addMonths(currentMonth.value, 1);
};

const prevMonth = () => {
  currentMonth.value = subMonths(currentMonth.value, 1);
};

const createDateForDay = (day) => {
  const date = new Date(currentMonth.value);
  date.setDate(day);
  return date;
};

const isDayAvailable = (day) => {
  const date = createDateForDay(day);
  
  // Don't allow selecting days in the past
  if (date < new Date()) {
    return false;
  }
  
  // Check if the day is available based on the availableDates prop
  return props.availableDates.some(availableDate => {
    const availableDateTime = new Date(availableDate.date);
    return (
      date.getDate() === availableDateTime.getDate() &&
      date.getMonth() === availableDateTime.getMonth() &&
      date.getFullYear() === availableDateTime.getFullYear() &&
      availableDate.status !== 'full'
    );
  });
};

const getDayClasses = (day) => {
  const date = createDateForDay(day);
  const isToday = isSameDay(date, new Date());
  const isSelected = selectedDate.value && isSameDay(date, selectedDate.value);
  const available = isDayAvailable(day);
  
  // Check if the day is in the past
  const isPast = date < new Date();
  
  let classes = [];
  
  if (isSelected) {
    classes.push('bg-primary text-white');
  } else if (isToday) {
    classes.push('border border-primary text-primary dark:text-primary-light');
  } else if (available) {
    classes.push('bg-light-muted dark:bg-dark-muted hover:bg-primary/20 dark:hover:bg-primary/20');
  } else {
    classes.push('text-gray-400 dark:text-gray-600 cursor-not-allowed');
  }
  
  // Add past day styling
  if (isPast) {
    classes.push('opacity-50 cursor-not-allowed');
  }
  
  return classes.join(' ');
};

const selectDate = (day) => {
  if (!isDayAvailable(day)) return;
  
  const date = createDateForDay(day);
  selectedDate.value = date;
  emit('date-selected', date);
};
</script>

<style scoped>
.appointment-calendar {
  max-width: 100%;
}
</style>