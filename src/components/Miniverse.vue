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
  uAmplitude: {value: new Vector2(0.14, 0.14)},
  uFrequency: {value: new Vector2(5, 5)},
}

const vertexShader = `
uniform vec2 uAmplitude;
uniform vec2 uFrequency;
uniform float uTime;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    modelPosition.y += sin(modelPosition.x * uFrequency.x - uTime) * uAmplitude.x;
    modelPosition.x += cos(modelPosition.y * uFrequency.y - uTime) * uAmplitude.y;

    vec4 viewPosition = viewMatrix * modelPosition;
    gl_Position = projectionMatrix * viewPosition;

    vUv = uv;
    vNormal = normalMatrix * normal; // Transform local normals to world space
    vPosition = modelPosition.xyz;
}
`

const fragmentShader = `
precision mediump float;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

void main() {
    vec3 normal = normalize(vNormal);
    vec3 viewDir = normalize(cameraPosition - vPosition);

    vec3 lightDir = normalize(vec3(7.0, 3.0, 4.0)) * 5.0;
    float diff = max(dot(normal, lightDir), 0.1); // Minimum d'éclairage pour éviter les zones trop sombres

    float fresnel = pow(1.0 - abs(dot(viewDir, normal)), 2.0);

    float gradient = smoothstep(0.25, 0.75, vUv.y);

    vec3 color1 = vec3(0.5, 0.2, 0.8);
    vec3 color2 = vec3(0.2, 0.8, 0.5);
    vec3 baseColor = mix(color1, color2, gradient);

    vec3 finalColor = baseColor * (0.5 + diff * 0.5) + vec3(fresnel * 0.2);

    gl_FragColor = vec4(finalColor, 0.35);
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
      <TresSphereGeometry :args="[4, 12, 12]"/>
      <TresShaderMaterial :vertexShader="vertexShader" :fragmentShader="fragmentShader" :uniforms="uniforms" transparent
                          depthWrite="false"/>

      <TresGroup ref="playerRef">
        <Player skin="/src/assets/louisleroisoleil.png" :animation="floatAnimation"></Player>
      </TresGroup>
    </TresMesh>

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