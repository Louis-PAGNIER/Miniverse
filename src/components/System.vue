<script setup>
import Miniverse from "@/components/Miniverse.vue";
import { Stars } from "@tresjs/cientos";
import { useLoop } from "@tresjs/core";
import { onBeforeUnmount, onMounted, ref, shallowRef } from "vue";
import { PositionAnimator } from "@/scripts/animations.js";
import { calculateGridDistribution } from "@/scripts/placement.js";

/* -------------------- Constants -------------------- */
const DEFAULT_CAMERA_POSITION = [0, 0, 40];
const FOCUS_CAMERA_POSITION = [0, 20, 120];
const FOCUS_MINIVERSE_POSITION = [0, 25, 80];
const CAMERA_FOV = 30;
const GRID_WIDTH_FACTOR_DEFAULT = 22;
const GRID_WIDTH_FACTOR_FOCUS = 60;
const GRID_SPACING = 10.4;

/* -------------------- State -------------------- */
const miniverses = [
  { id: 1, name: "Miniverse 1", players: ['louisleroisoleil'], position: new PositionAnimator() },
  { id: 2, name: "Miniverse 2", players: ['Malix08', 'HelmDeepYT'], position: new PositionAnimator() },
  { id: 3, name: "Miniverse 3", players: ['Notch'], position: new PositionAnimator() },
  { id: 4, name: "Miniverse 4", players: ['louisleroisoleil'], position: new PositionAnimator() },
  { id: 5, name: "Miniverse 5", players: ['Malix08', 'HelmDeepYT'], position: new PositionAnimator() },
  { id: 6, name: "Miniverse 6", players: ['Notch'], position: new PositionAnimator() },
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

  const [positions, rows] = calculateGridDistribution(filteredMiniverses, gridWidthFactor, GRID_SPACING);
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
    const rowHeight = 1.3 * 8;
    const minCameraY = -rowHeight * (rows - 1);
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
  focusedMiniverse.value.position.setGoalPosition(...FOCUS_MINIVERSE_POSITION, 1000, 'ease-out');
  cameraPos.setGoalPosition(...FOCUS_CAMERA_POSITION, 1000, 'ease-out');
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
    miniversesRefs.value[i]?.position.set(...miniverse.position.value);
  });

  cameraPos.updatePosition(delta);
  cameraRef.value.position.set(...cameraPos.value);
});
</script>

<template>
  <TresPerspectiveCamera ref="cameraRef" :position="DEFAULT_CAMERA_POSITION" :fov="CAMERA_FOV" />
  <Stars :size="0.4" />

  <template v-for="(miniverse, index) in miniverses" :key="miniverse.id">
    <TresGroup :ref="el => setMiniversesRef(el, index)">
      <Miniverse @click="handleMiniverseClick(miniverse)" :usernames="miniverse.players" />
    </TresGroup>
  </template>

  <TresAmbientLight :intensity="0.7" />
  <TresPointLight :position="[5, 5, 2]" :intensity="75" />
</template>
