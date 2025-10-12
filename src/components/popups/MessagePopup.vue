<script setup lang="ts">
import BasePopup from "./BasePopup.vue";

const props = defineProps<{
  show: boolean;
  title: string;
  message: string;
}>();

const emit = defineEmits<{
  (e: "update:show", value: boolean): void;
  (e: "ok"): void;
  (e: "cancel"): void;
}>();
</script>

<template>
  <BasePopup
      :show="show"
      :title="title"
      show-footer
      @update:show="emit('update:show', $event)"
      @ok="emit('ok')"
      @cancel="emit('cancel')"
  >
    <p>{{ message }}</p>
  </BasePopup>
</template>