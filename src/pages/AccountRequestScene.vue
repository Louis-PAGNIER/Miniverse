<script setup lang="ts">
import { useLoop } from "@tresjs/core";
import { ref, reactive } from "vue";
import { Color, Group, Vector3 } from "three";
import Blob from "@/components/3D/Blob.vue";
import { Stars } from "@tresjs/cientos";
import {PlayerFloatAnimation} from "@/assets/minecraft-animations/PlayerFloat";
import Player from "@/components/3D/Player.vue";

const DEFAULT_CAMERA_POSITION: Vector3 = new Vector3(-4, -40, 20);

const CAMERA_FOV: number = 30;

const SPEED = 0.3;
const ACCELERATION_INTENSITY = 0.5;

const numOrbiters = 7;
const a = 7;
const b = 5;

const focus = Math.sqrt(a * a - b * b);

const mainBlob = ref<Group>();
const orbiters = reactive(
    Array.from({ length: numOrbiters }, (_, i) => ({
      angle: (i / numOrbiters) * Math.PI * 2,
      ref: null as Group | null,
      rotationOffset: Math.random() * Math.PI * 2,
      rotationSpeed: 0.5 + Math.random()
    }))
);

const { onBeforeRender } = useLoop();

onBeforeRender(({ delta, elapsed }) => {
  mainBlob.value?.rotation.set(0, elapsed * 0.2, elapsed * 0.2);
  orbiters.forEach((orbiter) => {
    if (orbiter.ref) {
      const x = a * Math.cos(orbiter.angle) - focus;
      const y = b * Math.sin(orbiter.angle);

      orbiter.ref.position.set(x, y, 0);

      const currentRotation = elapsed * 0.2 * orbiter.rotationSpeed + orbiter.rotationOffset;
      orbiter.ref.rotation.set(0, currentRotation, currentRotation);

      const distance = Math.sqrt(x * x + y * y);
      const speedFactor = (10 / (distance + ACCELERATION_INTENSITY)) * SPEED;

      orbiter.angle += delta * speedFactor;
    }
  });
});
</script>

<template>
  <TresPerspectiveCamera :position="DEFAULT_CAMERA_POSITION" :lookAt="[-4.5, 0, 0]" :fov="CAMERA_FOV"/>
  <Stars :size="0.1" :radius="20"/>

  <TresGroup ref="mainBlob" :position="[-2, 0, 0]" :scale="[0.5, 0.5, 0.5]">
    <Blob :color1="new Color('#ff0055')" :color2="new Color('#4400ff')" :speed="0.5" />
  </TresGroup>

  <TresGroup
      v-for="(orbiter, index) in orbiters"
      :key="index"
      :ref="(el) => (orbiter.ref = el as Group)"
      :scale="[0.18, 0.18, 0.18]"
  >
    <Blob
        :color1="new Color(0.6, 0.2, 1.0)"
        :color2="new Color(0.2, 1.0, 0.6)"
        :speed="1.2"
    ></Blob>
    <TresGroup v-if="index == 1" ref="player1">
      <Player id="158bafb1-2898-4703-a443-0c1559945fd7" :animation="{ ...PlayerFloatAnimation, start: 0 }"/>
    </TresGroup>

    <TresGroup v-if="index == 4" ref="player1">
      <Player id="641e421d-0690-46f5-bb92-7c8a445ce20f" :animation="{ ...PlayerFloatAnimation, start: 256 }"/>
    </TresGroup>
  </TresGroup>

  <TresAmbientLight :intensity="0.7"/>
  <TresPointLight :position="[5, 5, 2]" :intensity="75"/>
</template>

<style scoped>

</style>