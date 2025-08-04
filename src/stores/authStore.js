import { defineStore } from "pinia";
import { login as apiLogin, logout as apiLogout, initAuth } from "@/api/auth";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    isAuthenticated: false,
  }),
  actions: {
    async login(username, password) {
      await apiLogin(username, password);
      this.isAuthenticated = true;
    },
    logout() {
      apiLogout();
      this.isAuthenticated = false;
    },
    initialize() {
      initAuth();
      this.isAuthenticated = !!localStorage.getItem("access_token");
    },
  },
});