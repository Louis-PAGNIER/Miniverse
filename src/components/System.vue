<script setup>
import Miniverse from "@/components/Miniverse.vue";
import {Stars} from "@tresjs/cientos";
import {useLoop} from "@tresjs/core";
import {onBeforeUnmount, onMounted, ref, shallowRef} from "vue";
import {PositionAnimator} from "@/animations.js";

const miniverses = [
  { name: "Miniverse 1", players: ['louisleroisoleil'], position: new PositionAnimator() },
  { name: "Miniverse 2", players: ['Malix08', 'HelmDeepYT'], position: new PositionAnimator() },
  { name: "Miniverse 3", players: ['Notch'], position: new PositionAnimator() },
  { name: "Miniverse 1", players: ['louisleroisoleil'], position: new PositionAnimator() },
  { name: "Miniverse 2", players: ['Malix08', 'HelmDeepYT'], position: new PositionAnimator() },
  { name: "Miniverse 3", players: ['Notch'], position: new PositionAnimator() },
]

const cameraRef = ref()
const cameraPos = new PositionAnimator(0, 0, 40)
const focusedMiniverse = shallowRef()

const miniversesRefs = ref([])

const setMiniversesRef = (el, index) => {
  miniversesRefs.value[index] = el
}

const distributeMiniverses = (miniverses) => {
  const sphereRadius = 8; // Rayon des sphères en vue 3D
  const spacing = sphereRadius * 1.3; // Espacement entre sphères
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  const maxGridWidth = 22 * windowWidth / windowHeight; // Largeur maximale en unités 3D

  const maxColumns = Math.floor(maxGridWidth / spacing); // Nombre maximal de colonnes
  const columns = Math.min(miniverses.length, maxColumns); // Colonnes limitées au nombre de sphères ou au max possible
  const rows = Math.ceil(miniverses.length / columns); // Nombre de lignes nécessaires

  const startX = -((columns - 1) * spacing) / 2; // Départ X (centré)
  const startY = 0 // ((rows - 1) * spacing) / 2; // Départ Y (centré)

  const newPositions = [];

  for (let i = 0; i < miniverses.length; i++) {
    const col = i % columns; // Colonne actuelle
    const row = Math.floor(i / columns); // Ligne actuelle

    const x = startX + col * spacing; // Position X
    const y = startY - row * spacing; // Position Y

    newPositions.push([x, y, 0]); // Position dans le plan 2D
  }

  return newPositions;
};

function focusMiniverse(miniverse) {
  focusedMiniverse.value = miniverse;
  setFocusPositions();
}

const setGridPositions = (animated = true) => {
  const positions = distributeMiniverses(miniverses);
  for (let i = 0; i < positions.length; i++)
    miniverses[i].position.setGoalPosition(...positions[i], animated ? 1000 + Math.random() * 700 : 0, 'ease-out');
};

const setFocusPositions = () => {
  focusedMiniverse.value.position.setGoalPosition(0, 25, 80, 1000, 'ease-out');
  cameraPos.setGoalPosition(cameraPos.value[0], 20, 120, 1000, 'ease-out');
}

const handleResize = () => {
  if (focusedMiniverse.value) {

  } else {
    setGridPositions()
  }
}

const handleScroll = (event) => {
  if (!focusedMiniverse.value)
    cameraPos.setCurrentPosition(cameraPos.value[0], cameraPos.value[1] - event.deltaY * 0.01, cameraPos.value[2]);
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
  console.log(cameraRef.value.position, cameraPos.value)
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