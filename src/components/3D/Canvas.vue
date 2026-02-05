<script setup lang="ts">
import {TresCanvas} from "@tresjs/core";
import MiniversesListDisplay from "@/components/3D/MiniversesListDisplay.vue";
import {computed, provide, ref, ShallowRef, shallowRef, watch} from "vue";
import MiniverseSheet from "@/components/miniverse-sheet/MiniverseSheet.vue";
import AddMiniversePopup from "@/components/popups/AddMiniversePopup.vue";
import {useRoute, useRouter} from "vue-router";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {faGear, faPlus} from "@fortawesome/free-solid-svg-icons";
import {faUser} from "@fortawesome/free-regular-svg-icons";
import Settings from "@/pages/Settings.vue";

const router = useRouter();
const route = useRoute();

const systemRef: ShallowRef = shallowRef(null);
const focusedMiniverse = computed(() => systemRef.value?.focusedMiniverse?.miniverse);
const showAddMiniversePopup = ref<boolean>(false);

const handleMiniverseOverlayClick = (event: MouseEvent) => {
  if (focusedMiniverse.value && event.target?.className === "miniverse-sheet-page-overlay") {
    router.push("/");
  }
};

const handleSettingsOverlayClick = (event: MouseEvent) => {
  if (isSettingsRoute.value && event.target?.className === "settings-overlay") {
    router.push("/");
  }
};

const isSettingsRoute = computed(() => {
  return route.matched.some(record => record.path === '/settings');
});

const currentViewMode = computed(() => {
  if (isSettingsRoute.value) return 'settings';
  if (focusedMiniverse.value) return 'focus';
  return 'home';
});

watch([currentViewMode, systemRef], ([newMode, system], [oldMode, oldSystem]) => {
  if (!system?.manager) return;
  const isFirstMount = !oldSystem;
  const shouldAnimate = !isFirstMount;
  system.manager.setViewMode(newMode, shouldAnimate);
}, { immediate: true });

const openNewMiniverseDialog = () => {
  showAddMiniversePopup.value = true;
};

provide('miniverse', focusedMiniverse);
</script>

<template>
  <TresCanvas window-size clear-color="black" :antialias="false">
    <MiniversesListDisplay ref="systemRef" :router="router" :route="route"></MiniversesListDisplay>
  </TresCanvas>
  <div id="overlays-wrapper">
    <transition name="fade">
      <div class="main-overlay-wrapper" v-if="focusedMiniverse" @click="handleMiniverseOverlayClick($event)">
        <div class="miniverse-sheet-page-overlay">
          <MiniverseSheet>
            <router-view />
          </MiniverseSheet>
        </div>
      </div>
    </transition>

    <transition name="fade-right">
      <div class="main-overlay-wrapper" v-if="isSettingsRoute" @click="handleSettingsOverlayClick($event)">
        <div class="settings-overlay">
          <Settings />
        </div>
      </div>
    </transition>

    <div class="header">
      <img class="logo" src="@/assets/miniverse-logo-long.png" @click="router.push('/')" />

      <div class="spacer"></div>

      <button class="overlay-button" @click="openNewMiniverseDialog">
        <font-awesome-icon :icon="faPlus"></font-awesome-icon>
      </button>

      <router-link class="button" to="/settings/account">
        <button class="overlay-button">
          <font-awesome-icon :icon="faUser"></font-awesome-icon>
        </button>
      </router-link>

      <router-link class="button" to="/settings">
        <button class="overlay-button">
          <font-awesome-icon :icon="faGear"></font-awesome-icon>
        </button>
      </router-link>
    </div>
  </div>

  <AddMiniversePopup v-model="showAddMiniversePopup"/>
</template>

<style scoped>
#overlays-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  cursor: auto;
  pointer-events: none;
  z-index: 999999999;
}

.main-overlay-wrapper {
  position: absolute;
  width: 100vw;
  height: 100vh;
  -ms-overflow-style: none;
  scrollbar-width: none;
  overflow-y: scroll;
}

.miniverse-sheet-page-overlay {
  width: 100%;
  height: auto;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding-top: 25vh;
  cursor: auto;
  pointer-events: all;

  &::-webkit-scrollbar {
    display: none;
  }
}

.settings-overlay {
  position: absolute;
  width: 100%;
  height: 100%;
  cursor: auto;
  pointer-events: all;
}

.header {
  pointer-events: none;
  margin: 1em;
  height: 4em;
  display: flex;
  align-items: center;
  justify-content: right;
  position: absolute;
  left: 0;
  right: 0;
}

.spacer {
  flex: 1;
}

.overlay-button {
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-background-primary);
  border: var(--color-border) 1px solid;;
  color: var(--color-secondary);
  font-size: 1em;
  margin: 0.5em;
  width: 3.5em;
  height: 3.5em;
  outline: none;
  border-radius: 5px;
  cursor: pointer;
  opacity: 0.8;
  pointer-events: all;

  &:hover {
    background: var(--color-background-secondary);
  }

  &:active {
    opacity: 1;
  }

  svg {
    scale: 1.2;
  }
}

.logo {
  width: 200px;
  cursor: pointer;
  pointer-events: all;
  transition: 0.1s;

  &:hover {
    scale: 1.05;
  }
}
</style>