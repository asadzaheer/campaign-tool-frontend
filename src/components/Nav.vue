<template>
  <nav class="bg-white border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex">
          <!-- Logo -->
          <div class="flex-shrink-0 flex items-center">
            <router-link
              :to="{ name: 'home' }"
              class="text-xl font-bold text-indigo-600"
            >
              Campaign Tool
            </router-link>
          </div>
        </div>

        <!-- Navigation Links -->
        <div class="flex" v-if="isAuthenticated">
            <router-link
              :to="{ name: 'campaigns' }"
              class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              :class="{ 'border-indigo-500 text-gray-900': $route.name === 'campaigns' }"
            >
              Campaigns
            </router-link>
        </div>

        <!-- Navigation Links -->
        <div class="flex items-center">
          <div v-if="isAuthenticated" class="space-x-4">
            <span class="text-gray-500 capitalize">
              {{ user.name }}
            </span>

            <button
              class="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
              @click="logout"
            >
              Logout
            </button>
          </div>

          <div v-if="!isAuthenticated" class="space-x-4">
            <router-link
              :to="{ name: 'login' }"
              class="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
              :class="{ 'bg-gray-100': $route.name === 'login' }"
            >
              Login
            </router-link>

            <router-link
              :to="{ name: 'register' }"
              class="bg-indigo-600 text-white hover:bg-indigo-700 px-3 py-2 rounded-md text-sm font-medium"
              :class="{ 'bg-indigo-700': $route.name === 'register' }"
            >
              Register
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useAuthStore } from "../stores/auth";
import { useRouter } from "vue-router";
import { computed } from "vue";

const authStore = useAuthStore();
const router = useRouter();
const user = computed(() => authStore.user);
const isAuthenticated = computed(() => authStore.isAuthenticated);

const logout = async () => {
  try {
    await authStore.logout();
    router.push({ name: "home" });
  } catch (error) {
    console.log("Logout error:", error);
  }
};
</script>
