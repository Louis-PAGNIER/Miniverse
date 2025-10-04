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
const newMiniverseDialogRef = ref();

const handleOverlayClick = (event: MouseEvent) => {
  if (focusedMiniverse.value && event.target?.id === "main-overlay") {
    //systemRef.value?.focusMiniverse(null);
    router.push("/");
  }
};

const openNewMiniverseDialog = () => {
  newMiniverseDialogRef.value?.open();
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
      <button @click="openNewMiniverseDialog">
        <img class="svg-icon" src="@/assets/icons/plus.svg" />
      </button>
<!--      <router-link class="button" to="settings"><img class="svg-icon" src="@/assets/icons/settings.svg"></router-link>-->
      <button><img class="svg-icon" src="@/assets/icons/account.svg"></button>
    </div>
    <transition name="fade">
      <div id="main-overlay" v-if="focusedMiniverse" @click="handleOverlayClick($event, null)">
        <MiniverseSheet  :miniverse="focusedMiniverse"></MiniverseSheet>
      </div>
    </transition>
  </div>

  <AddMiniversePopup ref="newMiniverseDialogRef"/>
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

#main-overlay {
  width: 100%;
  height: 100%;
  padding-top: 52vh;
  padding-bottom: 4em;
  overflow-y: scroll;
  cursor: auto;
  pointer-events: all;
  -ms-overflow-style: none;
  scrollbar-width: none;

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
</style>