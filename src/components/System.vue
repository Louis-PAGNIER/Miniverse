<script setup>
import Miniverse from "@/components/Miniverse.vue";
import {Html, Stars} from "@tresjs/cientos";
import {useLoop} from "@tresjs/core";
import {onBeforeUnmount, onMounted, ref, shallowRef} from "vue";
import {PositionAnimator} from "@/scripts/animations.js";
import {useMiniverseGrid} from '@/composables/useMiniverseGrid.js';
import {useAuthStore} from "@/stores/authStore.js";
import {fetchMiniverses} from "@/api/api.js";

/* -------------------- Constants -------------------- */
const DEFAULT_CAMERA_POSITION = [0, 0, 40];
const FOCUS_CAMERA_POSITION = [0, 20, 100];
const FOCUS_MINIVERSE_POSITION = [0, 25, 60];
const CAMERA_FOV = 30;
const GRID_WIDTH_FACTOR_DEFAULT = 22;
const GRID_WIDTH_FACTOR_FOCUS = 50;
const GRID_HORIZONTAL_SPACING = 10;
const GRID_VERTICAL_SPACING = 13;

/* -------------------- State -------------------- */
const auth = useAuthStore();

const cameraRef = ref();
const cameraPos = new PositionAnimator(...DEFAULT_CAMERA_POSITION);

const miniverses = ref([])
const focusedMiniverse = shallowRef(null);
const miniversesRefs = ref([]);

const {
  wrapMiniverses,
  distributeMiniverses,
  focusMiniverse,
  handleMouseEnter,
  handleMouseLeave,
  handleMiniverseClick,
  setMiniversesRef,
  handleScroll,
  handleResize,
} = useMiniverseGrid({ cameraPos, focusedMiniverse, miniverses, miniversesRefs });


function updateMiniverses(current, raw) {
  const currentById = Object.fromEntries(current.map(m => [m.id, m]));
  const rawById = Object.fromEntries(raw.map(m => [m.id, m]));

  const updated = [];

  for (const m of raw) {
    const existing = currentById[m.id];

    if (existing) {
      // Met à jour les champs (exclure les champs locaux comme `position`, `scale`)
      Object.assign(existing, m);
      updated.push(existing);
    } else {
      // Nouveau miniverse → on wrap
      updated.push({
        ...m,
        position: new PositionAnimator(),
        scale: 1,
      });
    }
  }

  return updated;
}

/* -------------------- Lifecycle Hooks -------------------- */
let updateMiniversesIntervalId = undefined;
onMounted(async () => {
  const _updateMiniverses = async () => {
    try {
      const fetched = await fetchMiniverses();
      miniverses.value = updateMiniverses(miniverses.value, fetched);
      distributeMiniverses(false);
    } catch (error) {
      console.error("Failed to fetch miniverses:", error);
    }
  };

  await _updateMiniverses();

  updateMiniversesIntervalId = window.setInterval(_updateMiniverses, 5000);

  window.addEventListener("resize", handleResize);
  document.addEventListener("wheel", handleScroll);

  cameraRef.value.lookAt(0, 0, 0);
});

onBeforeUnmount(() => {
  if (updateMiniversesIntervalId) { clearInterval(updateMiniversesIntervalId); }

  window.removeEventListener("resize", handleResize);
  document.removeEventListener("wheel", handleScroll);
});

/* -------------------- Animation Loop -------------------- */
const { onBeforeRender } = useLoop();
onBeforeRender(({ delta }) => {
  miniverses.value.forEach((miniverse, i) => {
    miniverse.position.updatePosition(delta);
    const miniverseRef = miniversesRefs.value[i];

    if (miniverseRef) {
      const currentScale = miniverseRef.scale.x;
      const newScale = currentScale + (miniverse.scale - currentScale) * 0.1;
      miniverseRef.position.set(...miniverse.position.value);
      miniverseRef.scale.set(newScale, newScale, newScale);
    }
  });

  cameraPos.updatePosition(delta);
  cameraRef.value.position.set(...cameraPos.value);
});

/* -------------------- Exposes -------------------- */
defineExpose({
  focusedMiniverse,
  focusMiniverse
})

</script>

<template>
  <TresPerspectiveCamera ref="cameraRef" :position="DEFAULT_CAMERA_POSITION" :fov="CAMERA_FOV" />
  <Stars :size="0.4" />

  <template v-for="(miniverse, index) in miniverses" :key="miniverse.id">
    <TresGroup :ref="el => setMiniversesRef(el, index)"
               v-if="!focusedMiniverse || focusedMiniverse === miniverse">
      <Miniverse @click="handleMiniverseClick(miniverse)"
                 @pointer-enter="handleMouseEnter(miniverse)"
                 @pointer-leave="handleMouseLeave(miniverse)"
                 :miniverse="miniverse" />
      <Html v-if="!focusedMiniverse"
            transform :distance-factor="4" :position="[0, -5, 0]" :scale="[1.5, 1.5, 1.5]">
        <div class="miniverse-name-wrapper">
          <h1 class="miniverse-name">
            {{ miniverse.name }}
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