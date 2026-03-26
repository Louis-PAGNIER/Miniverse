<script setup lang="ts">
import {usePlayerAnimation} from "@/composables/playerAnimation";
import {useLoop} from "@tresjs/core";
import {MSMPPlayer} from "@/models/player";
import {Vector3} from "three";
import {ref, watch} from "vue";
import {InterpolationType} from "@/composables/animations";
import {PlayerFloatAnimation} from "@/assets/minecraft-animations/PlayerFloat";
import Player from "@/components/3D/Player.vue";

const props = defineProps<{
  player: MSMPPlayer,
  targetPosition: Vector3,
  targetScale: number
}>();

const groupRef = ref();
const {centerPositionAnimator, scale, animationStart, update} = usePlayerAnimation();

watch(() => props.targetPosition, (newPos) => {
  centerPositionAnimator.setGoal(newPos, 1000, InterpolationType.EASE_IN_OUT);
}, {immediate: true});

watch(() => props.targetScale, (newScale) => {
  scale.setGoal(newScale, 1000, InterpolationType.EASE_IN_OUT);
}, {immediate: true});

const {onBeforeRender} = useLoop();
onBeforeRender(({delta, elapsed}) => {
  update(delta, elapsed, groupRef.value);
});
</script>

<template>
  <TresGroup ref="groupRef">
    <Player :id="player.id" :animation="{ ...PlayerFloatAnimation, start: animationStart }"/>
  </TresGroup>
</template>