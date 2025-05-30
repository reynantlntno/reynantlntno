<template>
  <AdminLayout title="Manage Appointments">
    <div class="mb-6 flex justify-between items-center">
      <div>
        <div class="relative rounded-md shadow-sm max-w-xs">
          <input
            v-model="searchQuery"
            type="text"
            class="block w-full border-gray-300 dark:border-gray-700 dark:bg-dark-muted dark:text-light rounded-md shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-20"
            placeholder="Search appointments..."
          />
          <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-dark-muted dark:text-light-muted" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
            </svg>
          </div>
        </div>
      </div>
      
      <div class="flex">
        <select
          v-model="filterStatus"
          class="mr-4 border-gray-300 dark:border-gray-700 dark:bg-dark-muted dark:text-light rounded-md shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-20"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
    </div>
    
    <div v-if="isLoading" class="flex justify-center py-12">
      <LoadingSpinner size="lg" text="Loading appointments..." />
    </div>
    
    <div v-else-if="filteredAppointments.length === 0" class="text-center py-12 bg-white dark:bg-dark rounded-lg">
      <p class="text-dark-muted dark:text-light-muted text-lg">
        No appointments found.
        <span v-if="searchQuery || filterStatus !== 'all'">Try different search terms or filters.</span>
      </p>
    </div>
    
    <div v-else class="overflow-x-auto bg-white dark:bg-dark rounded-lg shadow">
      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead>
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-dark-muted dark:text-light-muted uppercase tracking-wider">
              Client
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-dark-muted dark:text-light-muted uppercase tracking-wider">
              Date & Time
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-dark-muted dark:text-light-muted uppercase tracking-wider">
              Purpose
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-dark-muted dark:text-light-muted uppercase tracking-wider">
              Status
            </th>
            <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-dark-muted dark:text-light-muted uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white dark:bg-dark divide-y divide-gray-200 dark:divide-gray-700">
          <tr v-for="appointment in filteredAppointments" :key="appointment._id">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div>
                  <div class="text-sm font-medium">{{ appointment.name }}</div>
                  <div class="text-sm text-dark-muted dark:text-light-muted">{{ appointment.email }}</div>
                  <div v-if="appointment.phone" class="text-sm text-dark-muted dark:text-light-muted">{{ appointment.phone }}</div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm">{{ formatDate(appointment.date, 'MMM dd, yyyy') }}</div>
              <div class="text-sm text-dark-muted dark:text-light-muted">{{ formatTime(appointment.timeSlot) }}</div>
            </td>
            <td class="px-6 py-4">
              <div class="text-sm">{{ appointment.purpose }}</div>
              <div v-if="appointment.notes" class="text-sm text-dark-muted dark:text-light-muted truncate max-w-xs">
                {{ appointment.notes }}
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span 
                class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                :class="{
                  'bg-yellow-100 text-yellow-800': appointment.status === 'pending',
                  'bg-green-100 text-green-800': appointment.status === 'confirmed',
                  'bg-red-100 text-red-800': appointment.status === 'cancelled'
                }"
              >
                {{ appointment.status }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <div class="flex justify-end space-x-2">
                <button
                  v-if="appointment.status === 'pending'"
                  @click="updateStatus(appointment._id, 'confirmed')"
                  class="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                >
                  Confirm
                </button>
                <button
                  v-if="appointment.status !== 'cancelled'"
                  @click="updateStatus(appointment._id, 'cancelled')"
                  class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                >
                  Cancel
                </button>
                <button
                  @click="viewDetails(appointment)"
                  class="text-primary dark:text-primary-light"
                >
                  Details
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- Pagination -->
    <div v-if="totalPages > 1" class="flex justify-center mt-6">
      <nav class="inline-flex rounded-md shadow">
        <button 
          @click="currentPage > 1 && (currentPage--)"
          :disabled="currentPage <= 1"
          class="px-3 py-2 rounded-l-md border border-gray-300 dark:border-gray-700 text-dark-muted dark:text-light-muted hover:bg-light-muted dark:hover:bg-dark-muted disabled:opacity-50"
        >
          Previous
        </button>
        <span class="px-3 py-2 border-t border-b border-gray-300 dark:border-gray-700 bg-white dark:bg-dark text-dark dark:text-light font-medium">
          {{ currentPage }} of {{ totalPages }}
        </span>
        <button 
          @click="currentPage < totalPages && (currentPage++)"
          :disabled="currentPage >= totalPages"
          class="px-3 py-2 rounded-r-md border border-gray-300 dark:border-gray-700 text-dark-muted dark:text-light-muted hover:bg-light-muted dark:hover:bg-dark-muted disabled:opacity-50"
        >
          Next
        </button>
      </nav>
    </div>
    
    <!-- Appointment Details Modal -->
    <Teleport to="body">
      <Modal v-if="showDetailsModal" @close="showDetailsModal = false">
        <template #header>
          <h3 class="text-lg font-medium">Appointment Details</h3>
        </template>
        
        <div v-if="selectedAppointment" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <p class="text-sm text-dark-muted dark:text-light-muted">Client Name</p>
              <p class="font-medium">{{ selectedAppointment.name }}</p>
            </div>
            <div>
              <p class="text-sm text-dark-muted dark:text-light-muted">Email</p>
              <p class="font-medium">{{ selectedAppointment.email }}</p>
            </div>
            <div>
              <p class="text-sm text-dark-muted dark:text-light-muted">Phone</p>
              <p class="font-medium">{{ selectedAppointment.phone || 'Not provided' }}</p>
            </div>
            <div>
              <p class="text-sm text-dark-muted dark:text-light-muted">Status</p>
              <p class="font-medium capitalize">{{ selectedAppointment.status }}</p>
            </div>
            <div>
              <p class="text-sm text-dark-muted dark:text-light-muted">Date</p>
              <p class="font-medium">{{ formatDate(selectedAppointment.date, 'MMMM d, yyyy') }}</p>
            </div>
            <div>
              <p class="text-sm text-dark-muted dark:text-light-muted">Time</p>
              <p class="font-medium">{{ formatTime(selectedAppointment.timeSlot) }}</p>
            </div>
          </div>
          
          <div>
            <p class="text-sm text-dark-muted dark:text-light-muted">Purpose</p>
            <p class="font-medium">{{ selectedAppointment.purpose }}</p>
          </div>
          
          <div v-if="selectedAppointment.notes">
            <p class="text-sm text-dark-muted dark:text-light-muted">Notes</p>
            <p class="font-medium">{{ selectedAppointment.notes }}</p>
          </div>
          
          <div>
            <p class="text-sm text-dark-muted dark:text-light-muted">Created</p>
            <p class="font-medium">{{ formatDate(selectedAppointment.createdAt, 'MMMM d, yyyy h:mm a') }}</p>
          </div>
        </div>
        
        <template #footer>
          <div class="flex justify-between w-full">
            <div>
              <BaseButton 
                v-if="selectedAppointment && selectedAppointment.status === 'pending'"
                @click="updateStatus(selectedAppointment._id, 'confirmed'); showDetailsModal = false"
                variant="primary"
                class="mr-3"
              >
                Confirm
              </BaseButton>
              <BaseButton 
                v-if="selectedAppointment && selectedAppointment.status !== 'cancelled'"
                @click="updateStatus(selectedAppointment._id, 'cancelled'); showDetailsModal = false"
                variant="danger"
              >
                Cancel
              </BaseButton>
            </div>
            <BaseButton @click="showDetailsModal = false" variant="outline">Close</BaseButton>
          </div>
        </template>
      </Modal>
    </Teleport>
  </AdminLayout>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { formatDate, formatTime } from '@/utils/formatters';
import { useToast } from 'vue-toastification';
import axios from 'axios';
import AdminLayout from '@/components/Admin/AdminLayout.vue';
import BaseButton from '@/components/shared/BaseButton.vue';
import LoadingSpinner from '@/components/shared/LoadingSpinner.vue';
import Modal from '@/components/shared/Modal.vue';

const toast = useToast();
const searchQuery = ref('');
const filterStatus = ref('all');
const currentPage = ref(1);
const appointmentsPerPage = 10;
const totalAppointments = ref(0);
const appointments = ref([]);
const isLoading = ref(true);
const showDetailsModal = ref(false);
const selectedAppointment = ref(null);

// Computed properties
const totalPages = computed(() => Math.ceil(totalAppointments.value / appointmentsPerPage));

const filteredAppointments = computed(() => {
  let filtered = [...appointments.value];
  
  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(appointment => 
      appointment.name.toLowerCase().includes(query) || 
      appointment.email.toLowerCase().includes(query) ||
      (appointment.purpose && appointment.purpose.toLowerCase().includes(query))
    );
  }
  
  // Filter by status
  if (filterStatus.value !== 'all') {
    filtered = filtered.filter(appointment => appointment.status === filterStatus.value);
  }
  
  return filtered;
});

// Methods
const fetchAppointments = async () => {
  isLoading.value = true;
  try {
    const response = await axios.get('/api/admin/appointments', {
      params: {
        page: currentPage.value,
        limit: appointmentsPerPage,
        status: filterStatus.value !== 'all' ? filterStatus.value : undefined
      }
    });
    
    appointments.value = response.data.appointments;
    totalAppointments.value = response.data.pagination.total;
  } catch (error) {
    console.error('Error fetching appointments:', error);
    toast.error('Failed to load appointments. Please try again.');
  } finally {
    isLoading.value = false;
  }
};

const updateStatus = async (id, status) => {
  try {
    await axios.put(`/api/admin/appointments/${id}`, { status });
    
    // Update local appointment status
    const appointment = appointments.value.find(a => a._id === id);
    if (appointment) {
      appointment.status = status;
    }
    
    toast.success(`Appointment ${status} successfully`);
  } catch (error) {
    console.error('Error updating appointment:', error);
    toast.error('Failed to update appointment status. Please try again.');
  }
};

const viewDetails = (appointment) => {
  selectedAppointment.value = appointment;
  showDetailsModal.value = true;
};

// Watch for page or filter changes
watch([currentPage, filterStatus], fetchAppointments);

// Fetch appointments on component mount
onMounted(fetchAppointments);
</script>