<script setup lang="ts">
import { ref, defineProps, defineEmits, onMounted, onUnmounted } from "vue";

const props = defineProps<{
  show: boolean;
  title?: string;
  closeOnOutsideClick?: boolean;
  showFooter?: boolean;
}>();

const emit = defineEmits<{
  (e: "update:show", value: boolean): void;
  (e: "ok"): void;
  (e: "cancel"): void;
}>();

function close() {
  emit("update:show", false);
  emit("cancel");
}

function confirm() {
  emit("ok");
  emit("update:show", false);
}

const popupRef = ref<HTMLElement | null>(null);
function handleClickOutside(e: MouseEvent) {
  if (
      props.closeOnOutsideClick !== false && popupRef.value &&
      !popupRef.value.contains(e.target as Node)
  ) {
    close();
  }
}

onMounted(() => document.addEventListener("mousedown", handleClickOutside));
onUnmounted(() => document.removeEventListener("mousedown", handleClickOutside));
</script>

<template>
  <transition name="fade">
    <div v-if="show" class="popup-overlay">
      <div class="popup" ref="popupRef">
        <header v-if="title" class="popup-header">
          <h3 class="popup-title">{{ title }}</h3>
        </header>

        <div class="popup-content">
          <slot />
        </div>

        <footer v-if="showFooter" class="popup-actions">
          <slot name="footer">
            <button class="btn cancel" @click="close">Cancel</button>
            <button class="btn ok" @click="confirm">OK</button>
          </slot>
        </footer>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.popup-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.popup {
  background: var(--color-background-secondary);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
  padding: 20px;
  width: 340px;
  max-width: 90%;
  display: flex;
  flex-direction: column;
  color: var(--color-primary);
}

.popup-title {
  margin: 0 0 10px 0;
  font-size: 1.1em;
  font-weight: bold;
}

.popup-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 15px;
}

.btn {
  padding: 6px 14px;
  border-radius: 8px;
  border: 1px solid var(--color-border);
  background: var(--color-background-primary);
  color: var(--color-primary);
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.85em;
}

.btn:hover {
  border-color: var(--color-primary);
}

.btn.ok {
  background: var(--color-primary);
  color: var(--color-background-secondary);
  border-color: var(--color-primary);
}

.btn.ok:hover {
  opacity: 0.9;
}
</style>
