<script setup>

import {TresCanvas} from "@tresjs/core";
import System from "@/components/System.vue";
import {computed, ref, shallowRef} from "vue";

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
      <div class="presentation">
        <div class="details">
          <h1>{{ focusedMiniverse.name }}</h1>
        </div>
      </div>
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
  cursor: default;
}

.presentation {
  width: calc(100% - 40px);
  max-width: 1400px;
  padding: 10px 20px;
  background: #2c2c2c;
  border-radius: 10px;
  margin: 0 auto;
  min-height: calc(100% - 40px);
  border: #5e5e5e 1px solid;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>