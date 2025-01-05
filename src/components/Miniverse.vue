<script setup>
import {TresCanvas, useRenderLoop} from "@tresjs/core";
import {OrbitControls, Stars} from '@tresjs/cientos'
import {ref, shallowRef} from 'vue'
import {MeshPhysicalMaterial, Vector2} from "three";
import {extend} from '@tresjs/core'
import Player from "@/components/Player.vue";
import floatAnimation from "@/assets/minecraftAnimations/PlayerFloat.json";

extend({MeshPhysicalMaterial})

const blobRef = shallowRef()
const playerRef = shallowRef(null)
const currentScale = ref(1)
const targetScale = ref(1)

const uniforms = {
  uTime: {value: 0},
  uAmplitude: {value: new Vector2(0, 0.12)},
  uFrequency: {value: new Vector2(10, 50)},
}

const vertexShader = `
uniform vec2 uAmplitude;
uniform vec2 uFrequency;
uniform float uTime;

varying vec2 vUv;

void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    modelPosition.y += sin(modelPosition.x * uFrequency.x - uTime) * uAmplitude.x;
    modelPosition.x += cos(modelPosition.y * uFrequency.y - uTime) * uAmplitude.y;

    vec4 viewPosition = viewMatrix * modelPosition;
    gl_Position = projectionMatrix * viewPosition;
    vUv = uv;
}
`

const fragmentShader = `
precision mediump float;
varying vec2 vUv;

void main() {
    gl_FragColor = vec4(0.5, vUv.y, 0.5, 0.3);
}
`

const {onLoop} = useRenderLoop()

onLoop(({_, elapsed}) => {
  if (blobRef.value) {
    blobRef.value.material.uniforms.uTime.value = elapsed

    currentScale.value += (targetScale.value - currentScale.value) * 0.1
    blobRef.value.scale.set(currentScale.value, currentScale.value, currentScale.value)
  }

  if (playerRef.value) {
    playerRef.value.rotation.x = elapsed * 0.1
    playerRef.value.rotation.y = elapsed * 0.05
    playerRef.value.rotation.z = elapsed * 0.02
  }
})

const handleMouseEnter = () => {
  targetScale.value = 1.2
  document.body.style.cursor = 'pointer'
}

const handleMouseLeave = () => {
  targetScale.value = 1
  document.body.style.cursor = 'default'
}
</script>

<template>
  <TresCanvas window-size clear-color="black">
    <Stars :size="0.4"/>

    <TresPerspectiveCamera
        :position="[0, 0, 20]" :look-at="[0, 0, 0]"
    />

    <TresMesh
        ref="blobRef"
        :position="[0, 0, 0]"
        :renderOrder="1"
        @pointer-enter="handleMouseEnter"
        @pointer-leave="handleMouseLeave"
    >
      <TresSphereGeometry :args="[4, 24, 24]"/>
      <TresShaderMaterial :vertexShader="vertexShader" :fragmentShader="fragmentShader" :uniforms="uniforms" transparent
                          depthWrite="false"/>

      <TresGroup ref="playerRef">
        <Player skin="/src/assets/louisleroisoleil.png" :animation="floatAnimation"></Player>
      </TresGroup>
    </TresMesh>

    <TresAmbientLight :intensity="0.5"/>

    <TresPointLight
        :position="[5, 5, 0]"
        :intensity="50"
    />

    <OrbitControls/>
  </TresCanvas>
</template>

<style scoped>

</style>