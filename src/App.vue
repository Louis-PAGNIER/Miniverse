<script setup lang="ts">
import {useAuthStore} from "@/stores/authStore";
import {useMiniverseStore} from "@/stores/miniverseStore";
import ToastContainer from "@/components/ToastContainer.vue";

const auth = useAuthStore();
const miniverseStore = useMiniverseStore();

auth.initialize().then(() => {
  miniverseStore.fetchAll();
  miniverseStore.connectWebSocket();
});
</script>

<template>
  <router-view></router-view>
  <ToastContainer />
</template>

<style>
html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
}

#app {
  height: 100%;
  width: 100%;
  background-color: #000;
  position: static !important;
  margin: 0 auto;
  padding: 1rem;
  font-weight: normal;
}
</style>
