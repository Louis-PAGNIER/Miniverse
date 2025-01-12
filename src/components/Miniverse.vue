<script setup>
import {TresCanvas, useRenderLoop} from "@tresjs/core";
import {OrbitControls, Stars} from '@tresjs/cientos';
import {onBeforeUpdate, ref, watch} from 'vue';
import Player from "@/components/Player.vue";
import floatAnimationTemplate from "@/assets/minecraftAnimations/PlayerFloat.json";
import Blob from "@/components/Blob.vue";

const props = defineProps({
  usernames: {type: Array, required: true},
});

const players = ref([]);
const playerRefs = ref([]);

onBeforeUpdate(() => {
  playerRefs.value = []
})

const setPlayersRef = (el, index) => {
  playerRefs.value[index] = el
}

const generateFibonacciSphere = (numPoints, radius) => {
  if (numPoints === 1) return [{x: 0, y: 0, z: 0}];
  const positions = [];
  const offset = 2 / numPoints;
  const increment = Math.PI * (3 - Math.sqrt(5));

  for (let i = 0; i < numPoints; i++) {
    const y = i * offset - 1 + offset / 2;
    const r = Math.sqrt(1 - y * y);
    const phi = i * increment;

    const x = Math.cos(phi) * r * radius;
    const z = Math.sin(phi) * r * radius;

    positions.push({x, y: y * radius, z});
  }

  return positions;
};

// Distribution des joueurs
const distributePlayers = (usernames) => {
  const radius = 2.3;
  const fibonacciPositions = generateFibonacciSphere(usernames.length, radius);
  const scaleFactor = usernames.length > 1 ? 1 / Math.pow(usernames.length, 0.35) : 1;

  return usernames.map((username, index) => ({
    username,
    position: {...fibonacciPositions[index]},
    basePosition: {...fibonacciPositions[index]},
    scale: scaleFactor,
    frequency: 0.2 + Math.random() * 0.3,
    positionPhase: Math.random() * Math.PI * 2,
    animationStart: Math.random() * Math.PI,
    rotationSpeed: {x: Math.random() * 2 - 1, y: Math.random() * 2 - 1, z: Math.random() * 2 - 1},
  }));
};

watch(
    () => props.usernames,
    (newUsernames) => {
      const distributedPlayers = distributePlayers(newUsernames);
      players.value = distributedPlayers;
      playerRefs.value = distributedPlayers.map(() => ref(null));
    },
    {immediate: true}
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
</script>

<template>
  <TresCanvas window-size clear-color="black" :antialias="false">
    <Stars :size="0.4"/>
    <TresPerspectiveCamera :position="[0, 0, 20]" :look-at="[0, 0, 0]"/>

    <Blob>
      <template v-for="(player, index) in players" :key="player.username">
        <TresGroup :ref="el => setPlayersRef(el, index)" :scale="player.scale">
          <Player :username="player.username"
                  :animation="{ ...floatAnimationTemplate, start: player.animationStart }"/>
        </TresGroup>
      </template>
    </Blob>

    <TresAmbientLight :intensity="0.5"/>
    <TresPointLight :position="[5, 5, 2]" :intensity="75"/>
    <OrbitControls/>
  </TresCanvas>
</template>