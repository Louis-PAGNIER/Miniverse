<script setup lang="ts">
import {TresCanvas} from "@tresjs/core";
import MiniversesListDisplay from "@/components/3D/MiniversesListDisplay.vue";
import {computed, provide, ref, ShallowRef, shallowRef} from "vue";
import MiniverseSheet from "@/components/miniverse-sheet/MiniverseSheet.vue";
import AddMiniversePopup from "@/components/popups/AddMiniversePopup.vue";
import {useRoute, useRouter} from "vue-router";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {faGear, faPlus} from "@fortawesome/free-solid-svg-icons";
import {faUser} from "@fortawesome/free-regular-svg-icons";

const router = useRouter();
const route = useRoute();

const systemRef: ShallowRef = shallowRef(null);
const focusedMiniverse = computed(() => systemRef.value?.focusedMiniverse?.miniverse);
const showAddMiniversePopup = ref<boolean>(false);

const handleOverlayClick = (event: MouseEvent) => {
  if (focusedMiniverse.value && event.target?.id === "main-overlay") {
    router.push("/");
  }
};

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
    <div class="header">
      <span class="logo">Miniverse</span>

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

    <transition name="fade">
      <div id="main-overlay-wrapper" v-if="focusedMiniverse" @click="handleOverlayClick($event)">
        <div id="main-overlay">
          <MiniverseSheet>
            <router-view />
          </MiniverseSheet>
        </div>
      </div>
    </transition>
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
}

#main-overlay-wrapper {
  width: 100vw;
  height: 100vh;
  -ms-overflow-style: none;
  scrollbar-width: none;
  overflow-y: scroll;
}

#main-overlay {
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

.header {
  pointer-events: all;
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
</style>