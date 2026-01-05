<script setup lang="ts">
import {IconDefinition} from "@fortawesome/free-brands-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {computed, useSlots} from "vue";

const props = withDefaults(defineProps<{
  severity?: "primary" | "secondary" | "success" | "danger" | "warning";
  icon?: string | IconDefinition
}>(), {
  severity: "secondary",
});

const slots = useSlots();

const hasSlot = computed(() => {
  const slot = slots.default?.();
  return slot && slot.length > 0;
});
</script>

<template>
  <button :class="severity">
    <font-awesome-icon v-if="icon" :icon="icon" :class="{ icon: true, 'icon-spaced': hasSlot }"></font-awesome-icon>
    <slot/>
  </button>
</template>

<style scoped>
button {
  padding: 6px 14px;
  border-radius: 8px;
  border: 1px solid var(--color-border);
  background: var(--color-background-primary);
  color: var(--color-primary);
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.85em;
  opacity: 0.99;

  .icon-spaced {
    margin-right: 5px;
  }

  &.secondary:hover {
    border-color: var(--color-primary);
  }

  &.primary {
    background: var(--color-primary);
    color: var(--color-background-secondary);
    border-color: transparent;

    &:hover {
      border-color: var(--color-background-secondary);
    }
  }

  &.success {
    background: var(--color-success);
    color: var(--color-primary);
    border-color: transparent;

    &:hover {
      border-color: var(--color-danger-tertiary) !important;
    }
  }

  &.danger {
    background: var(--color-danger);
    color: var(--color-primary);
    border-color: transparent;

    &:hover {
      border-color: var(--color-danger-tertiary) !important;
    }
  }

  &.warning {
    background: var(--color-warning);
    color: var(--color-primary);
    border-color: transparent;

    &:hover {
      border-color: var(--color-danger-tertiary) !important;
    }
  }
}
</style>