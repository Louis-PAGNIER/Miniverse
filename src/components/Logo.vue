<script setup lang="ts">
import logoUrl from "@/assets/logo.svg";
import longLogoUrl from "@/assets/logo-long.svg";

const props = defineProps<{
  longVersion: boolean
}>();
</script>

<template>
  <object :data="longVersion ? longLogoUrl : logoUrl" type="image/svg+xml"></object>
</template>

<style scoped>

</style>