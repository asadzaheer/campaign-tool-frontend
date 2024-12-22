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
                <div class="grid grid-cols-1 gap-6 lg:gap-8">
                    <div
                        class="scale-100 p-6 bg-white from-gray-700/50 via-transparent rounded-lg shadow-2xl shadow-gray-500/20 flex motion-safe:hover:scale-[1.01] transition-all duration-250 focus:outline focus:outline-2 focus:outline-red-500"
                    >
                        <div>
                            <h2
                                class="mt-6 text-xl font-semibold text-gray-900"
                            >
                                Welcome to Campaign Management Tool
                            </h2>

                            <p
                                class="mt-4 text-gray-500 text-sm leading-relaxed"
                            >
                                This is a simple Campaign Management Tool for managing marketing campaigns for advertisers.
                                Advertisers can create campaigns to promote their business via our Ad Network.
                            </p>

                            <div class="mt-8 flex justify-center">
                                <router-link
                                    v-if="isAuthenticated"
                                    :to="{ name: 'campaigns' }"
                                    class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                                >
                                    Go to Campaigns
                                </router-link>

                                <router-link
                                    v-if="!isAuthenticated"
                                    :to="{ name: 'login' }"
                                    class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 mr-4"
                                >
                                    Login
                                </router-link>

                                <router-link
                                    v-if="!isAuthenticated"
                                    :to="{ name: 'register' }"
                                    class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 mr-4"
                                >
                                    Register
                                </router-link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useAuthStore } from "../stores/auth";
import { computed } from "vue";

const authStore = useAuthStore();
const isAuthenticated = computed(() => authStore.isAuthenticated);
</script>
