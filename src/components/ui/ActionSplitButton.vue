<script setup lang="ts">
import {onMounted, onUnmounted, ref} from "vue";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

export interface ActionItem {
  label: string
  icon?: string
  danger?: boolean
  onClick: () => void | Promise<void>
}

const props = defineProps<{
  primary: ActionItem
  secondary: ActionItem[]
  disabled?: boolean
}>();

const showOptions = ref(false);

function clickOutside(e: MouseEvent) {
  const target = e.target as HTMLElement;
  if (!target.closest(".options-container")) {
    showOptions.value = false;
  }
}

onMounted(() => {
  document.addEventListener("click", clickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", clickOutside);
});
</script>

<template>
  <div class="container" :class="{ disabled }">
    <!-- Primary -->
    <button
        class="primary"
        :class="{ danger: primary.danger }"
        :disabled="disabled"
        @click="primary.onClick"
    >
      <font-awesome-icon v-if="primary.icon" :icon='primary.icon' />

      <span class="label">{{ primary.label }}</span>
    </button>

    <!-- Secondary -->
    <div class="options-container" @click.stop>
      <button class="options" :disabled="disabled" @click="showOptions = !showOptions">
        <span class="ellipsis">...</span>
      </button>

      <div v-if="showOptions" class="popup">
        <button
            v-for="(action, i) in secondary"
            :key="i"
            :class="{ danger: action.danger }"
            @click="() => { showOptions = false; action.onClick() }"
        >
          <font-awesome-icon v-if="action.icon" :icon='action.icon' />
          <span class="label">
            {{ action.label }}
          </span>
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

    &.danger {
      background: var(--color-danger-secondary);
      color: var(--color-secondary);

      &:hover {
        background: var(--color-danger);
      }
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
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
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

        &.danger {
          color: var(--color-danger-secondary);

          &:hover {
            background: var(--color-danger-secondary);
            color: var(--color-secondary);
          }
        }
      }
    }
  }
}
</style>