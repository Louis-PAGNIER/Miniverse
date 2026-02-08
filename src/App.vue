<script setup lang="ts">
import {useAuthStore} from "@/stores/authStore";
import {useMiniverseStore} from "@/stores/miniverseStore";
import ToastContainer from "@/components/ToastContainer.vue";
import UploadContainer from "@/components/UploadContainer.vue";

const auth = useAuthStore();
const miniverseStore = useMiniverseStore();

auth.initialize().then(() => {
  miniverseStore.fetchAll();
  miniverseStore.connectWebSocket();
});
</script>

<template>
  <router-view></router-view>
  <div class="container">
    <ToastContainer/>
    <UploadContainer/>
  </div>
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

.container {
  position: fixed;
  top: 5.3em;
  right: 1.4em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  z-index: 1000000000;
}

</style>
