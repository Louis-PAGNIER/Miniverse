<script setup>
import {useRenderLoop} from "@tresjs/core";
import {onBeforeUpdate, ref, shallowRef, watch} from 'vue';
import Player from "@/components/Player.vue";
import floatAnimationTemplate from "@/assets/minecraftAnimations/PlayerFloat.json";
import Blob from "@/components/Blob.vue";
import {generateFibonacciSphere} from "@/math.js";

const props = defineProps({
  usernames: {type: Array, required: true},
  position: { type: Array, default: () => [0, 0, 0] }
});

const players = ref([]);
const playerRefs = ref([]);
const currentScale = shallowRef(1)
const targetScale = shallowRef(1)
const miniverseRef = shallowRef()

onBeforeUpdate(() => {
  playerRefs.value = []
})

function distributePlayers(usernames) {
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
    animationStart: Math.random(),
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

  if (miniverseRef.value) {
    currentScale.value += (targetScale.value - currentScale.value) * 0.1
    miniverseRef.value.scale.set(currentScale.value, currentScale.value, currentScale.value)
  }
});

function setPlayersRef(el, index) {
  playerRefs.value[index] = el
}

function handleMouseEnter() {
  targetScale.value = 1.2
  document.body.style.cursor = 'pointer'
}

function handleMouseLeave() {
  targetScale.value = 1
  document.body.style.cursor = 'default'
}

</script>

<template>
  <TresGroup ref="miniverseRef" @pointer-enter="handleMouseEnter" @pointer-leave="handleMouseLeave">
    <Blob>
      <template v-for="(player, index) in players" :key="player.username">
        <TresGroup :ref="el => setPlayersRef(el, index)" :scale="player.scale">
          <Player :username="player.username"
                  :animation="{ ...floatAnimationTemplate, start: player.animationStart }"/>
        </TresGroup>
      </template>
    </Blob>
  </TresGroup>
</template>