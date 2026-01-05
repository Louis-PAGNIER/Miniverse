<script setup lang="ts">
import { ref } from "vue";

const props = defineProps<{
  modelValue?: string;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

const value = ref(props.modelValue || "");
</script>

<template>
  <div class="custom-input" :class="{ 'disabled': disabled }">
    <input
        type="text"
        v-model="value"
        @input="emit('update:modelValue', value)"
        :placeholder="placeholder || 'Enter text...'"
        :disabled="disabled"
        class="input-field"
        :class="{ 'error': error }"
    />
  </div>
</template>

<style scoped>
.custom-input {
  position: relative;
  width: 250px;
  height: 40px;
  margin: 5px 0;
  user-select: none;
}
.custom-input.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.input-field {
  width: 100%;
  border: 1px solid var(--color-border);
  background: var(--color-background-secondary);
  border-radius: 8px;
  padding: 0 12px;
  height: 100%;
  color: var(--color-primary);
  outline: none;
  transition: border-color 0.2s;
  font-size: 1em;
}
.input-field.error {
  border-color: indianred !important;
  color: indianred !important;
  /* Placeholder also red*/
  &::placeholder {
    color: indianred !important;
  }
}
.input-field:hover:not(:disabled) {
  border-color: var(--color-primary);
}
.input-field:focus {
  border-color: var(--color-primary);
}
.input-field:disabled {
  cursor: not-allowed;
  pointer-events: none;
}
</style>
