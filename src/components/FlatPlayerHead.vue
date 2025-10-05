<script setup lang="ts">
import {computed} from "vue";

const props = defineProps<{
  username: string;
}>();

const MINESKIN_BASE_URL = "https://mineskin.eu/helm/";
const skinUrl = computed(() => `${MINESKIN_BASE_URL}/${props.username}`);
</script>

<template>
  <img :src="skinUrl" :alt="`${username} player head`" />
</template>

<style scoped>
img {
  aspect-ratio: 1 / 1;
  image-rendering: pixelated;
  border-radius: 15%;
  max-width: 100%;
  max-height: 100%;
}
</style>