<script setup lang="ts">
import BasePopup from "./BasePopup.vue";
import OverlayButton from "@/components/ui/OverlayButton.vue";
import {onMounted, ref, watch} from "vue";
import Input from "@/components/ui/Input.vue";

const popupRef = ref<InstanceType<typeof BasePopup> | null>(null);
const inputRef = ref<InstanceType<typeof Input> | null>(null);

const props = withDefaults(defineProps<{
  title: string;
  severity?: "primary" | "secondary" | "success" | "danger" | "warning";
  defaultValue?: string;
  placeholder?: string;
  primaryButtonText?: string;
  secondaryButtonText?: string;
}>(), {
  severity: 'primary',
  primaryButtonText: 'OK',
  secondaryButtonText: 'Cancel',
  placeholder: '',
});

const show = defineModel<boolean>({ default: false });
const value = ref<string>("");

const emit = defineEmits<{
  (e: "ok", value: string): void;
  (e: "cancel"): void;
}>();

watch(show, (newVal, oldVal) => {
  if (newVal) {
    value.value = props.defaultValue ?? '';

    setTimeout(() => {
      inputRef.value?.focus();
    }, 5)
  }
}, { immediate: true });
</script>

<template>
  <BasePopup
      ref="popupRef"
      v-model="show"
      :title="title"
      show-footer
      close-on-outside-click
      @ok="emit('ok', value)"
      @cancel="emit('cancel')"
  >
    <Input ref="inputRef" style="width: 100%" v-model="value" :placeholder="placeholder"></Input>
    <template #footer>
      <OverlayButton @click="popupRef?.close">Cancel</OverlayButton>
      <OverlayButton :severity="severity" @click="popupRef?.confirm">{{ primaryButtonText }}</OverlayButton>
    </template>
  </BasePopup>
</template>