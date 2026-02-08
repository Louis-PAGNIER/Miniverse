<script setup lang="ts">

import {Html, Stars} from "@tresjs/cientos";
import {Color, Vector3} from "three";
import Blob from "@/components/3D/Blob.vue";
import {TresCanvas} from "@tresjs/core";

const DEFAULT_CAMERA_POSITION: Vector3 = new Vector3(0, 0, 40);
const CAMERA_FOV: number = 30;

</script>

<template>
  <TresCanvas window-size clear-color="black" :antialias="false">
    <TresPerspectiveCamera ref="cameraRef" :position="DEFAULT_CAMERA_POSITION" :fov="CAMERA_FOV"/>
    <Stars :size="0.1" :radius="20"/>

    <Blob :color1="new Color(0.6, 0.2, 1.0)" :color2="new Color(0.2, 1.0, 0.6)" :speed="1.0"></Blob>

    <TresAmbientLight :intensity="0.7"/>
    <TresPointLight :position="[5, 5, 2]" :intensity="75"/>

    <Html transform :distance-factor="4" :position="[0, 0, 0]" :scale="[1.5, 1.5, 1.5]">
    <div class="miniverse-name-wrapper">
      <h1 class="miniverse-name">
        Your account requires approval
      </h1>
      <h1 class="miniverse-name">
        Please contact an administrator
      </h1>
    </div>
    </Html>

  </TresCanvas>
</template>

<style scoped>

.miniverse-name {
  cursor: text;
}

.miniverse-name-wrapper {
  background: var(--color-background-primary);
  opacity: 0.8;
  padding: 8px 70px;
  border-radius: 8px;
}
</style>