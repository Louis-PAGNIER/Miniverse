<script setup>
import {useAuthStore} from "@/stores/authStore.js";

const auth = useAuthStore();
auth.initialize();
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
