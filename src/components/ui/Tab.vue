<script setup lang="ts">
defineProps<{
  active: boolean;
}>();
</script>

<template>
  <button :class="['tab-btn', { active }]">
    <slot></slot>
  </button>
</template>

<style scoped>
.tab-btn {
  padding: 10px 14px;
  border: 1px solid var(--color-border);
  max-width: 300px;
  width: 100%;
  border-radius: 8px;
  background: var(--color-background-primary);
  color: var(--color-primary);
  cursor: pointer;
  transition: all 0.2s;
  font-size: 1em;
}

.tab-btn.active {
  background: var(--color-background-secondary);
}

.tab-btn:hover {
  border-color: var(--color-secondary);
}
</style>