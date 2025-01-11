<script setup>
import {TresCanvas, useRenderLoop} from "@tresjs/core";
import {OrbitControls, Stars} from '@tresjs/cientos'
import {shallowRef} from 'vue'
import {MeshPhysicalMaterial} from "three";
import {extend} from '@tresjs/core'
import Player from "@/components/Player.vue";
import floatAnimation from "@/assets/minecraftAnimations/PlayerFloat.json";
import Blob from "@/components/Blob.vue";

extend({MeshPhysicalMaterial})

const blobRef = shallowRef()
const playerRef = shallowRef(null)


const {onLoop} = useRenderLoop()

onLoop(({_, elapsed}) => {
  if (playerRef.value) {
    playerRef.value.rotation.x = elapsed * 0.1
    playerRef.value.rotation.y = elapsed * 0.05
    playerRef.value.rotation.z = elapsed * 0.02
  }
})
</script>

<template>
  <TresCanvas window-size clear-color="black">
    <Stars :size="0.4"/>

    <TresPerspectiveCamera
        :position="[0, 0, 20]" :look-at="[0, 0, 0]"
    />
      <Blob ref="blobRef">
        <TresGroup ref="playerRef">
          <Player skin="/src/assets/louisleroisoleil.png" :animation="floatAnimation"></Player>
        </TresGroup>
      </Blob>


    <TresAmbientLight :intensity="0.5"/>

    <TresPointLight
        :position="[5, 5, 2]"
        :intensity="75"
    />

    <OrbitControls/>
  </TresCanvas>
</template>

<style scoped>

</style>