<script setup lang="ts">

import {TresCanvas} from "@tresjs/core";
import {useAuthStore} from "@/stores/authStore";
import {onMounted, onUnmounted, watch} from "vue";
import AccountRequestScene from "@/pages/AccountRequestScene.vue";
import Logo from "@/components/Logo.vue";

let intervalId: number;

const authStore = useAuthStore();

watch(() => authStore.isAuthenticated, (isAuth) => {
  if (isAuth) {
    // this reload page
    window.location.replace("/")
  }
}, {immediate: true});

onMounted(() => {
  intervalId = window.setInterval(async () => {
    console.log("Vérification de l'auth...");
    await authStore.initialize();
  }, 3000);
});

onUnmounted(() => {
  window.clearInterval(intervalId)
});


</script>

<template>
  <TresCanvas window-size clear-color="black" :antialias="false">
    <AccountRequestScene></AccountRequestScene>
  </TresCanvas>
  <div class="overlay-wrapper">
    <div class="overlay">
      <Logo class="logo" :long-version="true"></Logo>
      <div class="texts">
        <h3>Your account requires approval</h3>
        <h4>Please contact an administrator</h4>
      </div>
    </div>
  </div>
</template>

<style scoped>
.overlay-wrapper {
  width: 100vw;
  height: 100vh;
  position: fixed;
  padding: 0;
}

.overlay {
  display: flex;
  text-align: center;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
}

.texts {
  margin-bottom: 16vh;
  font-size: 24px;

  h4 {
    color: #a6a6a6;
  }
}

.logo {
  top: 0;
  margin: 0 auto 0 auto;
  width: 30%;
}
</style>