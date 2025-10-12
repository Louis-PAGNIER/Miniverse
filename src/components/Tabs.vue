<script setup lang="ts">
import { defineProps, defineEmits, useSlots, computed } from "vue";

const props = defineProps<{
  modelValue: string;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

const slots = useSlots();

const tabList = computed(() => {
  const tabSlot = slots.tabs?.();
  if (!tabSlot) return [];
  return tabSlot
      .map(vnode => vnode.props && { name: vnode.props.name, label: vnode.props.label })
      .filter(Boolean) as { name: string; label: string }[];
});

function selectTab(name: string) {
  emit("update:modelValue", name);
}
</script>

<template>
  <div class="tabs-container">
    <div class="tabs-header">
      <button
          v-for="tab in tabList"
          :key="tab.name"
          :class="['tab-btn', { active: tab.name === modelValue }]"
          @click="selectTab(tab.name)"
      >
        {{ tab.label }}
      </button>
    </div>

    <transition name="fade-slide" mode="out-in">
      <div :key="modelValue">
        <slot :name="modelValue" />
      </div>
    </transition>
  </div>
</template>

<style scoped>
.tabs-container {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.tabs-header {
  display: flex;
  gap: 16px;
  margin-bottom: 10px;
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 6px;
  justify-content: center;
}

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
  border-bottom-color: var(--color-background-secondary);
  color: var(--color-primary);
  font-weight: 500;
}

.tab-btn:hover {
  border-color: var(--color-primary);
}

/* --- Transition entre onglets --- */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.25s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(6px);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
