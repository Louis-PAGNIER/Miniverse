<script setup lang="ts">
const props = defineProps<{
  icon?: string;
  disabled?: boolean;
  severity: 'primary' | 'success' | 'warning' | 'danger' | 'info';
}>();

const icons = import.meta.glob('@/assets/icons/*', { eager: true, import: 'default' })
</script>

<template>
  <button
      class="button"
      :class="[severity, { disabled }]"
      :disabled="disabled"
  >
    <img v-if="icon" :src="icons[`/src/assets/icons/${icon}`]" class="icon svg-primary" />
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
  border: none;
  border-radius: 8px;
  font-size: 1em;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;

  &.disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &.primary {
    background-color: var(--color-background-secondary);
    color: white;

    &:hover:not(.disabled) {
      background-color: var(--color-background-tertiary);
    }
  }

  &.success {
    background-color: var(--color-success);
    color: white;

    &:hover:not(.disabled) {
      background-color: var(--color-success-secondary);
    }
  }

  &.warning {
    background-color: var(--color-warning);
    color: white;

    &:hover:not(.disabled) {
      background-color: var(--color-warning-secondary);
    }
  }

  &.danger {
    background-color: var(--color-danger);
    color: white;

    &:hover:not(.disabled) {
      background-color: var(--color-danger-secondary);
    }
  }

  &.info {
    background-color: var(--color-info);
    color: white;

    &:hover:not(.disabled) {
      background-color: var(--color-info-secondary);
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