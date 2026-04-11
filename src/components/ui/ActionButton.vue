<script setup lang="ts">
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {computed, useSlots} from "vue";
import {IconDefinition} from "@fortawesome/free-brands-svg-icons";

const props = defineProps<{
  icon?: string | IconDefinition;
  disabled?: boolean;
  severity?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'normal' | 'small'
}>();

const slots = useSlots();
const hasSlot = computed(() => {
  const slot = slots.default?.();
  return slot && slot.length > 0;
});
</script>

<template>
  <button
      class="button"
      :class="[severity, size, { disabled}]"
      :disabled="disabled"
  >
    <font-awesome-icon v-if="icon" :icon="icon" :class="{ icon: true, 'icon-spaced': hasSlot }"></font-awesome-icon>
    <span class="label"><slot/></span>
  </button>
</template>

<style scoped>
.button {
  display: inline-flex;
  align-self: flex-start;
  align-items: center;
  justify-content: center;
  gap: 2px;
  padding: 10px;
  border-radius: 8px;
  font-size: 1em;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s;
  margin: 4px 0;
  border: 1px solid var(--color-border);
  background: var(--color-background-accent);
  color: var(--color-primary);

  &.small {
    font-size: 0.85em;
    height: 30px;
    padding: 6px 14px;
  }

  &.disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &:hover {
    border-color: var(--color-primary);
  }

  &.primary {
    background-color: var(--color-background-secondary);
    color: white;

    &:hover:not(.disabled) {
      background-color: var(--color-background-tertiary);
    }
  }

  &.success {
    border-color: var(--color-success);
    color: var(--color-success);

    &:hover:not(.disabled) {
      border-color: var(--color-success-secondary);
      color: var(--color-success-secondary);
    }
  }

  &.warning {
    border-color: var(--color-warning);
    color: var(--color-warning);

    &:hover:not(.disabled) {
      border-color: var(--color-warning-secondary);
      color: var(--color-warning-secondary);
    }
  }

  &.danger {
    border-color: var(--color-danger);
    color: var(--color-danger);

    &:hover:not(.disabled) {
      border-color: var(--color-danger-secondary);
      color: var(--color-danger-secondary);
    }
  }

  &.info {
    border-color: var(--color-info);
    color: var(--color-info);

    &:hover:not(.disabled) {
      border-color: var(--color-info-secondary);
      color: var(--color-info-secondary);
    }
  }

  .icon {
    width: 1em;
    height: 1em;
    image-rendering: pixelated;
  }

  .label {
    line-height: 1;
  }
}
</style>