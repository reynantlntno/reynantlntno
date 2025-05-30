<template>
  <AdminLayout title="Contact Messages">
    <div class="mb-6 flex justify-between items-center">
      <div>
        <div class="relative rounded-md shadow-sm max-w-xs">
          <input
            v-model="searchQuery"
            type="text"
            class="block w-full border-gray-300 dark:border-gray-700 dark:bg-dark-muted dark:text-light rounded-md shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-20"
            placeholder="Search messages..."
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
          class="border-gray-300 dark:border-gray-700 dark:bg-dark-muted dark:text-light rounded-md shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-20"
        >
          <option value="all">All Status</option>
          <option value="new">New</option>
          <option value="read">Read</option>
          <option value="responded">Responded</option>
        </select>
      </div>
    </div>
    
    <div v-if="isLoading" class="flex justify-center py-12">
      <LoadingSpinner size="lg" text="Loading messages..." />
    </div>
    
    <div v-else-if="filteredMessages.length === 0" class="text-center py-12 bg-white dark:bg-dark rounded-lg">
      <p class="text-dark-muted dark:text-light-muted text-lg">
        No messages found.
        <span v-if="searchQuery || filterStatus !== 'all'">Try different search terms or filters.</span>
      </p>
    </div>
    
    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div 
        v-for="message in filteredMessages" 
        :key="message._id"
        class="bg-white dark:bg-dark p-4 rounded-lg shadow-sm cursor-pointer"
        :class="{ 'border-l-4 border-primary': message.status === 'new' }"
        @click="viewMessage(message)"
      >
        <div class="flex justify-between items-start">
          <h3 class="font-medium">{{ message.name }}</h3>
          <span 
            class="px-2 py-0.5 text-xs rounded-full"
            :class="{
              'bg-primary/20 text-primary': message.status === 'new',
              'bg-gray-100 dark:bg-gray-700 text-dark-muted dark:text-light-muted': message.status === 'read',
              'bg-green-100 text-green-800': message.status === 'responded'
            }"
          >
            {{ message.status }}
          </span>
        </div>
        
        <p class="text-sm text-dark-muted dark:text-light-muted mb-2">{{ message.email }}</p>
        <p class="line-clamp-2 text-sm mb-2">{{ message.message }}</p>
        <p class="text-xs text-dark-muted dark:text-light-muted">{{ formatDate(message.createdAt, 'MMM dd, yyyy h:mm a') }}</p>
      </div>
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
    
    <!-- Message Details Modal -->
    <Teleport to="body">
      <Modal v-if="selectedMessage" @close="closeMessageModal">
        <template #header>
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-medium">Message from {{ selectedMessage.name }}</h3>
            <span 
              class="px-2 py-0.5 text-xs rounded-full"
              :class="{
                'bg-primary/20 text-primary': selectedMessage.status === 'new',
                'bg-gray-100 dark:bg-gray-700 text-dark-muted dark:text-light-muted': selectedMessage.status === 'read',
                'bg-green-100 text-green-800': selectedMessage.status === 'responded'
              }"
            >
              {{ selectedMessage.status }}
            </span>
          </div>
        </template>
        
        <div class="space-y-4">
          <div>
            <p class="text-sm text-dark-muted dark:text-light-muted">From</p>
            <p class="font-medium">{{ selectedMessage.name }} <span class="font-normal">({{ selectedMessage.email }})</span></p>
            <p v-if="selectedMessage.phone" class="text-sm">{{ selectedMessage.phone }}</p>
          </div>
          
          <div>
            <p class="text-sm text-dark-muted dark:text-light-muted">Date</p>
            <p class="font-medium">{{ formatDate(selectedMessage.createdAt, 'MMM dd, yyyy h:mm a') }}</p>
          </div>
          
          <div>
            <p class="text-sm text-dark-muted dark:text-light-muted">Message</p>
            <p class="whitespace-pre-line">{{ selectedMessage.message }}</p>
          </div>
          
          <div v-if="showReplyForm">
            <h4 class="font-medium mb-2">Reply</h4>
            <BaseInput 
              v-model="replyMessage"
              type="textarea"
              placeholder="Type your response here..."
              rows="4"
            />
          </div>
        </div>
        
        <template #footer>
          <div class="flex justify-end space-x-2">
            <BaseButton 
              v-if="!showReplyForm"
              @click="showReplyForm = true" 
              variant="primary"
            >
              Reply
            </BaseButton>
            
            <div v-if="showReplyForm">
              <BaseButton 
                @click="sendReply"
                variant="primary"
                :loading="sending"
                class="mr-2"
              >
                Send Reply
              </BaseButton>
              <BaseButton 
                @click="showReplyForm = false"
                variant="outline"
              >
                Cancel
              </BaseButton>
            </div>
            
            <BaseButton 
              v-else
              @click="closeMessageModal" 
              variant="outline"
            >
              Close
            </BaseButton>
          </div>
        </template>
      </Modal>
    </Teleport>
  </AdminLayout>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { formatDate } from '@/utils/formatters';
import { useToast } from 'vue-toastification';
import axios from 'axios';
import AdminLayout from '@/components/Admin/AdminLayout.vue';
import BaseButton from '@/components/shared/BaseButton.vue';
import BaseInput from '@/components/shared/BaseInput.vue';
import LoadingSpinner from '@/components/shared/LoadingSpinner.vue';
import Modal from '@/components/shared/Modal.vue';

const toast = useToast();
const searchQuery = ref('');
const filterStatus = ref('all');
const currentPage = ref(1);
const messagesPerPage = 10;
const totalMessages = ref(0);
const messages = ref([]);
const isLoading = ref(true);
const selectedMessage = ref(null);
const showReplyForm = ref(false);
const replyMessage = ref('');
const sending = ref(false);

// Computed properties
const totalPages = computed(() => Math.ceil(totalMessages.value / messagesPerPage));

const filteredMessages = computed(() => {
  let filtered = [...messages.value];
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(message => 
      message.name.toLowerCase().includes(query) || 
      message.email.toLowerCase().includes(query) ||
      message.message.toLowerCase().includes(query)
    );
  }
  
  if (filterStatus.value !== 'all') {
    filtered = filtered.filter(message => message.status === filterStatus.value);
  }
  
  return filtered;
});

// Methods
const fetchMessages = async () => {
  isLoading.value = true;
  try {
    const response = await axios.get('/api/admin/messages', {
      params: {
        page: currentPage.value,
        limit: messagesPerPage,
        status: filterStatus.value !== 'all' ? filterStatus.value : undefined
      }
    });
    
    messages.value = response.data.messages;
    totalMessages.value = response.data.pagination.total;
  } catch (error) {
    console.error('Error fetching messages:', error);
    toast.error('Failed to load messages. Please try again.');
  } finally {
    isLoading.value = false;
  }
};

const viewMessage = async (message) => {
  selectedMessage.value = message;
  showReplyForm.value = false;
  replyMessage.value = '';
  
  // If message is new, mark it as read
  if (message.status === 'new') {
    try {
      await axios.put(`/api/admin/messages/${message._id}`, { status: 'read' });
      // Update local state
      message.status = 'read';
    } catch (error) {
      console.error('Error updating message status:', error);
    }
  }
};

const closeMessageModal = () => {
  selectedMessage.value = null;
  showReplyForm.value = false;
  replyMessage.value = '';
};

const sendReply = async () => {
  if (!replyMessage.value.trim()) {
    toast.error('Please enter a reply message');
    return;
  }
  
  sending.value = true;
  try {
    await axios.post(`/api/admin/messages/${selectedMessage.value._id}/reply`, {
      replyMessage: replyMessage.value
    });
    
    // Update local state
    selectedMessage.value.status = 'responded';
    const message = messages.value.find(m => m._id === selectedMessage.value._id);
    if (message) {
      message.status = 'responded';
    }
    
    toast.success('Reply sent successfully');
    closeMessageModal();
  } catch (error) {
    console.error('Error sending reply:', error);
    toast.error('Failed to send reply. Please try again.');
  } finally {
    sending.value = false;
  }
};

// Watch for page or filter changes
watch([currentPage, filterStatus], fetchMessages);

// Fetch messages on component mount
onMounted(fetchMessages);
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>