<script setup lang="ts">
import { RouteLocationRaw } from 'vue-router';

defineProps<{
  tabs: {
    label: string;
    to: RouteLocationRaw;
  }[]
}>();
</script>

<template>
  <nav class="nav-tabs">
    <router-link
        v-for="tab in tabs"
        :key="tab.label"
        :to="tab.to"
        class="tab-item"
        active-class="is-active"
    >
      {{ tab.label }}
    </router-link>
  </nav>
</template>

<style scoped>
.nav-tabs {
  display: flex;
  gap: 16px;
  margin-bottom: 10px;
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 6px;
  justify-content: center;
}

.tab-item {
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
  text-align: center;
  text-decoration: none;

  &:hover {
    border-color: var(--color-secondary);
  }

  &.router-link-exact-active {
    background: var(--color-background-secondary);
  }
}
</style>
