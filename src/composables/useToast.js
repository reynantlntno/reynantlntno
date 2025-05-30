import { ref, onUnmounted } from 'vue';

export function useToast() {
  const toast = ref({
    show: false,
    message: '',
    type: 'success', // success, error, warning, info
    timeout: null
  });

  const showToast = (message, type = 'success', duration = 3000) => {
    if (toast.value.timeout) {
      clearTimeout(toast.value.timeout);
    }
    
    toast.value.show = true;
    toast.value.message = message;
    toast.value.type = type;
    
    toast.value.timeout = setTimeout(() => {
      hideToast();
    }, duration);
  };

  const hideToast = () => {
    toast.value.show = false;
  };

  onUnmounted(() => {
    if (toast.value.timeout) {
      clearTimeout(toast.value.timeout);
    }
  });

  return {
    toast,
    showToast,
    hideToast
  };
}