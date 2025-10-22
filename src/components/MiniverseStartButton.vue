<script setup lang="ts">

import {Miniverse} from "@/models/miniverse";
import {computed, onMounted, onUnmounted, ref, Ref, watch} from "vue";
import {apiDeleteMiniverse, apiRestartMiniverse, apiStartMiniverse, apiStopMiniverse} from "@/api/miniverse";
import MessagePopup from "@/components/popups/MessagePopup.vue";
import {useRouter} from "vue-router";

const stopping: Ref<boolean> = ref(false);
const starting: Ref<boolean> = ref(false);
const showOptions = ref(false);
const showDeletePopup = ref(false);

const props = defineProps<{
  miniverse: Miniverse
}>();

const router = useRouter();

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

async function restartMiniverse() {
  showOptions.value = false;
  if (stopping.value || starting.value) return;
  starting.value = true;
  await apiRestartMiniverse(props.miniverse.id);
}

async function deleteMiniverse() {
  showDeletePopup.value = false;
  await apiDeleteMiniverse(props.miniverse.id);
  await router.push("/")
}

async function showDeleteMiniversePopup() {
  showOptions.value = false;
  showDeletePopup.value = true;
}

function clickEvent(e: PointerEvent) {
  const target = e.target as HTMLElement;
  if (!target.closest(".options-container")) {
    showOptions.value = false;
  }
}

onMounted(() => {
  watch(() => props.miniverse.started, (newVal) => {
    if (!newVal && stopping.value) {
      stopping.value = false;
    } else if (newVal && starting.value) {
      starting.value = false;
    }
  });

  document.addEventListener('click', clickEvent);
});

onUnmounted(() => {
  document.removeEventListener('click', clickEvent);
});
</script>

<template>
<MessagePopup v-model="showDeletePopup" title="Delete Miniverse ?" @ok="deleteMiniverse"
              severity="danger" primary-button-text="Delete">
  Are you sure you want to delete miniverse ?
</MessagePopup>
<div class="container" :class="{ disabled: starting || stopping }">
  <button class="primary" :class="{ danger: started }" @click="started ? stopMiniverse() : startMiniverse()">
    <img v-if="started" class="icon svg-primary" src="@/assets/icons/stop.svg">
    <img v-else class="icon svg-green" src="@/assets/icons/play.svg">
    <span class="label">{{ started ? 'Stop' : 'Start' }}</span>
  </button>

  <div class="options-container" @click.stop>
    <button class="options" @click="showOptions = !showOptions">
      <span class="ellipsis">...</span>
    </button>

    <div v-if="showOptions" class="popup">
      <button @click="restartMiniverse">
        <img class="icon svg-primary" src="@/assets/icons/restart.svg">
        <span class="label">Restart</span>
      </button>
      <button @click="showDeleteMiniversePopup">
        <img class="icon svg-red" src="@/assets/icons/delete.svg">
        <span class="label danger">Delete</span>
      </button>
    </div>
  </div>
</div>
</template>

<style scoped>
.container {
  width: 135px;
  height: 40px;
  display: flex;
  flex-direction: row;
  gap: 2px;
  user-select: none;
  -webkit-user-select: none;

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

  .primary {
    flex: 1;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    border-radius: 10px 0 0 10px;

    .icon {
      width: 30px;
    }

    .label {
      margin-left: 5px;
    }
  }

  .options-container {
    position: relative;
    height: 100%;

    .options {
      width: 40px;
      height: 100%;
      border-radius: 0 10px 10px 0;

      .ellipsis {
        display: flex;
        justify-content: center;
        font-size: 1.75em;
        margin-top: -20px;
        margin-left: -1px;
      }
    }

    .popup {
      position: absolute;
      top: 100%;
      right: 0;
      background: var(--color-background-secondary);
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.4);
      display: flex;
      flex-direction: column;
      min-width: 135px;
      z-index: 10;
      overflow: hidden;

      button {
        width: 100%;
        text-align: left;
        padding: 8px 12px;
        background: none;
        border: none;
        cursor: pointer;
        font-size: 0.9em;
        display: flex;
        gap: 10px;

        &:hover {
          background: var(--color-background-tertiary);
        }

        .icon {
          width: 15px;
        }

        .label.danger {
          color: var(--color-danger-secondary);
        }
      }
    }
  }
}
</style>