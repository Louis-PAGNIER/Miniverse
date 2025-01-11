<script setup>
import {Vector2} from "three";
import {shallowRef} from "vue";
import {useRenderLoop} from "@tresjs/core";

const {onLoop} = useRenderLoop()

const uniforms = {
  uTime: {value: 0},
  uAmplitude: {value: new Vector2(0, 0.14)},
  uFrequency: {value: new Vector2(7, 7)},
}

const currentScale = shallowRef(1)
const targetScale = shallowRef(1)
const blobRef = shallowRef()

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

    vec3 lightDir = normalize(vec3(5.0, 5.0, 0.0));
    float diff = max(dot(normal, lightDir), 0.2); // Minimum pour éviter les ombres trop sombres

    float fresnel = pow(1.0 - dot(viewDir, normal), 2.5);

    float gradient = smoothstep(0.0, 1.0, vUv.y + fresnel * 0.4);

    // Couleurs vibrantes ajustées (violet et vert)
    vec3 color1 = vec3(0.6, 0.2, 1.0); // Violet avec une touche de douceur
    vec3 color2 = vec3(0.2, 1.0, 0.6); // Vert légèrement atténué
    vec3 baseColor = mix(color1, color2, gradient);

    // Combinaison des effets d'éclairage, Fresnel et couleur de base
    vec3 lighting = baseColor * (0.4 + diff * 0.2) + vec3(fresnel * 1.1);

    // Transparence légèrement augmentée
    gl_FragColor = vec4(lighting, 0.5);
}
`

onLoop(({_, elapsed}) => {
  if (blobRef.value) {
    blobRef.value.material.uniforms.uTime.value = elapsed

    currentScale.value += (targetScale.value - currentScale.value) * 0.1
    blobRef.value.scale.set(currentScale.value, currentScale.value, currentScale.value)
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
  <TresMesh
      :position="[0, 0, 0]"
      :renderOrder="1"
      ref="blobRef"
      @pointer-enter="handleMouseEnter"
      @pointer-leave="handleMouseLeave"
  >

    <TresSphereGeometry :args="[4, 16, 16]"/>
    <TresShaderMaterial :vertexShader="vertexShader" :fragmentShader="fragmentShader" :uniforms="uniforms" transparent/>

    <slot></slot>

  </TresMesh>
</template>

<style scoped>

</style>