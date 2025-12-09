<script setup lang="ts">
import BasePopup from "./BasePopup.vue";
import Button from "@/components/ui/Button.vue";
import {ref} from "vue";

const popupRef = ref<InstanceType<typeof BasePopup> | null>(null);
const props = withDefaults(defineProps<{
  title: string;
  severity?: "primary" | "secondary" | "success" | "danger" | "warning";
  primaryButtonText?: string;
  secondaryButtonText?: string;
}>(), {
  severity: 'primary',
  primaryButtonText: 'OK',
  secondaryButtonText: 'Cancel',
});

const show = defineModel<boolean>({ default: false });

const emit = defineEmits<{
  (e: "ok"): void;
  (e: "cancel"): void;
}>();
</script>

<template>
  <BasePopup
      ref="popupRef"
      v-model="show"
      :title="title"
      show-footer
      close-on-outside-click
      @ok="emit('ok')"
      @cancel="emit('cancel')"
  >
    <p><slot></slot></p>
    <template #footer>
      <Button @click="popupRef?.close">Cancel</Button>
      <Button :severity="severity" @click="popupRef?.confirm">{{ primaryButtonText }}</Button>
    </template>
  </BasePopup>
</template>