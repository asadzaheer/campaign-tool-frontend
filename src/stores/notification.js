import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useNotificationStore = defineStore('notification', () => {
  const notification = ref({
    show: false,
    type: 'success',
    title: '',
    message: ''
  });

  function showNotification({ type = 'success', title = '', message = '' }) {
    notification.value = {
      show: true,
      type,
      title,
      message
    };
  }

  function hideNotification() {
    notification.value.show = false;
  }

  return {
    notification,
    showNotification,
    hideNotification
  };
});