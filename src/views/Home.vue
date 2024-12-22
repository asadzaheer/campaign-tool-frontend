<template>
  <div
    class="relative sm:flex sm:justify-center sm:items-center min-h-screen bg-dots-darker bg-center bg-gray-100 selection:bg-red-500 selection:text-white"
  >
    <div class="max-w-7xl mx-auto p-6 lg:p-8">
      <div class="flex justify-center">
        <h1 class="text-4xl font-bold text-gray-900">
          Campaign Management Tool
        </h1>
      </div>

      <div class="mt-16">
        <TransitionRoot appear :show="true">
          <div class="grid grid-cols-1 gap-6 lg:gap-8">
            <TransitionChild
              enter="transform transition duration-500 ease-out"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="transform duration-300 ease-in"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95"
            >
              <div
                class="scale-100 p-6 bg-white from-gray-700/50 via-transparent rounded-lg shadow-2xl shadow-gray-500/20 flex motion-safe:hover:scale-[1.01] transition-all duration-250 focus:outline focus:outline-2 focus:outline-red-500"
              >
                <div class="w-full">
                  <h2 class="mt-6 text-xl font-semibold text-gray-900">
                    Welcome to Campaign Management Tool
                  </h2>

                  <p class="mt-4 text-gray-500 text-sm leading-relaxed">
                    This is a simple Campaign Management Tool for managing
                    marketing campaigns for advertisers. Advertisers can create
                    campaigns to promote their business via our Ad Network.
                  </p>

                  <div
                    class="mt-4 text-gray-500 text-sm leading-relaxed"
                    v-if="!isAuthenticated"
                  >
                    You can use following credentials to login:
                    <div class="flex space-x-8 justify-center">
                      <div>
                        Email: <b>user1@example.com</b> <br />
                        Password: <b>password123</b>
                      </div>
                      <div>
                        Email: <b>user2@example.com</b> <br />
                        Password: <b>password123</b>
                      </div>
                      <div>
                        Email: <b>user3@example.com</b> <br />
                        Password: <b>password123</b>
                      </div>
                    </div>
                  </div>

                  <div class="mt-8 flex justify-center space-x-4">
                    <div v-if="!isAuthenticated" class="flex space-x-4">
                      <router-link
                        :to="{ name: 'login' }"
                        class="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                      >
                        Login
                      </router-link>
                      <router-link
                        :to="{ name: 'register' }"
                        class="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                      >
                        Register
                      </router-link>
                    </div>

                    <router-link
                      v-if="isAuthenticated"
                      :to="{ name: 'campaigns' }"
                      class="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                    >
                      Go to Campaigns
                    </router-link>
                  </div>
                </div>
              </div>
            </TransitionChild>
          </div>
        </TransitionRoot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from "../stores/auth";
import { computed } from "vue";
import { TransitionRoot, TransitionChild } from "@headlessui/vue";

const authStore = useAuthStore();
const isAuthenticated = computed(() => authStore.isAuthenticated);
</script>
