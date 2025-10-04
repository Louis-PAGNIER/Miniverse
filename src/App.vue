<script setup lang="ts">
import {useAuthStore} from "@/stores/authStore";
import {useMiniverseStore} from "@/stores/miniverseStore";

const auth = useAuthStore();
auth.initialize();
console.log("Auth initialized");

const miniverseStore = useMiniverseStore();
miniverseStore.fetchMiniverses().then(() => {
  miniverseStore.fetchPlayers();
});
miniverseStore.connectWebSocket();
miniverseStore.closeWebSocket();
</script>

<template>
  <router-view></router-view>
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
}
</style>
