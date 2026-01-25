<script setup lang="ts">
import MiniverseView from "@/components/3D/MiniverseView.vue";
import {Html, Stars} from "@tresjs/cientos";
import {useLoop} from "@tresjs/core";
import {computed, onBeforeUnmount, onMounted, Ref, ref, ShallowRef, shallowRef, watch} from "vue";
import {useMiniverseStore} from "@/stores/miniverseStore";
import {Vector3Animator} from "@/composables/animations";
import {MiniverseAnimatorManager} from "@/composables/useMiniverseGrid";
import {Miniverse, MiniverseAnimator} from "@/models/miniverse";
import {Group, Vector3} from "three";
import {RouteLocation, Router} from "vue-router";

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

const props = defineProps<{ route: RouteLocation, router: Router }>();

const miniverseAnimatorsArray = computed(() =>
    Array.from(miniverseStore.miniverseAnimators.values())
);

/* -------------------- Stores -------------------- */
const miniverseStore = useMiniverseStore();

/* -------------------- Lifecycle Hooks -------------------- */
onMounted(async () => {

  function updateMiniverseFocus() {
    const path = props.route.fullPath;
    const match = path.match(/^\/miniverse\/([^\/#?&]+)/);
    if (match) {
      const id = match[1];
      const miniverseAnimator = miniverseStore.miniverseAnimators.get(id);
      if (miniverseAnimator) {
        miniverseAnimatorManager.focusMiniverse(miniverseAnimator);
      }
    } else {
      miniverseAnimatorManager.focusMiniverse(null);
    }
  }

  watch(
      miniverses, (newMiniverses, oldMiniverses) => {
        const isAnimated = !!oldMiniverses && oldMiniverses.length > 0;
        updateMiniverseFocus();
        miniverseAnimatorManager.distributeMiniverses(isAnimated);
  }, { immediate: true });

  watch(
      () => props.route.fullPath,
      (newPath) => {
        updateMiniverseFocus();
      },
      { immediate: true }
  );

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

  <TresGroup>
    <template v-for="miniverseAnimator in miniverseAnimatorsArray" :key="miniverseAnimator.miniverse.id">
      <TresGroup :ref="el => setMiniversesRef(el, miniverseAnimator.miniverse.id)">
        <MiniverseView v-if="!focusedMiniverse || focusedMiniverse.miniverse.id === miniverseAnimator.miniverse.id"
                       @click="router.push(`/miniverse/${miniverseAnimator.miniverse.id}`)"
                       @pointer-enter="miniverseAnimatorManager.handleMouseEnter(miniverseAnimator)"
                       @pointer-leave="miniverseAnimatorManager.handleMouseLeave(miniverseAnimator)"
                       :miniverse="miniverseAnimator.miniverse" />
        <Html v-if="!focusedMiniverse" transform :distance-factor="4" :position="[0, -5, 0]" :scale="[1.5, 1.5, 1.5]">
        <div class="miniverse-name-wrapper">
          <h1 class="miniverse-name">
            {{ miniverseAnimator.miniverse.name }}
          </h1>
        </div>
        </Html>
      </TresGroup>
    </template>
  </TresGroup>

  <TresAmbientLight :intensity="0.7" />
  <TresPointLight :position="[5, 5, 2]" :intensity="75" />
</template>

<style scoped>
.miniverse-name {
  cursor: text;
}

.miniverse-name-wrapper {
  background: var(--color-background-primary);
  opacity: 0.8;
  padding: 8px 70px;
  border-radius: 8px;
}
</style>