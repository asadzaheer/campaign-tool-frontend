<template>
  <div v-if="!authStore.isLoading">
    <NotificationBanner
      v-if="notificationStore.notification.show"
      :type="notificationStore.notification.type"
      :title="notificationStore.notification.title"
      :message="notificationStore.notification.message"
    />
    <Nav />
    <router-view v-slot="{ Component }">
      <component :is="Component" />
    </router-view>
  </div>
  <div v-else class="flex justify-center items-center h-screen">
    <div class="loader"></div>
  </div>
</template>

<script setup>
import Nav from "@/components/Nav.vue";
import { onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useNotificationStore } from "@/stores/notification";
import NotificationBanner from "@/components/NotificationBanner.vue";

const authStore = useAuthStore();
const notificationStore = useNotificationStore();

onMounted(async () => {
  await authStore.getUser();
});
</script>

<style scoped>
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
