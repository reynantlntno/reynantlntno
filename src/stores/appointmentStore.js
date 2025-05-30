import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import axios from 'axios';
import { useToast } from 'vue-toastification';

export const useAppointmentStore = defineStore('appointment', () => {
  const toast = useToast();
  
  const availableDates = ref([]);
  const availableTimeSlots = ref([]);
  const isLoading = ref(false);
  const selectedDate = ref(null);
  const selectedTimeSlot = ref(null);

  const fetchAvailableDates = async () => {
    isLoading.value = true;
    try {
      const response = await axios.get('/api/appointment/get');
      availableDates.value = response.data.availableDates;
    } catch (error) {
      toast.error('Failed to load available dates. Please try again later.');
      console.error('Error fetching available dates:', error);
    } finally {
      isLoading.value = false;
    }
  };

  const fetchTimeSlots = async (date) => {
    if (!date) return;
    
    isLoading.value = true;
    selectedDate.value = date;
    
    try {
      const response = await axios.get(`/api/appointment/get?date=${date.toISOString()}`);
      availableTimeSlots.value = response.data.timeSlots;
    } catch (error) {
      toast.error('Failed to load time slots. Please try again later.');
      console.error('Error fetching time slots:', error);
      availableTimeSlots.value = [];
    } finally {
      isLoading.value = false;
    }
  };

  const bookAppointment = async (appointmentData) => {
    isLoading.value = true;
    try {
      const response = await axios.post('/api/appointment/create', appointmentData);
      toast.success('Appointment booked successfully!');
      return response.data;
    } catch (error) {
      let errorMsg = 'Failed to book appointment. Please try again.';
      if (error.response && error.response.data && error.response.data.message) {
        errorMsg = error.response.data.message;
      }
      toast.error(errorMsg);
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    availableDates,
    availableTimeSlots,
    isLoading,
    selectedDate,
    selectedTimeSlot,
    fetchAvailableDates,
    fetchTimeSlots,
    bookAppointment
  };
});