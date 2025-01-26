<script setup>

import {TresCanvas} from "@tresjs/core";
import System from "@/components/System.vue";
import {computed, ref, shallowRef} from "vue";
import MiniverseSheet from "@/components/MiniverseSheet.vue";

const systemRef = ref(null);
const focusedMiniverse = computed(() => systemRef.value?.focusedMiniverse);

const handleOverlayClick = (event) => {
  if (focusedMiniverse.value && event.target.id === "main-overlay") {
    systemRef.value?.focusMiniverse(null);
  }
};
</script>

<template>
  <TresCanvas window-size clear-color="black" :antialias="false">
    <System ref="systemRef"></System>
  </TresCanvas>
  <transition name="fade">
    <div id="main-overlay" v-if="focusedMiniverse" @click="handleOverlayClick($event, null)">
      <MiniverseSheet  :miniverse="focusedMiniverse"></MiniverseSheet>
    </div>
  </transition>
</template>

<style scoped>
#main-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding-top: 52vh;
  padding-bottom: 40px;
  overflow-y: scroll;
  cursor: auto;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s;
}

.fade-leave-active {
  pointer-events: none;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>