import { defineStore } from 'pinia'

export const useAppointmentsStore = defineStore('appointments', {
  state: () => ({
    slots: [],
    appointments: [],
    currentAppointment: null,
    selectedDate: null,
    selectedSlot: null,
    loading: false,
    error: null,
    calendar: {
      currentMonth: new Date().getMonth(),
      currentYear: new Date().getFullYear(),
      selectedDate: null
    }
  }),

  getters: {
    availableSlots: (state) => 
      state.slots.filter(slot => slot.is_active && slot.available),
    
    slotsByDate: (state) => (date) => {
      return state.slots.filter(slot => {
        if (slot.specific_date) {
          return slot.specific_date === date
        }
        if (slot.recurring) {
          const targetDay = new Date(date).getDay()
          return slot.day_of_week === targetDay
        }
        return false
      })
    },
    
    appointmentsByStatus: (state) => (status) =>
      state.appointments.filter(appointment => appointment.status === status),
    
    hasAvailableSlots: (state) => (date) => {
      const slots = state.slots.filter(slot => {
        if (slot.specific_date) {
          return slot.specific_date === date && slot.is_active && slot.available
        }
        if (slot.recurring) {
          const targetDay = new Date(date).getDay()
          return slot.day_of_week === targetDay && slot.is_active && slot.available
        }
        return false
      })
      return slots.length > 0
    },
    
    selectedDateSlots: (state) => {
      if (!state.selectedDate) return []
      return state.slots.filter(slot => {
        if (slot.specific_date) {
          return slot.specific_date === state.selectedDate
        }
        if (slot.recurring) {
          const targetDay = new Date(state.selectedDate).getDay()
          return slot.day_of_week === targetDay
        }
        return false
      }).filter(slot => slot.is_active && slot.available)
    }
  },

  actions: {
    async fetchSlots(params = {}) {
      this.loading = true
      this.error = null
      
      try {
        const { $appointmentsApi } = useNuxtApp()
        const response = await $appointmentsApi.getSlots(params)
        
        if (response.success) {
          this.slots = response.data
        } else {
          this.error = response.error
        }
      } catch (error) {
        this.error = error.message
        console.error('Error fetching slots:', error)
      } finally {
        this.loading = false
      }
    },

    async fetchSlotsByDateRange(startDate, endDate) {
      await this.fetchSlots({ 
        start_date: startDate, 
        end_date: endDate 
      })
    },

    async bookAppointment(appointmentData) {
      this.loading = true
      this.error = null
      
      try {
        const { $appointmentsApi } = useNuxtApp()
        const response = await $appointmentsApi.createAppointment(appointmentData)
        
        if (response.success) {
          // Update the slot availability
          const slotIndex = this.slots.findIndex(slot => slot.id === appointmentData.slot_id)
          if (slotIndex !== -1) {
            this.slots[slotIndex].booked_count = (this.slots[slotIndex].booked_count || 0) + 1
            this.slots[slotIndex].available = this.slots[slotIndex].booked_count < this.slots[slotIndex].capacity
          }
          
          return response.data
        } else {
          this.error = response.error
          return null
        }
      } catch (error) {
        this.error = error.message
        console.error('Error booking appointment:', error)
        return null
      } finally {
        this.loading = false
      }
    },

    async fetchAppointmentByReference(referenceCode) {
      this.loading = true
      this.error = null
      
      try {
        const { $appointmentsApi } = useNuxtApp()
        const response = await $appointmentsApi.getAppointmentByReference(referenceCode)
        
        if (response.success) {
          this.currentAppointment = response.data
          return response.data
        } else {
          this.error = response.error
          return null
        }
      } catch (error) {
        this.error = error.message
        console.error('Error fetching appointment:', error)
        return null
      } finally {
        this.loading = false
      }
    },

    setSelectedDate(date) {
      this.selectedDate = date
      this.selectedSlot = null
    },

    setSelectedSlot(slot) {
      this.selectedSlot = slot
    },

    clearSelection() {
      this.selectedDate = null
      this.selectedSlot = null
    },

    setCalendarMonth(month, year) {
      this.calendar.currentMonth = month
      this.calendar.currentYear = year
    },

    nextMonth() {
      if (this.calendar.currentMonth === 11) {
        this.calendar.currentMonth = 0
        this.calendar.currentYear += 1
      } else {
        this.calendar.currentMonth += 1
      }
    },

    previousMonth() {
      if (this.calendar.currentMonth === 0) {
        this.calendar.currentMonth = 11
        this.calendar.currentYear -= 1
      } else {
        this.calendar.currentMonth -= 1
      }
    },

    clearCurrentAppointment() {
      this.currentAppointment = null
    },

    clearError() {
      this.error = null
    }
  }
})