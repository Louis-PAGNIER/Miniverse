<script setup lang="ts">
defineProps<{
  vertical?: boolean
}>();
</script>

<template>
  <div class="divider" :class="{ 'is-vertical': vertical }"></div>
</template>

<style scoped>
.divider {
  background-color: var(--color-border);
  border: none;
}

.divider:not(.is-vertical) {
  width: 100%;
  height: 1px;
  margin: 20px 0;
}

.divider.is-vertical {
  width: 1px;
  height: auto;
  align-self: stretch;
  margin: 0 20px;
}
</style>