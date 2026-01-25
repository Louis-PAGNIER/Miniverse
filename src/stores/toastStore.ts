import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Toast, ToastType } from "@/models/toast";

export const useToastStore = defineStore('toast', () => {
  const toasts = ref<Toast[]>([]);

  const addToast = (title: string, message: string, type: ToastType = 'info', duration: number | null = 3000): string => {
    const id = window.crypto.randomUUID();

    const newToast: Toast = { id, title, message, type, duration };
    toasts.value.push(newToast);

    if (duration != undefined) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  };

  const removeToast = (id: string) => {
    toasts.value = toasts.value.filter((t) => t.id !== id);
  };

  return { toasts, addToast, removeToast };
});