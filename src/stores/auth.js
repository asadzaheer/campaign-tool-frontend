import { defineStore } from "pinia";
import { ref } from "vue";
import { auth } from "@/utils/api";

export const useAuthStore = defineStore("auth", () => {
  const user = ref(null);
  const isAuthenticated = ref(false);
  const isLoading = ref(true);

  function setUser(userData) {
    user.value = userData;
    isAuthenticated.value = true;
  }

  function clearUser() {
    user.value = null;
    isAuthenticated.value = false;
  }

  async function register(data) {
    try {
      const response = await auth.register(data);
      localStorage.setItem("token", response.data.token);
      setUser(response.data.user);
    } catch (error) {
      throw error;
    }
  }

  async function login(credentials) {
    try {
      const response = await auth.login(credentials);
      localStorage.setItem("token", response.data.token);
      setUser(response.data.user);
    } catch (error) {
      throw error;
    }
  }

  async function logout() {
    try {
      const response = await auth.logout();

      if (response.status !== 200) {
        throw new Error(response?.message || "Logout failed");
      }

      clearUser();
    } catch (error) {
      throw error;
    }
  }

  async function getUser() {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        clearUser();
        isLoading.value = false;
        return;
      }

      const response = await auth.getUser();

      setUser(response.data);
    } catch (error) {
      clearUser();
    } finally {
      isLoading.value = false;
    }
  }

  return {
    isLoading,
    user,
    isAuthenticated,
    register,
    login,
    logout,
    getUser,
  };
});
