import { defineStore } from 'pinia'
import { appointmentsApi } from '@/api/appointments.api.js'
import { contactApi } from '@/api/contact.api.js'
import { newsletterApi } from '@/api/newsletter.api.js'

export const useAppointmentsStore = defineStore('appointments', () => {
  // State
  const availableSlots = ref([])
  const selectedDate = ref(null)
  const selectedSlot = ref(null)
  const appointmentData = ref({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  const trackedAppointment = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const successMessage = ref(null)

  // Contact form state
  const contactLoading = ref(false)
  const contactError = ref(null)
  const contactSuccess = ref(false)

  // Newsletter state
  const newsletterLoading = ref(false)
  const newsletterError = ref(null)
  const newsletterSuccess = ref(false)

  // Cache for slots
  const slotsCache = ref(new Map())
  const SLOTS_CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

  // Getters
  const hasAvailableSlots = computed(() => availableSlots.value.length > 0)
  const isSlotSelected = computed(() => selectedSlot.value !== null)
  const isFormValid = computed(() => {
    return appointmentData.value.name.trim() &&
           appointmentData.value.email.trim() &&
           appointmentData.value.subject.trim() &&
           selectedDate.value &&
           selectedSlot.value
  })

  const canBookAppointment = computed(() => {
    return isFormValid.value && !loading.value
  })

  // Utility functions
  const clearMessages = () => {
    error.value = null
    successMessage.value = null
    contactError.value = null
    newsletterError.value = null
  }

  const resetForm = () => {
    appointmentData.value = {
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    }
    selectedSlot.value = null
    clearMessages()
  }

  // Actions
  const fetchAvailableSlots = async (date, forceRefresh = false) => {
    if (!date) {
      error.value = 'Date is required'
      return { success: false, error: error.value }
    }

    loading.value = true
    error.value = null

    try {
      const cacheKey = `slots-${date}`
      const cachedSlots = slotsCache.value.get(cacheKey)

      if (!forceRefresh && cachedSlots && 
          (Date.now() - cachedSlots.timestamp < SLOTS_CACHE_DURATION)) {
        availableSlots.value = cachedSlots.data.slots
        selectedDate.value = cachedSlots.data.date
        return { success: true, data: cachedSlots.data }
      }

      const response = await appointmentsApi.getAvailableSlots(date)

      if (response.success) {
        availableSlots.value = response.data.slots
        selectedDate.value = response.data.date

        // Cache the slots
        slotsCache.value.set(cacheKey, {
          data: response.data,
          timestamp: Date.now()
        })

        return { success: true, data: response.data }
      } else {
        throw new Error(response.error)
      }
    } catch (err) {
      error.value = err.message || 'Failed to fetch available slots'
      console.error('Slots Fetch Error:', err)
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const bookAppointment = async () => {
    if (!canBookAppointment.value) {
      error.value = 'Please fill in all required fields'
      return { success: false, error: error.value }
    }

    loading.value = true
    error.value = null
    successMessage.value = null

    try {
      const bookingData = {
        ...appointmentData.value,
        appointment_date: selectedDate.value,
        slot_id: selectedSlot.value.id
      }

      const response = await appointmentsApi.bookAppointment(bookingData)

      if (response.success) {
        successMessage.value = 'Appointment booked successfully!'
        
        // Clear the cache for the selected date to refresh slots
        const cacheKey = `slots-${selectedDate.value}`
        slotsCache.value.delete(cacheKey)
        
        // Reset form after successful booking
        resetForm()
        
        return { 
          success: true, 
          data: response.data,
          referenceCode: response.data.reference_code
        }
      } else {
        throw new Error(response.error)
      }
    } catch (err) {
      error.value = err.message || 'Failed to book appointment'
      console.error('Booking Error:', err)
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const trackAppointment = async (referenceCode) => {
    if (!referenceCode?.trim()) {
      error.value = 'Reference code is required'
      return { success: false, error: error.value }
    }

    loading.value = true
    error.value = null

    try {
      const response = await appointmentsApi.trackAppointment(referenceCode.trim())

      if (response.success) {
        trackedAppointment.value = response.data
        return { success: true, data: response.data }
      } else {
        throw new Error(response.error)
      }
    } catch (err) {
      error.value = err.message || 'Failed to track appointment'
      console.error('Tracking Error:', err)
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const sendContactMessage = async (messageData) => {
    contactLoading.value = true
    contactError.value = null
    contactSuccess.value = false

    try {
      const response = await contactApi.sendMessage(messageData)

      if (response.success) {
        contactSuccess.value = true
        return { success: true, data: response.data }
      } else {
        throw new Error(response.error)
      }
    } catch (err) {
      contactError.value = err.message || 'Failed to send message'
      console.error('Contact Error:', err)
      return { success: false, error: contactError.value }
    } finally {
      contactLoading.value = false
    }
  }

  const subscribeToNewsletter = async (subscriptionData) => {
    newsletterLoading.value = true
    newsletterError.value = null
    newsletterSuccess.value = false

    try {
      const response = await newsletterApi.subscribe(subscriptionData)

      if (response.success) {
        newsletterSuccess.value = true
        return { success: true, data: response.data }
      } else {
        throw new Error(response.error)
      }
    } catch (err) {
      newsletterError.value = err.message || 'Failed to subscribe'
      console.error('Newsletter Error:', err)
      return { success: false, error: newsletterError.value }
    } finally {
      newsletterLoading.value = false
    }
  }

  const selectSlot = (slot) => {
    selectedSlot.value = slot
    clearMessages()
  }

  const updateAppointmentData = (field, value) => {
    appointmentData.value[field] = value
    clearMessages()
  }

  const setAppointmentData = (data) => {
    appointmentData.value = { ...appointmentData.value, ...data }
    clearMessages()
  }

  const setSelectedDate = (date) => {
    selectedDate.value = date
    clearMessages()
  }

  const clearSelectedSlot = () => {
    selectedSlot.value = null
  }

  const clearTrackedAppointment = () => {
    trackedAppointment.value = null
  }

  const clearCache = () => {
    slotsCache.value.clear()
    availableSlots.value = []
    selectedDate.value = null
  }

  const refreshSlots = () => {
    if (selectedDate.value) {
      return fetchAvailableSlots(selectedDate.value, true)
    }
  }

  const fetchAvailableDateRange = async (startDate, endDate) => {
    loading.value = true
    error.value = null

    try {
      const response = await appointmentsApi.getAvailableDateRange(startDate, endDate)
      
      if (response.success) {
        return { success: true, data: response.data }
      } else {
        throw new Error(response.error)
      }
    } catch (err) {
      error.value = err.message || 'Failed to fetch available dates'
      console.error('Date Range Fetch Error:', err)
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  // Return store interface
  return {
    // State
    availableSlots: readonly(availableSlots),
    selectedDate: readonly(selectedDate),
    selectedSlot: readonly(selectedSlot),
    appointmentData: readonly(appointmentData),
    trackedAppointment: readonly(trackedAppointment),
    loading: readonly(loading),
    error: readonly(error),
    successMessage: readonly(successMessage),

    // Contact form state
    contactLoading: readonly(contactLoading),
    contactError: readonly(contactError),
    contactSuccess: readonly(contactSuccess),

    // Newsletter state
    newsletterLoading: readonly(newsletterLoading),
    newsletterError: readonly(newsletterError),
    newsletterSuccess: readonly(newsletterSuccess),

    // Getters
    hasAvailableSlots,
    isSlotSelected,
    isFormValid,
    canBookAppointment,

    // Actions
    fetchAvailableSlots,
    bookAppointment,
    trackAppointment,
    sendContactMessage,
    subscribeToNewsletter,
    selectSlot,
    updateAppointmentData,
    setAppointmentData,
    setSelectedDate,
    clearSelectedSlot,
    clearTrackedAppointment,
    clearMessages,
    resetForm,
    clearCache,
    refreshSlots,
    fetchAvailableDateRange
  }
})