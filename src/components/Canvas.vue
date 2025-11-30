<script setup lang="ts">

import {TresCanvas} from "@tresjs/core";
import System from "@/components/System.vue";
import {computed, ref, ShallowRef, shallowRef} from "vue";
import MiniverseSheet from "@/components/MiniverseSheet/MiniverseSheet.vue";
import AddMiniversePopup from "@/components/popups/AddMiniversePopup.vue";
import {useRoute, useRouter} from "vue-router";

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
</script>

<template>
  <TresCanvas window-size clear-color="black" :antialias="false">
    <System ref="systemRef" :router="router" :route="route"></System>
  </TresCanvas>
  <div id="overlays-wrapper">
    <div class="header">
      <span class="logo">Miniverse</span>
      <div class="spacer"></div>
      <button class="overlay-button" @click="openNewMiniverseDialog">
        <img class="svg-icon" src="@/assets/icons/plus.svg" />
      </button>
<!--      <router-link class="button" to="settings"><img class="svg-icon" src="@/assets/icons/settings.svg"></router-link>-->
      <button class="overlay-button"><img class="svg-icon" src="@/assets/icons/account.svg"></button>
    </div>
    <transition name="fade">
      <div id="main-overlay-wrapper" v-if="focusedMiniverse" @click="handleOverlayClick($event, null)">
        <div id="main-overlay">
          <MiniverseSheet  :miniverse="focusedMiniverse"></MiniverseSheet>
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
  color: var(--color-primary);
  font-size: 1em;
  padding: 1em;
  margin: 0.5em;
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
}
</style>