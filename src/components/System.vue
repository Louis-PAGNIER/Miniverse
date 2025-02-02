<script setup>
import Miniverse from "@/components/Miniverse.vue";
import { Stars, Html } from "@tresjs/cientos";
import { useLoop } from "@tresjs/core";
import { onBeforeUnmount, onMounted, ref, shallowRef } from "vue";
import { PositionAnimator } from "@/scripts/animations.js";
import { calculateGridDistribution } from "@/scripts/placement.js";

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
const miniverses = [
  { id: 1, name: "Miniverse 1", players: ['louisleroisoleil'], position: new PositionAnimator(), scale: 1 },
  { id: 2, name: "Miniverse 2", players: ['Malix08', 'HelmDeepYT'], position: new PositionAnimator(), scale: 1 },
  { id: 3, name: "Miniverse 3", players: ['Notch'], position: new PositionAnimator(), scale: 1 },
  { id: 4, name: "Miniverse 4", players: ['louisleroisoleil'], position: new PositionAnimator(), scale: 1 },
  { id: 5, name: "Miniverse 5", players: ['Malix08', 'HelmDeepYT'], position: new PositionAnimator(), scale: 1 },
  { id: 6, name: "Miniverse 6", players: ['Notch'], position: new PositionAnimator(), scale: 1 },
];

const cameraRef = ref();
const cameraPos = new PositionAnimator(...DEFAULT_CAMERA_POSITION);
const focusedMiniverse = shallowRef(null);
const gridRows = shallowRef(0);
const miniversesRefs = ref([]);

/* -------------------- Utility Functions -------------------- */
const setMiniversesRef = (el, index) => {
  miniversesRefs.value[index] = el;
};

const distributeMiniverses = (animated = true) => {
  const skipId = focusedMiniverse.value?.id || null;
  const gridWidthFactor = focusedMiniverse.value ? GRID_WIDTH_FACTOR_FOCUS : GRID_WIDTH_FACTOR_DEFAULT;
  const filteredMiniverses = skipId
      ? miniverses.filter((miniverse) => miniverse.id !== skipId)
      : miniverses;

  const [positions, rows] = calculateGridDistribution(filteredMiniverses, gridWidthFactor, GRID_HORIZONTAL_SPACING, GRID_VERTICAL_SPACING);
  gridRows.value = rows;

  filteredMiniverses.forEach((miniverse, i) => {
    const animationDuration = animated ? 1000 + Math.random() * 700 : 0;
    miniverse.position.setGoalPosition(...positions[i], animationDuration, 'ease-out');
  });

  checkCameraBounds();
};

const checkCameraBounds = () => {
  if (!focusedMiniverse.value) {
    const cameraY = cameraPos.endY;
    const rows = gridRows.value;
    const minCameraY = -GRID_VERTICAL_SPACING * (rows - 1);
    const maxCameraY = 0;

    if (cameraY > maxCameraY) {
      cameraPos.setGoalPosition(cameraPos.value[0], maxCameraY, cameraPos.value[2], 0);
    } else if (cameraY < minCameraY) {
      cameraPos.setGoalPosition(cameraPos.value[0], minCameraY, cameraPos.value[2], 0);
    }
  }
};

const focusMiniverse = (miniverse) => {
  focusedMiniverse.value = miniverse;
  setFocusPositions();
};

const setFocusPositions = () => {
  if (!focusedMiniverse.value) {
    cameraPos.setGoalPosition(...DEFAULT_CAMERA_POSITION, 1000, 'ease-out');
  } else {
    cameraPos.setGoalPosition(...FOCUS_CAMERA_POSITION, 1000, 'ease-out');
    focusedMiniverse.value.position.setGoalPosition(...FOCUS_MINIVERSE_POSITION, 1000, 'ease-out');
  }

  distributeMiniverses();
};

/* -------------------- Event Handlers -------------------- */
const handleResize = () => distributeMiniverses();
const handleScroll = (event) => {
  if (!focusedMiniverse.value) {
    cameraPos.setGoalPosition(cameraPos.value[0], cameraPos.value[1] - event.deltaY * 0.01, cameraPos.value[2]);
    checkCameraBounds();
  }
};

const handleMouseEnter = (miniverse) => {
  miniverse.scale = 1.2;
  document.body.style.cursor = "pointer";
}

const handleMouseLeave = (miniverse) => {
  miniverse.scale = 1;
  document.body.style.cursor = "default";
}

const handleMiniverseClick = (miniverse) => focusMiniverse(miniverse);

/* -------------------- Lifecycle Hooks -------------------- */
onMounted(() => {
  distributeMiniverses(false);

  window.addEventListener("resize", handleResize);
  document.addEventListener("wheel", handleScroll);

  cameraRef.value.lookAt(0, 0, 0);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", handleResize);
  document.removeEventListener("wheel", handleScroll);
});

/* -------------------- Animation Loop -------------------- */
const { onBeforeRender } = useLoop();
onBeforeRender(({ delta }) => {
  miniverses.forEach((miniverse, i) => {
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
                 :usernames="miniverse.players" />
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