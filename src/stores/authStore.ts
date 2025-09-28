import { ref } from 'vue'
import { defineStore } from 'pinia'
import { apiLogin, apiLogout, initAuth} from "@/api/auth";

export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref<boolean>(false)

  const login = async (username: string, password: string) => {
    await apiLogin(username, password)
    isAuthenticated.value = true
  }

  const logout = () => {
    apiLogout()
    isAuthenticated.value = false
  }

  const initialize = () => {
    initAuth()
    isAuthenticated.value = !!localStorage.getItem('access_token')
  }

  return {
    isAuthenticated,
    login,
    logout,
    initialize,
  }
})
