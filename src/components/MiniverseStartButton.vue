<script setup lang="ts">

import {Miniverse} from "@/models/miniverse";
import {computed, onMounted, ref, Ref, watch} from "vue";
import {apiStartMiniverse, apiStopMiniverse} from "@/api/miniverse";

let stopping: Ref<boolean> = ref(false);
let starting: Ref<boolean> = ref(false);

const props = defineProps<{
  miniverse: Miniverse
}>();

const started = computed(() => props.miniverse.started);

async function startMiniverse() {
  if (starting.value) return;
  starting.value = true;
  await apiStartMiniverse(props.miniverse.id);
}

async function stopMiniverse() {
  if (stopping.value) return;
  stopping.value = true;
  await apiStopMiniverse(props.miniverse.id);
}

onMounted(() => {
  watch(() => props.miniverse.started, (newVal) => {
    if (!newVal && stopping.value) {
      stopping.value = false;
    } else if (newVal && starting.value) {
      starting.value = false;
    }
  });
});
</script>

<template>
<div class="container" :class="{ disabled: starting || stopping }">
  <button class="primary" :class="{ danger: started }" @click="started ? stopMiniverse() : startMiniverse()">
    <img v-if="started" class="icon svg-primary" src="@/assets/icons/stop.svg">
    <img v-else class="icon svg-green" src="@/assets/icons/play.svg">
    <span class="label">{{ started ? 'Stop' : 'Start' }}</span>
  </button>
  <button class="options">
    <span class="label">
      ...
    </span>
  </button>
</div>
</template>

<style scoped>
.container {
  width: 135px;
  display: flex;
  flex-direction: row;
  gap: 2px;

  &.disabled {
    opacity: 0.6;
    cursor: not-allowed !important;
  }

  button {
    background: none;
    border: none;
    outline: none;
    font-size: inherit;
    padding: 7px;
    cursor: pointer;

    background: var(--color-background-secondary);
    color: var(--color-tertiary);

    &:hover {
      background: var(--color-background-tertiary);
    }

    &.danger {
      background: var(--color-danger);
      color: var(--color-primary);

      &:hover {
        background: var(--color-danger-secondary);
      }
    }
  }

  .icon {
    width: 30px;
  }

  .primary {
    flex: 1;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    border-radius: 10px 0 0 10px;

    .label {
      margin-left: 5px;
    }
  }

  .options {
    width: 40px;
    border-radius: 0 10px 10px 0;

    .label {
      display: flex;
      justify-content: center;
      font-size: 1.75em;
      margin-top: -20px;
      margin-left: -1px;
    }
  }
}
</style>