<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import Button from "@/components/ui/Button.vue";

const props = withDefaults(defineProps<{
  title?: string;
  closeOnOutsideClick: boolean;
  showFooter: boolean;
}>(), {
  closeOnOutsideClick: true,
  showFooter: true,
});

const show = defineModel<boolean>({ default: false });

const emit = defineEmits<{
  (e: "ok"): void;
  (e: "cancel"): void;
}>();

function close() {
  show.value = false;
  emit("cancel");
}

function confirm() {
  show.value = false;
  emit("ok");
}

const popupRef = ref<HTMLElement | null>(null);
function handleClickOutside(e: MouseEvent) {
  if ("buttons" in e && e.buttons !== 1) return; // consider only left mouse button clicks
  if (props.closeOnOutsideClick &&
      popupRef.value &&
      !popupRef.value.contains(e.target as Node)
  ) {
    close();
  }
}

defineExpose({ close, confirm });

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
            <Button @click="close">Cancel</Button>
            <Button @click="confirm">OK</Button>
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
  z-index: 16437346;
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
  font-size: 1.35em;
  font-weight: bold;
}

.popup-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 15px;
}
</style>
