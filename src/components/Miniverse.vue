<script setup>
import {computed, onBeforeUpdate, ref, shallowRef, watch} from 'vue';
import Player from "@/components/Player.vue";
import floatAnimationTemplate from "@/assets/minecraftAnimations/PlayerFloat.json";
import Blob from "@/components/Blob.vue";
import {generateFibonacciSphere} from "@/scripts/math.js";
import {useRenderLoop} from "@tresjs/core";

const props = defineProps({
  miniverse: {type: Object, required: true},
  position: { type: Array, default: () => [0, 0, 0] }
});

const numberOfPlayers = computed(() => { return props.miniverse.infos.connected_players.length; });

const players = ref([]);
const playerRefs = ref([]);
const miniverseRef = shallowRef()

onBeforeUpdate(() => {
  playerRefs.value = []
})

function arePlayersEqual(a, b) {
  if (a === b) return true;
  if (a.length !== b.length) return false;

  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

function distributePlayers() {
  const radius = 2.3;
  console.log("start", numberOfPlayers.value)
  const fibonacciPositions = generateFibonacciSphere(numberOfPlayers.value, radius);
  const scaleFactor = numberOfPlayers.value > 1 ? 1 / Math.pow(numberOfPlayers.value, 0.35) : 1;

  return props.miniverse.infos.connected_players.map((username, index) => ({
    username,
    position: {...fibonacciPositions[index]},
    basePosition: {...fibonacciPositions[index]},
    scale: scaleFactor,
    frequency: 0.2 + Math.random() * 0.3,
    positionPhase: Math.random() * Math.PI * 2,
    animationStart: Math.random(),
    rotationSpeed: {x: Math.random() * 2 - 1, y: Math.random() * 2 - 1, z: Math.random() * 2 - 1},
  }));
}

watch(
    () => props.miniverse.infos.connected_players,
    (newPlayers, oldPlayers) => {
      if (!oldPlayers || !arePlayersEqual(newPlayers, oldPlayers)) {
        players.value = distributePlayers();
      }
    },
    { immediate: true }
);

const {onLoop} = useRenderLoop();

onLoop(({_, elapsed}) => {
  players.value.forEach((player, index) => {
    const groupRef = playerRefs.value[index];
    const {frequency, positionPhase, basePosition, rotationSpeed} = player;

    groupRef.position.x = basePosition.x + Math.sin(elapsed * frequency + positionPhase) * 0.5;
    groupRef.position.y = basePosition.y + Math.cos(elapsed * frequency + positionPhase) * 0.5;
    groupRef.position.z = basePosition.z + Math.sin(elapsed * frequency + positionPhase) * 0.5;

    groupRef.rotation.x = elapsed * 0.05 * rotationSpeed.x;
    groupRef.rotation.y = elapsed * 0.05 * rotationSpeed.y;
    groupRef.rotation.z = elapsed * 0.05 * rotationSpeed.z;
  });
});

function setPlayersRef(el, index) {
  playerRefs.value[index] = el
}

</script>

<template>
  <TresGroup ref="miniverseRef">
    <Blob>
    </Blob>
    <template v-for="(player, index) in players" :key="player.username">
      <TresGroup :ref="el => setPlayersRef(el, index)" :scale="player.scale">
        <Player :username="player.username" :animation="{ ...floatAnimationTemplate, start: player.animationStart }"/>
      </TresGroup>
    </template>
  </TresGroup>
</template>