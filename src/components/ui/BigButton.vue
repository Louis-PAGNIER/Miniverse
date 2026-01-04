<script setup lang="ts">
const props = defineProps<{
  severity?: string
}>();

</script>

<template>
<button :class="severity">
  <slot></slot>
</button>
</template>

<style scoped>
button {
  font-size: 1.35em;
  font-weight: 500;
  height: 2em;
  display: flex;
  align-items: center;
  justify-content: center;

  color: var(--color-primary);
  outline: none;
  border: none;
  border-radius: 10px;

  cursor: pointer;
}
</style>