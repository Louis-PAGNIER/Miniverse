<script setup lang="ts">
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

const props = withDefaults(defineProps<{
  icon: string;
  disabled?: boolean;
  severity?: string;
}>(), {
  disabled: false,
  severity: 'success'
});
</script>

<template>
<button :disabled="disabled" :class="[severity, {disabled}]">
  <font-awesome-icon :icon='icon' />
</button>
</template>

<style scoped>
button {
  background: none;
  outline: none;
  border: none;
  border-radius: 500px;
  font-size: 1em;
  cursor: pointer;

  width: 2.5em;
  height: 2.5em;
  color: var(--color-primary);
  transition: 0.2s;

  &:disabled {
    cursor: not-allowed;
    background: none;
    color: var(--color-secondary) !important;
  }

  &:hover {
    color: black;
  }
}
</style>