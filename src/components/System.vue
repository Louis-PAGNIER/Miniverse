<script setup lang="ts">
import MiniverseView from "@/components/MiniverseView.vue";
import {Html, Stars} from "@tresjs/cientos";
import {useLoop} from "@tresjs/core";
import {computed, onBeforeUnmount, onMounted, Ref, ref, ShallowRef, shallowRef, watch} from "vue";
import {useMiniverseStore} from "@/stores/miniverseStore.js";
import {Vector3Animator} from "@/scripts/animations";
import {MiniverseAnimatorManager} from "@/composables/useMiniverseGrid";
import {Miniverse, MiniverseAnimator} from "@/models/miniverse";
import {Group, Vector3} from "three";

/* -------------------- Constants -------------------- */
const DEFAULT_CAMERA_POSITION: Vector3 = new Vector3(0, 0, 40);
const CAMERA_FOV: number = 30;

/* -------------------- State -------------------- */
const cameraRef = ref();
const cameraPos = new Vector3Animator(DEFAULT_CAMERA_POSITION);

const focusedMiniverse: Ref<MiniverseAnimator | null> = ref(null);
const miniversesRefs = ref(new Map<string, Group>())

const miniverseAnimatorManager = new MiniverseAnimatorManager(cameraPos, focusedMiniverse);
const miniverses = computed(() => Array.from(miniverseStore.miniverses.values()));

/* -------------------- Stores -------------------- */
const miniverseStore = useMiniverseStore();

/* -------------------- Lifecycle Hooks -------------------- */
onMounted(async () => {
  watch(
      miniverses, (newMiniverses, oldMiniverses) => {
        const isAnimated = !!oldMiniverses && oldMiniverses.length > 0;
        miniverseAnimatorManager.distributeMiniverses(isAnimated);
  }, { immediate: true });

  window.addEventListener("resize", miniverseAnimatorManager.handleResize);
  document.addEventListener("wheel", miniverseAnimatorManager.handleScroll);

  cameraRef.value.lookAt(0, 0, 0);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", miniverseAnimatorManager.handleResize);
  document.removeEventListener("wheel", miniverseAnimatorManager.handleScroll);
});

/* -------------------- Animation Loop -------------------- */
const { onBeforeRender } = useLoop();
onBeforeRender(({ delta }) => {
  miniverseStore.miniverseAnimators.forEach((miniverseAnimator, miniverseId) => {
    miniverseAnimator.positionAnimator.update(delta);
    miniverseAnimator.scaleAnimator.update(delta);
    const miniverseRef = miniversesRefs.value.get(miniverseId);
    /*if (Math.random() < 0.001) {
      console.log(miniverseRef)
    }*/

    if (miniverseRef) {
      miniverseRef.position.copy(miniverseAnimator.positionAnimator.value);
      miniverseRef.scale.setScalar(miniverseAnimator.scaleAnimator.value);
    }
  });

  cameraPos.update(delta);
  cameraRef.value.position.copy(cameraPos.value);
});

/* -------------------- Exposes -------------------- */
defineExpose({
  focusedMiniverse,
  focusMiniverse: miniverseAnimatorManager.focusMiniverse
})

const setMiniversesRef = (el: any | null, id: string) => {
  if (el) {
    miniversesRefs.value.set(id, el)
  } else {
    miniversesRefs.value.delete(id)
  }
};

</script>

<template>
  <TresPerspectiveCamera ref="cameraRef" :position="DEFAULT_CAMERA_POSITION" :fov="CAMERA_FOV" />
  <Stars :size="0.1" :radius="20"/>

  <template v-for="(miniverseAnimator, index) in miniverseStore.miniverseAnimators.values()" :key="miniverseAnimator.miniverse.id">
    <TresGroup :ref="el => setMiniversesRef(el, miniverseAnimator.miniverse.id)"
               v-if="!focusedMiniverse || focusedMiniverse.miniverse.id === miniverseAnimator.miniverse.id">
      <MiniverseView @click="miniverseAnimatorManager.handleMiniverseClick(miniverseAnimator)"
                 @pointer-enter="miniverseAnimatorManager.handleMouseEnter(miniverseAnimator)"
                 @pointer-leave="miniverseAnimatorManager.handleMouseLeave(miniverseAnimator)"
                 :miniverse="miniverseAnimator.miniverse" />
      <Html v-if="!focusedMiniverse"
            transform :distance-factor="4" :position="[0, -5, 0]" :scale="[1.5, 1.5, 1.5]">
        <div class="miniverse-name-wrapper">
          <h1 class="miniverse-name">
            {{ miniverseAnimator.miniverse.name }}
          </h1>
        </div>
      </Html>
    </TresGroup>
  </template>

  <TresAmbientLight :intensity="0.7" />
  <TresPointLight :position="[5, 5, 2]" :intensity="75" />
</template>

<style scoped>
.miniverse-name {
  cursor: text;
  color: white;
}

.miniverse-name-wrapper {
  background: rgba(32, 32, 32, 0.5);
  padding: 8px 70px;
  border-radius: 8px;
}
</style>