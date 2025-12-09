<script setup lang="ts">
import { watch } from "vue";

const model = defineModel<string>({ default: "" });

interface Props {
  debounce?: number;
}
const props = defineProps<Props>();

const emit = defineEmits<{
  (e: "change", value: string): void;
}>();

let timeout: number | null = null;

function triggerNow() {
  if (timeout) {
    clearTimeout(timeout);
    timeout = null;
  }
  emit("change", model.value);
}

watch(model, (newValue) => {
  const delay = props.debounce ?? 0;

  if (delay > 0) {
    if (timeout) clearTimeout(timeout);
    timeout = window.setTimeout(() => {
      emit("change", newValue);
    }, delay);
  } else {
    emit("change", newValue);
  }
});

function onKeydown(e: KeyboardEvent) {
  if (e.key === "Enter") {
    triggerNow();
  }
}
</script>

<template>
  <input
      v-model="model"
      type="text"
      placeholder="Search mod..."
      @keydown="onKeydown"
  />
</template>

<style scoped>
input {
  color: var(--color-secondary);
  background: var(--color-background-secondary);
  outline: none;
  padding: 8px;
  width: 100%;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  font-size: 0.95em;
  transition: 0.2s;

  &:focus {
    border-color: var(--color-secondary);
  }
}
</style>
