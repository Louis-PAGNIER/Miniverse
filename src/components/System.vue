<script setup>
import Miniverse from "@/components/Miniverse.vue";
import {Stars} from "@tresjs/cientos";
import {TresCanvas} from "@tresjs/core";
import {onBeforeUnmount, onMounted, ref, shallowRef} from "vue";

const miniverses = [
  { name: "Miniverse 1", players: ['louisleroisoleil'] },
  { name: "Miniverse 2", players: ['Malix08', 'HelmDeepYT'] },
  { name: "Miniverse 3", players: ['Notch'] },
  { name: "Miniverse 1", players: ['louisleroisoleil'] },
  { name: "Miniverse 2", players: ['Malix08', 'HelmDeepYT'] },
  { name: "Miniverse 3", players: ['Notch'] },
]

const cameraRef = ref()
const focusedMiniverse = shallowRef()

const miniversesRefs = ref([]);

const setMiniversesRef = (el, index) => {
  miniversesRefs.value[index] = el
}

const distributeMiniverses = (miniverses) => {
  const sphereRadius = 8; // Rayon des sphères en vue 3D
  const spacing = sphereRadius * 1.5; // Espacement entre sphères
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  const maxGridWidth = 22 * windowWidth / windowHeight; // Largeur maximale en unités 3D
  console.log(maxGridWidth);

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
}

const setGridPositions = () => {
  const positions = distributeMiniverses(miniverses);
  for (let i = 0; i < positions.length; i++) {
    miniversesRefs.value[i].position.set(...positions[i]);
  }
};

const setFocusPositions = () => {
  // TODO: Camera rotates a bit and move to zoom on the selected miniverse
  // TODO: Other miniverses are positioned randomly as a sphere in the background and rotated slowly around it (y-axis).
}

const handleResize = () => {
  if (focusedMiniverse.value) {

  } else {
    setGridPositions()
  }
}

const handleScroll = (event) => {
  cameraRef.value.position.y -= event.deltaY * 0.01;
}

onMounted(() => {
  window.addEventListener("resize", handleResize);
  const positions = distributeMiniverses(miniverses);
  for (let i = 0; i < positions.length; i++) {
    miniversesRefs.value[i].position.set(...positions[i]);
  }

  document.addEventListener("wheel", handleScroll)
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", handleResize);
});

function handleMiniverseClick(miniverse) {
  focusMiniverse(miniverse)
}

</script>

<template>
  <TresCanvas window-size clear-color="black" :antialias="false">
    <TresPerspectiveCamera ref="cameraRef" :position="[0, 0, 40]" :look-at="[0, 0, 0]" :fov="30"/>
    <Stars :size="0.4"/>

    <template v-for="(miniverse, index) in miniverses" :key="index">
      <TresGroup :ref="el => setMiniversesRef(el, index)">
        <Miniverse @click="handleMiniverseClick(miniverse)" :usernames="miniverse.players"/>
      </TresGroup>
    </template>

    <TresAmbientLight :intensity="0.7"/>
    <TresPointLight :position="[5, 5, 2]" :intensity="75"/>
  </TresCanvas>
</template>

<style scoped>

</style>