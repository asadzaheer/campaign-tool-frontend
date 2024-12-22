<template>
  <div class="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        Sign in to your account
      </h2>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 relative">
        <LoadingSpinner v-if="loading" />
        <form class="space-y-6" @submit.prevent="login">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <div class="mt-1">
              <input
                id="email"
                name="email"
                type="email"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                v-model="form.email"
              />
            </div>
            <ul v-if="hasError('email')">
              <li
                v-for="(error, index) in errors.email"
                :key="index"
                class="mt-2 text-sm text-red-600"
              >
                {{ error }}
              </li>
            </ul>
          </div>

          <div>
            <label
              for="password"
              class="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div class="mt-1">
              <input
                id="password"
                name="password"
                type="password"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                v-model="form.password"
              />
            </div>
            <ul v-if="hasError('password')">
              <li
                v-for="(error, index) in errors.password"
                :key="index"
                class="mt-2 text-sm text-red-600"
              >
                {{ error }}
              </li>
            </ul>
          </div>

          <div>
            <button
              type="submit"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              :disabled="loading"
            >
              Sign in
            </button>
          </div>
        </form>

        <div class="mt-6">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white text-gray-500"> Or </span>
            </div>
          </div>

          <div class="mt-6">
            <router-link
              :to="{ name: 'register' }"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-indigo-600 bg-white hover:bg-gray-50"
            >
              Create new account
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import { useAuthStore } from "@/stores/auth";
import { validateEmail, validatePassword, sanitizeText } from "@/utils/validation";

const router = useRouter();
const authStore = useAuthStore();
const form = ref({
  email: "",
  password: "",
});
const errors = ref({});
const loading = ref(false);

const isValid = () => {
  errors.value.email = !validateEmail(form.value.email)
    ? [ "Please enter a valid email address" ]
    : "";
  errors.value.password = !validatePassword(form.value.password)
    ? [ "Password must be at least 8 characters" ]
    : "";
  return (
    !errors.value.email &&
    !errors.value.password &&
    form.value.email &&
    form.value.password
  );
};

const login = async () => {
  if (!isValid()) {
    return;
  }
  loading.value = true;
  errors.value = {};

  try {
    form.value.email = sanitizeText(form.value.email);
    form.value.password = sanitizeText(form.value.password);

    await authStore.login(form.value);
    router.push("/");
  } catch (error) {
    console.error("Login error:", error.response || error);

    if (error.response?.data?.errors) {
      errors.value = error.response.data.errors;
    } else if (error.response?.data?.message) {
      errors.value = {
        email: [error.response.data.message],
      };
    } else {
      errors.value = {
        email: ["An error occurred while trying to log in. Please try again."],
      };
    }
  } finally {
    loading.value = false;
  }
};

const hasError = (field) => {
  return errors.value[field] && errors.value[field].length > 0;
};
</script>
