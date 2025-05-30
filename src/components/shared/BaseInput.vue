<template>
  <div>
    <label 
      v-if="label" 
      :for="id" 
      class="block text-sm font-medium text-dark dark:text-light mb-1"
    >
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    
    <div class="relative">
      <div 
        v-if="iconLeft" 
        class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-dark-muted dark:text-light-muted"
      >
        <slot name="icon-left"></slot>
      </div>
      
      <template v-if="type === 'textarea'">
        <textarea 
          :id="id"
          :name="name"
          :value="modelValue"
          :placeholder="placeholder"
          :disabled="disabled"
          :required="required"
          :rows="rows"
          :aria-describedby="error ? `${id}-error` : undefined"
          class="w-full border-gray-300 dark:border-gray-700 dark:bg-dark-muted dark:text-light rounded-md shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-20 transition-all duration-200"
          :class="[
            error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : '',
            iconLeft ? 'pl-10' : '',
            iconRight ? 'pr-10' : ''
          ]"
          @input="$emit('update:modelValue', $event.target.value)"
        ></textarea>
      </template>
      
      <template v-else>
        <input 
          :id="id"
          :type="type"
          :name="name"
          :value="modelValue"
          :placeholder="placeholder"
          :disabled="disabled"
          :required="required"
          :min="min"
          :max="max"
          :aria-describedby="error ? `${id}-error` : undefined"
          class="w-full border-gray-300 dark:border-gray-700 dark:bg-dark-muted dark:text-light rounded-md shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-20 transition-all duration-200"
          :class="[
            error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : '',
            iconLeft ? 'pl-10' : '',
            iconRight ? 'pr-10' : ''
          ]"
          @input="$emit('update:modelValue', $event.target.value)"
        />
      </template>
      
      <div 
        v-if="iconRight" 
        class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-dark-muted dark:text-light-muted"
      >
        <slot name="icon-right"></slot>
      </div>
    </div>
    
    <p 
      v-if="error" 
      :id="`${id}-error`" 
      class="mt-1 text-sm text-red-500"
    >
      {{ error }}
    </p>
    
    <p 
      v-else-if="hint" 
      class="mt-1 text-sm text-dark-muted dark:text-light-muted"
    >
      {{ hint }}
    </p>
  </div>
</template>

<script setup>
defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'text'
  },
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  hint: {
    type: String,
    default: ''
  },
  error: {
    type: String,
    default: ''
  },
  required: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  iconLeft: {
    type: Boolean,
    default: false
  },
  iconRight: {
    type: Boolean,
    default: false
  },
  min: {
    type: [Number, String],
    default: undefined
  },
  max: {
    type: [Number, String],
    default: undefined
  },
  rows: {
    type: Number,
    default: 4
  }
});

defineEmits(['update:modelValue']);
</script>