<script setup lang="ts">
import {computed, ComputedRef, ref, watch} from 'vue';
import Player from "@/components/3D/Player.vue";
import Blob from "@/components/3D/Blob.vue";
import {generateFibonacciSphere} from "@/composables/maths";
import {useLoop} from "@tresjs/core";
import {Miniverse} from "@/models/miniverse";
import {useMiniverseStore} from "@/stores/miniverseStore";
import {arePlayerListsEqual, PlayerAnimator} from "@/models/player";
import {Color, Group} from "three";
import {InterpolationType} from "@/composables/animations";
import {PlayerFloatAnimation} from "@/assets/minecraft-animations/PlayerFloat";
import PlayerWrapper from "@/components/3D/PlayerWrapper.vue";
import {useStableRef} from "@/composables/useStableRef";

const props = defineProps<{
  miniverse: Miniverse
}>();

const store = useMiniverseStore();
const playersData = computed(() => store.playersMap.get(props.miniverse.id) || []);

const {ref: blobRef, getStable: getBlob} = useStableRef();

const positions = computed(() => {
  const count = playersData.value.length;
  return generateFibonacciSphere(count, 2.3);
});

const scaleFactor = computed(() => {
  const count = playersData.value.length;
  return count === 1 ? 1 : 1 / Math.pow(count, 0.35);
});

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

const explode = async () => {
  const blob = getBlob();
  if (blob?.explode) {
    await blob.explode();
  }
};

defineExpose({explode});
</script>

<template>
  <TresGroup>
    <Blob ref="blobRef" :color1="blobColors[0]" :color2="blobColors[1]" :speed="blobSpeed"/>

    <PlayerWrapper
        v-for="(player, index) in playersData"
        :key="player.id"
        :player="player"
        :targetPosition="positions[index]"
        :targetScale="scaleFactor"
    />
  </TresGroup>
</template>