<script setup lang="ts">
const props = defineProps<{
  label: string;
  disabled?: boolean;
}>();

const checked = defineModel<boolean>({ default: false });

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();

function toggle() {
  if (props.disabled) return;
  checked.value = !checked.value;
}
</script>

<template>
  <div class="custom-checkbox" :class="{'disabled': disabled}" @click="toggle">
    <input
        type="checkbox"
        :checked="checked"
        :class="{'disabled': disabled}"
        @change="toggle"
        class="hidden-checkbox"
    />
    <div class="checkbox-box" :class="{ checked }">
      <svg v-if="checked" viewBox="0 0 24 24" class="checkmark">
        <path d="M20 6L9 17l-5-5" fill="none" stroke="currentColor" stroke-width="2" />
      </svg>
    </div>
    <label class="checkbox-label" :class="{'disabled': disabled}">{{ label }}</label>
  </div>
</template>

<style scoped>
.custom-checkbox {
  display: flex;
  align-items: center;
  cursor: pointer;
  gap: 10px;
  user-select: none;
  font-size: 0.9em;
  color: var(--color-primary);
  transition: color 0.2s;
  margin: 5px 0;

  &.disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

.custom-checkbox:hover .checkbox-box {
  border-color: var(--color-primary);
}

.hidden-checkbox {
  display: none;
}

.checkbox-box {
  width: 20px;
  height: 20px;
  border: 1px solid var(--color-border);
  border-radius: 5px;
  background: var(--color-background-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.checkbox-box.checked {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: var(--color-background-secondary);
}

.checkmark {
  width: 14px;
  height: 14px;
}

.checkbox-label {
  cursor: pointer;

  &.disabled {
    cursor: not-allowed;
  }
}
</style>