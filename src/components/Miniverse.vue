<script setup>
import {TresCanvas, useRenderLoop} from "@tresjs/core";
import { OrbitControls, Stars, MeshGlassMaterial, MeshWobbleMaterial, Sphere } from '@tresjs/cientos'
import {ref, shallowRef} from 'vue'
import {MeshPhysicalMaterial, Vector2} from "three";
import { extend } from '@tresjs/core'

extend({ MeshPhysicalMaterial })

const blobRef = shallowRef(null)
const isHovered = ref(false)
const currentScale = ref(1)
const targetScale = ref(1)

const uniforms = {
  uTime: { value: 0 },
  uAmplitude: { value: new Vector2(0, 0.05) },
  uFrequency: { value: new Vector2(20, 5) },
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
    gl_FragColor = vec4(0.5, vUv.y, 0.5, 0.5);
}
`

const { onLoop } = useRenderLoop()

onLoop(({ delta, elapsed }) => {
  if (blobRef.value) {
    blobRef.value.material.uniforms.uTime.value = elapsed

    currentScale.value += (targetScale.value - currentScale.value) * 0.1  // Adjust the speed here
    blobRef.value.scale.set(currentScale.value, currentScale.value, currentScale.value)
  }
})

const handleMouseEnter = () => {
  targetScale.value = 1.2  // Target scale when hovered
  document.body.style.cursor = 'pointer'
}

const handleMouseLeave = () => {
  targetScale.value = 1  // Target scale when not hovered
  document.body.style.cursor = 'default'
}
</script>

<template>
  <TresCanvas window-size clear-color="black">
    <Stars :size="0.4" />

    <TresPerspectiveCamera
      :position="[3, 3, 3]" :look-at="[0, 0, 0]"
    />

    <TresMesh
        ref="blobRef"
        :position="[0, 0, 0]"
        :renderOrder="1"
        @pointer-enter="handleMouseEnter"
        @pointer-leave="handleMouseLeave"
    >
      <TresSphereGeometry :args="[1, 24, 24]" />
      <TresShaderMaterial :vertexShader="vertexShader" :fragmentShader="fragmentShader" :uniforms="uniforms" transparent depthWrite="false"/>
    </TresMesh>

    <TresAmbientLight :intensity="0.1" />

    <TresPointLight
        :position="[5, 5, 0]"
        :intensity="10"
    />

    <OrbitControls/>
  </TresCanvas>
</template>

<style scoped>

</style>