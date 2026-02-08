import {computed, ref} from 'vue'
import {defineStore} from 'pinia'
import {apiLogout} from "@/api/auth";
import {User} from "@/models/user";
import {Role} from "@/models/enums/role";
import {apiGetMe} from "@/api/user";

export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref<boolean>(false);
  const me = ref<User | null>(null);

  const isAdmin = computed(() => {
    console.log(me.value);
    if (!me.value) return false;
    return me.value.role === Role.ADMIN;
  });

  const isModerator = computed(() => {
    if (!me.value) return false;
    return me.value.role === Role.MODERATOR || me.value.role === Role.ADMIN;
  });

  const login = async () => {
    me.value = await apiGetMe();
    isAuthenticated.value = true;
  }

  const logout = () => {
    apiLogout();
    me.value = null;
    isAuthenticated.value = false;
  }

  const initialize = async () => {
    await login();
    isAuthenticated.value = !!localStorage.getItem('access_token');
  }

  return {
    isAuthenticated,
    isModerator,
    isAdmin,
    login,
    logout,
    initialize,
    me
  }
})
