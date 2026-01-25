<script setup lang="ts">
import { useToastStore } from "@/stores/toastStore";

const store = useToastStore();
</script>

<template>
  <div class="toast-container" aria-live="polite">
    <TransitionGroup name="toast-list">
      <div
          v-for="toast in store.toasts"
          :key="toast.id"
          :class="['toast-item', toast.type]"
      >
        <span class="title">{{ toast.title }}</span>
        <span class="message">{{ toast.message }}</span>
        <button @click="store.removeToast(toast.id)" class="close-btn">&times;</button>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toast-container {
  position: fixed;
  top: 5.3em;
  right: 1.4em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  z-index: 100;
}

.toast-item {
  display: flex;
  position: relative;
  flex-direction: column;
  text-align: left;
  align-items: center;
  padding: 0.5em 2.5em 0.5em 0.5em;
  border-radius: 8px;
  width: 280px;
  box-shadow: 0 4px 17px rgba(255, 255, 255, 0.15);
  color: var(--color-primary);
  font-weight: 500;
  border: 1px solid rgba(255, 255, 255, 0.4);

  .message, .title {
    width: 100%;
  }

  .title {
    font-size: 1.25em;
    font-weight: bold;
  }

  .close-btn {
    position: absolute;
    background: rgba(255, 255, 255, 0.7);
    right: 1em;
    top: 1em;
    border-radius: 500px;
    outline: none;
    border: none;
    transition: 0.1s;

    &:hover {
      scale: 1.1;
    }
  }
}

.toast-list-enter-from { opacity: 0; transform: translateY(20px); }
.toast-list-leave-to { opacity: 0; transform: scale(0.9); }
.toast-list-enter-active, .toast-list-leave-active { transition: all 0.3s ease; }
</style>