<script setup>
import Miniverse from "@/components/Miniverse.vue";
import {Stars} from "@tresjs/cientos";
import {useLoop} from "@tresjs/core";
import {onBeforeUnmount, onMounted, ref, shallowRef} from "vue";
import {PositionAnimator} from "@/animations.js";

const miniverses = [
  { id: 1, name: "Miniverse 1", players: ['louisleroisoleil'], position: new PositionAnimator() },
  { id: 2, name: "Miniverse 2", players: ['Malix08', 'HelmDeepYT'], position: new PositionAnimator() },
  { id: 3, name: "Miniverse 3", players: ['Notch'], position: new PositionAnimator() },
  { id: 4, name: "Miniverse 4", players: ['louisleroisoleil'], position: new PositionAnimator() },
  { id: 5, name: "Miniverse 5", players: ['Malix08', 'HelmDeepYT'], position: new PositionAnimator() },
  { id: 6, name: "Miniverse 6", players: ['Notch'], position: new PositionAnimator() },
]

const cameraRef = ref()
const cameraPos = new PositionAnimator(0, 0, 40)
const focusedMiniverse = shallowRef()
const gridRows = shallowRef(0)

const miniversesRefs = ref([])

function setMiniversesRef(el, index) {
  miniversesRefs.value[index] = el
}

function distributeMiniverses(miniverses, skipId = null) {
  const n = miniverses.length - (skipId ? 1 : 0);
  const maxFactor = skipId ? 60 : 22;

  const sphereRadius = 8;
  const spacing = sphereRadius * 1.3;
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  const maxGridWidth = maxFactor * windowWidth / windowHeight;

  const maxColumns = Math.floor(maxGridWidth / spacing);
  const columns = Math.min(n, maxColumns);
  const rows = Math.ceil(n / columns);

  let startX = -((columns - 1) * spacing) / 2;
  const startY = 0;

  const newPositions = [];

  let i = 0;
  let col = 0;
  let row = 0;
  let even = true;
  while (i < n) {
    if (miniverses[i].id === skipId) {
      i++;
      newPositions.push([0, 0, 0]); // Ignored position (value doesn't matter)
      continue;
    }

    const currentRow = Math.floor(i / columns);
    const isLastRow = currentRow === rows - 1;
    const spheresInLastRow = n % columns;
    if (isLastRow && spheresInLastRow !== 0) {
      startX = -((spheresInLastRow - 1) * spacing) / 2;
      if (col > spheresInLastRow - 1)
        col = spheresInLastRow - 1;
    }

    const x = startX + col * spacing;
    const y = startY - row * spacing;

    newPositions.push([x, y, 0]);

    if (even) {
      if (++col === maxColumns) {
        row++;
        even = false;
        col--;
      }
    } else {
      if (--col === -1) {
        row++;
        even = true;
        col++;
      }
    }

    i++;
  }

  gridRows.value = rows;
  return newPositions;
}

function focusMiniverse(miniverse) {
  focusedMiniverse.value = miniverse;
  setFocusPositions();
}

function setGridPositions(animated = true) {
  const skipId = focusedMiniverse.value ? focusedMiniverse.value.id : null;
  const positions = distributeMiniverses(miniverses, skipId);
  for (let i = 0; i < positions.length; i++)
    if (skipId !== miniverses[i].id)
      miniverses[i].position.setGoalPosition(...positions[i], animated ? 1000 + Math.random() * 700 : 0, 'ease-out');

  checkCameraBounds();
}

function checkCameraBounds() {
  const cameraY = cameraPos.endY;
  if (!focusedMiniverse.value) {
    const rows = gridRows.value;
    const rowHeight = 1.3 * 8;
    const minCameraY = -rowHeight * (rows - 1);
    const maxCameraY = 0

    if (cameraY > maxCameraY)
      cameraPos.setGoalPosition(cameraPos.value[0], maxCameraY, cameraPos.value[2], 0);
    else if (cameraY < minCameraY)
      cameraPos.setGoalPosition(cameraPos.value[0], minCameraY, cameraPos.value[2], 0);
  }
}

function setFocusPositions() {
  focusedMiniverse.value.position.setGoalPosition(0, 25, 80, 1000, 'ease-out');
  cameraPos.setGoalPosition(cameraPos.value[0], 20, 120, 1000, 'ease-out');
  setGridPositions();
}

function handleResize() {
  setGridPositions();
}

function handleScroll(event) {
  if (!focusedMiniverse.value)
    cameraPos.setGoalPosition(cameraPos.value[0], cameraPos.value[1] - event.deltaY * 0.01, cameraPos.value[2]);
  checkCameraBounds();
}

onMounted(() => {
  setGridPositions(false);

  window.addEventListener("resize", handleResize);
  document.addEventListener("wheel", handleScroll);

  cameraRef.value.lookAt(0, 0, 0);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", handleResize);
});

function handleMiniverseClick(miniverse) {
  focusMiniverse(miniverse)
}

const {onBeforeRender} = useLoop();
onBeforeRender(({delta, _}) => {
  for (let i = 0; i < miniverses.length; i++) {
    miniverses[i].position.updatePosition(delta);
    miniversesRefs.value[i].position.set(...miniverses[i].position.value);
  }

  cameraPos.updatePosition(delta);
  cameraRef.value.position.set(...cameraPos.value);
});
</script>

<template>
  <TresPerspectiveCamera ref="cameraRef" :position="[0, 0, 40]" :fov="30"/>
  <Stars :size="0.4"/>

  <template v-for="(miniverse, index) in miniverses" :key="index">
    <TresGroup :ref="el => setMiniversesRef(el, index)">
      <Miniverse @click="handleMiniverseClick(miniverse)" :usernames="miniverse.players"/>
    </TresGroup>
  </template>

  <TresAmbientLight :intensity="0.7"/>
  <TresPointLight :position="[5, 5, 2]" :intensity="75"/>
</template>

<style scoped>

</style>