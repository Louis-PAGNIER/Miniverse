import {computed, ref} from 'vue'
import { defineStore } from 'pinia'
import { apiLogin, apiLogout} from "@/api/auth";
import {User} from "@/models/user";
import {Role} from "@/models/enums/role";

export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref<boolean>(false);
  const me = ref<User | null>(null);
  const token = ref<string | null>(null);

  const isAdmin = computed(() => {
    console.log(me.value);
    if (!me.value) return false;
    return me.value.role === Role.ADMIN;
  });

  const isModerator = computed(() => {
    if (!me.value) return false;
    return me.value.role === Role.MODERATOR || me.value.role === Role.ADMIN;
  });

  const login = async (username: string, password: string) => {
    const [accessToken, user] = await apiLogin(username, password);
    me.value = user;
    token.value = accessToken;
    isAuthenticated.value = true;
  }

  const logout = () => {
    apiLogout();
    me.value = null;
    token.value = null;
    isAuthenticated.value = false;
  }

  const initialize = async () => {
    await login("Louis", "1234");
    isAuthenticated.value = !!localStorage.getItem('access_token');
  }

  return {
    isAuthenticated,
    isModerator,
    isAdmin,
    login,
    logout,
    initialize,
  }
})
