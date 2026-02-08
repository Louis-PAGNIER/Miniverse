<script setup lang="ts">
import Logo from "@/components/Logo.vue";
</script>

<template>
  <div class="logo-wrapper">
    <Logo class="logo" :long-version="true"></Logo>
  </div>
</template>

<style scoped>
.logo-wrapper {
  width: 100%;
  text-align: center;
}

.logo {
  width: 800px;
}
</style>