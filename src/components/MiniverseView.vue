<script setup lang="ts">
import {computed, ComputedRef, ref, watch} from 'vue';
import Player from "@/components/Player.vue";
import Blob from "@/components/Blob.vue";
import {generateFibonacciSphere} from "@/scripts/math";
import {useLoop} from "@tresjs/core";
import {Miniverse} from "@/models/miniverse";
import {useMiniverseStore} from "@/stores/miniverseStore";
import {arePlayerListsEqual, PlayerAnimator} from "@/models/player";
import {Color, Group} from "three";
import {InterpolationType} from "@/scripts/animations";
import {PlayerFloatAnimation} from "@/assets/minecraftAnimations/PlayerFloat";

const props = defineProps<{
  miniverse: Miniverse
}>();

const miniverseStore = useMiniverseStore();
const miniversePlayers: ComputedRef<PlayerAnimator[]> = computed(() => {
  return miniverseStore.miniversePlayersLists.get(props.miniverse.id) || [];
});

const playerRefs = ref(new Map<string, Group>())

const blobColors = computed(() => {
  if (props.miniverse.started) {
    return [
      new Color(0.6, 0.2, 1.0), new Color(0.2, 1.0, 0.6)
    ];
  } else {
    return [
      new Color(0.5, 0.5, 0.5), new Color(0.7, 0.7, 0.7)
    ];
  }
});

const blobSpeed = computed(() => {
  return props.miniverse.started ? 1.0 : 0.5;
});

function distributePlayerAnimators(playerAnimators: PlayerAnimator[], animated: boolean, radius: number = 2.3) {
  const count = playerAnimators.length;
  const fibonacciPositions = generateFibonacciSphere(count, radius);
  const scaleFactor: number = count == 1 ? 1 : 1 / Math.pow(count, 0.35);

  const duration: number = animated ? 1000 : 0;

  for (let i = 0; i < count; i++) {
    const playerAnimator = playerAnimators[i];
    playerAnimator.centerPositionAnimator.setGoal(fibonacciPositions[i], duration, InterpolationType.EASE_IN_OUT);
    playerAnimator.scale.setGoal(scaleFactor, duration, InterpolationType.EASE_IN_OUT);
  }
}

watch(
    () => miniversePlayers.value,
    (newPlayers, oldPlayers) => {
      if (!oldPlayers || !arePlayerListsEqual(newPlayers, oldPlayers)) {
        distributePlayerAnimators(newPlayers, true);
      }
    },
    { immediate: true }
);

const {onBeforeRender} = useLoop();

onBeforeRender(({delta, elapsed}) => {
  miniversePlayers.value.forEach((playerAnimator) => {
    const groupRef = playerRefs.value.get(playerAnimator.player.id)
    if (!groupRef) return;
    const {
      positionFrequency,
      positionPhase,
      centerPositionAnimator,
      rotationSpeed,
      rotationPhase,
      scale
    } = playerAnimator;

    centerPositionAnimator.update(delta);
    scale.update(delta);

    const pos = centerPositionAnimator.value;

    groupRef.position.x = pos.x + Math.sin(elapsed * positionFrequency + positionPhase) * 0.5;
    groupRef.position.y = pos.y + Math.cos(elapsed * positionFrequency + positionPhase) * 0.5;
    groupRef.position.z = pos.z + Math.sin(elapsed * positionFrequency + positionPhase) * 0.5;

    groupRef.rotation.setFromVector3(rotationSpeed.clone().multiplyScalar(elapsed * 0.05 + rotationPhase * 1000));
    groupRef.scale.setScalar(scale.value);
  });
});

function setPlayersRef(el: any | null, id: string) {
  if (el) {
    playerRefs.value.set(id, el)
  } else {
    playerRefs.value.delete(id)
  }
}

</script>

<template>
  <TresGroup>
    <Blob :color1="blobColors[0]" :color2="blobColors[1]" :speed="blobSpeed"></Blob>
    <template v-for="playerAnimator in miniversePlayers" :key="playerAnimator.player.id">
      <TresGroup :ref="el => setPlayersRef(el, playerAnimator.player.id)">
        <Player :username="playerAnimator.player.name" :animation="{ ...PlayerFloatAnimation, start: playerAnimator.animationStart }"/>
      </TresGroup>
    </template>
  </TresGroup>
</template>