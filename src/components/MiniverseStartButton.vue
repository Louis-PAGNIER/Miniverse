<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRouter } from "vue-router";
import ActionSplitButton, {ActionItem} from "@/components/ui/ActionSplitButton.vue";
import {
  apiStartMiniverse,
  apiStopMiniverse,
  apiRestartMiniverse,
  apiDeleteMiniverse
} from "@/api/miniverse";
import MessagePopup from "@/components/popups/MessagePopup.vue";
import { Miniverse } from "@/models/miniverse";

const props = defineProps<{ miniverse: Miniverse }>();

const router = useRouter();
const starting = ref(false);
const stopping = ref(false);
const showDeletePopup = ref(false);

const started = computed(() => props.miniverse.started);

watch(started, (val) => {
  if (!val) stopping.value = false;
  if (val) starting.value = false;
});

const primaryAction = computed<ActionItem>(() => ({
  label: started.value ? "Stop" : "Start",
  icon: started.value
      ? "stop"
      : "play",
  danger: started.value,
  onClick: async () => {
    if (starting.value || stopping.value) return;
    if (started.value) {
      stopping.value = true;
      await apiStopMiniverse(props.miniverse.id);
    } else {
      starting.value = true;
      await apiStartMiniverse(props.miniverse.id);
    }
  }
}));

const secondaryActions = computed<ActionItem[]>(() => [
  {
    label: "Restart",
    icon: "rotate-left",
    onClick: async () => {
      starting.value = true;
      await apiRestartMiniverse(props.miniverse.id);
    }
  },
  {
    label: "Delete",
    icon: "trash",
    danger: true,
    onClick: () => {
      showDeletePopup.value = true;
    }
  }
]);

async function deleteMiniverse() {
  showDeletePopup.value = false;
  await apiDeleteMiniverse(props.miniverse.id);
  router.push("/");
}
</script>

<template>
  <MessagePopup
      v-model="showDeletePopup"
      title="Delete Miniverse ?"
      severity="danger"
      primary-button-text="Delete"
      @ok="deleteMiniverse"
  >
    Are you sure you want to delete miniverse ?
  </MessagePopup>

  <ActionSplitButton
      :primary="primaryAction"
      :secondary="secondaryActions"
      :disabled="starting || stopping"
  />
</template>
