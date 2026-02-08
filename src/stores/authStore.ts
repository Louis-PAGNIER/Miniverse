import {computed, ref} from 'vue'
import {defineStore} from 'pinia'
import {User} from "@/models/user";
import {Role} from "@/models/enums/role";
import {apiGetMe} from "@/api/user";
import keycloak from "@/services/keycloak";

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

  const logout = async () => {
    await keycloak.logout();
    me.value = null;
    isAuthenticated.value = false;
  }

  const initialize = async () => {
    await login();
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
