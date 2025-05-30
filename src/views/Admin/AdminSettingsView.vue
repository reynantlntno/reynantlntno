<template>
  <AdminLayout title="Settings">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <!-- Profile Section -->
      <div class="glass-card md:col-span-2">
        <h3 class="text-xl font-bold mb-6">Profile Settings</h3>
        
        <form @submit.prevent="updateProfile" class="space-y-6">
          <BaseInput
            v-model="profileForm.name"
            id="name"
            name="name"
            label="Name"
            placeholder="Your Name"
            required
            :error="profileErrors.name"
          />
          
          <BaseInput
            v-model="profileForm.email"
            id="email"
            name="email"
            type="email"
            label="Email"
            placeholder="your@email.com"
            required
            :error="profileErrors.email"
          />
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <BaseInput
              v-model="profileForm.title"
              id="title"
              name="title"
              label="Professional Title"
              placeholder="Software Developer"
              :error="profileErrors.title"
            />
            
            <BaseInput
              v-model="profileForm.location"
              id="location"
              name="location"
              label="Location"
              placeholder="City, Country"
              :error="profileErrors.location"
            />
          </div>
          
          <BaseInput
            v-model="profileForm.bio"
            id="bio"
            name="bio"
            type="textarea"
            label="Bio"
            placeholder="Write a short bio about yourself"
            rows="4"
            :error="profileErrors.bio"
          />
          
          <!-- Social Links -->
          <div>
            <h4 class="text-lg font-medium mb-4">Social Links</h4>
            <div class="space-y-4">
              <BaseInput
                v-model="profileForm.socialLinks.github"
                id="github"
                name="github"
                label="GitHub"
                placeholder="https://github.com/username"
                :error="profileErrors.github"
              />
              
              <BaseInput
                v-model="profileForm.socialLinks.linkedin"
                id="linkedin"
                name="linkedin"
                label="LinkedIn"
                placeholder="https://linkedin.com/in/username"
                :error="profileErrors.linkedin"
              />
              
              <BaseInput
                v-model="profileForm.socialLinks.twitter"
                id="twitter"
                name="twitter"
                label="Twitter"
                placeholder="https://twitter.com/username"
                :error="profileErrors.twitter"
              />
            </div>
          </div>
          
          <div class="flex justify-end">
            <BaseButton 
              type="submit"
              :loading="isSavingProfile"
            >
              Save Profile
            </BaseButton>
          </div>
        </form>
      </div>
      
      <!-- Security Settings -->
      <div class="space-y-6 md:col-span-1">
        <div class="glass-card">
          <h3 class="text-xl font-bold mb-6">Password</h3>
          
          <form @submit.prevent="changePassword" class="space-y-6">
            <BaseInput
              v-model="passwordForm.currentPassword"
              id="currentPassword"
              name="currentPassword"
              type="password"
              label="Current Password"
              placeholder="Enter current password"
              required
              :error="passwordErrors.currentPassword"
            />
            
            <BaseInput
              v-model="passwordForm.newPassword"
              id="newPassword"
              name="newPassword"
              type="password"
              label="New Password"
              placeholder="Enter new password"
              required
              :error="passwordErrors.newPassword"
            />
            
            <BaseInput
              v-model="passwordForm.confirmPassword"
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              label="Confirm New Password"
              placeholder="Confirm new password"
              required
              :error="passwordErrors.confirmPassword"
            />
            
            <div class="flex justify-end">
              <BaseButton 
                type="submit"
                :loading="isSavingPassword"
              >
                Update Password
              </BaseButton>
            </div>
          </form>
        </div>
        
        <!-- Appearance Settings -->
        <div class="glass-card">
          <h3 class="text-xl font-bold mb-6">Appearance</h3>
          
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-dark dark:text-light mb-1">Theme</label>
              <div class="flex space-x-4">
                <label class="inline-flex items-center">
                  <input 
                    type="radio" 
                    name="theme" 
                    value="light"
                    :checked="!themeStore.darkMode" 
                    @change="themeStore.darkMode = false"
                    class="form-radio text-primary focus:ring-primary"
                  >
                  <span class="ml-2">Light</span>
                </label>
                <label class="inline-flex items-center">
                  <input 
                    type="radio" 
                    name="theme" 
                    value="dark"
                    :checked="themeStore.darkMode" 
                    @change="themeStore.darkMode = true"
                    class="form-radio text-primary focus:ring-primary"
                  >
                  <span class="ml-2">Dark</span>
                </label>
                <label class="inline-flex items-center">
                  <input 
                    type="radio" 
                    name="theme" 
                    value="system"
                    class="form-radio text-primary focus:ring-primary"
                  >
                  <span class="ml-2">System</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref } from 'vue';
import { useToast } from 'vue-toastification';
import { useThemeStore } from '@/stores/themeStore';
import axios from 'axios';
import AdminLayout from '@/components/Admin/AdminLayout.vue';
import BaseInput from '@/components/shared/BaseInput.vue';
import BaseButton from '@/components/shared/BaseButton.vue';

const toast = useToast();
const themeStore = useThemeStore();

// Profile state
const profileForm = ref({
  name: 'Reynan Tolentino',
  email: 'admin@reynantlntno.dev',
  title: 'Software Developer',
  location: 'San Francisco, CA',
  bio: 'Software developer specializing in modern web technologies with experience in Vue.js, Node.js, and cloud infrastructure.',
  socialLinks: {
    github: 'https://github.com/',
    linkedin: 'https://linkedin.com/in/',
    twitter: 'https://twitter.com/'
  }
});
const profileErrors = ref({});
const isSavingProfile = ref(false);

// Password state
const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
});
const passwordErrors = ref({});
const isSavingPassword = ref(false);

// Methods
const updateProfile = async () => {
  // Reset errors
  profileErrors.value = {};
  
  // Validate form
  if (!profileForm.value.name) {
    profileErrors.value.name = 'Name is required';
    return;
  }
  
  if (!profileForm.value.email) {
    profileErrors.value.email = 'Email is required';
    return;
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(profileForm.value.email)) {
    profileErrors.value.email = 'Please enter a valid email address';
    return;
  }
  
  // Submit form
  isSavingProfile.value = true;
  try {
    // In a real app, you'd save this to the database
    // await axios.put('/api/admin/profile', profileForm.value);
    
    toast.success('Profile updated successfully');
  } catch (error) {
    console.error('Error updating profile:', error);
    toast.error('Failed to update profile. Please try again.');
  } finally {
    isSavingProfile.value = false;
  }
};

const changePassword = async () => {
  // Reset errors
  passwordErrors.value = {};
  
  // Validate form
  if (!passwordForm.value.currentPassword) {
    passwordErrors.value.currentPassword = 'Current password is required';
    return;
  }
  
  if (!passwordForm.value.newPassword) {
    passwordErrors.value.newPassword = 'New password is required';
    return;
  }
  
  if (passwordForm.value.newPassword.length < 8) {
    passwordErrors.value.newPassword = 'Password must be at least 8 characters';
    return;
  }
  
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    passwordErrors.value.confirmPassword = 'Passwords do not match';
    return;
  }
  
  // Submit form
  isSavingPassword.value = true;
  try {
    // In a real app, you'd verify the current password and update it
    // await axios.put('/api/admin/password', {
    //   currentPassword: passwordForm.value.currentPassword,
    //   newPassword: passwordForm.value.newPassword
    // });
    
    toast.success('Password updated successfully');
    
    // Reset form
    passwordForm.value = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    };
  } catch (error) {
    console.error('Error changing password:', error);
    
    // Handle specific errors
    if (error.response && error.response.status === 401) {
      passwordErrors.value.currentPassword = 'Current password is incorrect';
    } else {
      toast.error('Failed to update password. Please try again.');
    }
  } finally {
    isSavingPassword.value = false;
  }
};
</script>