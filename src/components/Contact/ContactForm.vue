<template>
  <form @submit.prevent="submitForm" class="space-y-6">
    <BaseInput
      v-model="formData.name"
      id="name"
      name="name"
      label="Name"
      placeholder="Enter your name"
      required
      :error="errors.name"
    />
    
    <BaseInput
      v-model="formData.email"
      id="email"
      name="email"
      type="email"
      label="Email"
      placeholder="Enter your email"
      required
      :error="errors.email"
    />
    
    <BaseInput
      v-model="formData.phone"
      id="phone"
      name="phone"
      label="Phone (optional)"
      placeholder="Enter your phone number"
      :error="errors.phone"
    />
    
    <BaseInput
      v-model="formData.message"
      id="message"
      name="message"
      type="textarea"
      label="Message"
      placeholder="How can I help you?"
      required
      :error="errors.message"
      rows="6"
    />
    
    <div class="flex items-center">
      <BaseButton type="submit" :loading="isSubmitting">Submit Message</BaseButton>
      <p v-if="submitSuccess" class="ml-4 text-green-600 dark:text-green-400">
        Message sent successfully!
      </p>
    </div>
  </form>
</template>

<script setup>
import { ref } from 'vue';
import { useToast } from 'vue-toastification';
import BaseInput from '@/components/shared/BaseInput.vue';
import BaseButton from '@/components/shared/BaseButton.vue';
import { validateContactForm } from '@/utils/validations';
import apiClient from '@/utils/api';

const toast = useToast();
const isSubmitting = ref(false);
const submitSuccess = ref(false);
const errors = ref({});

const formData = ref({
  name: '',
  email: '',
  phone: '',
  message: ''
});

const resetForm = () => {
  formData.value = {
    name: '',
    email: '',
    phone: '',
    message: ''
  };
  errors.value = {};
};

const submitForm = async () => {
  // Clear previous errors
  errors.value = {};
  
  // Validate form
  const validation = validateContactForm(formData.value);
  
  if (!validation.isValid) {
    errors.value = validation.errors;
    return;
  }
  
  // Submit form
  isSubmitting.value = true;
  
  try {
    await apiClient.contact.submitForm(formData.value);
    toast.success("Your message has been sent! I'll get back to you soon.");
    submitSuccess.value = true;
    resetForm();
    
    // Reset success message after a delay
    setTimeout(() => {
      submitSuccess.value = false;
    }, 5000);
  } catch (error) {
    console.error('Error submitting form:', error);
    toast.error(error.message || "There was an error sending your message. Please try again later.");
  } finally {
    isSubmitting.value = false;
  }
};
</script>