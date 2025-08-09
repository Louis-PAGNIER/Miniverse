<script setup>
import {Vector2} from "three";
import {shallowRef, watch} from "vue";
import {useRenderLoop} from "@tresjs/core";
import * as THREE from "three";

const {onLoop} = useRenderLoop()

const uniforms = {
  uTime: { value: 0 },
  uAmplitude: { value: new Vector2(0.15, 0.15) },
  uFrequency: { value: new Vector2(35, 35) },
  uColor1: { value: new THREE.Color(0.6, 0.2, 1.0) },
  uColor2: { value: new THREE.Color(0.2, 1.0, 0.6) },
};

const props = defineProps({
  color1: {type: Array, default: () => [0.6, 0.2, 1.0]},
  color2: {type: Array, default: () => [0.2, 1.0, 0.6]},
  speed: {type: Number, default: 1.0},
});

const blobRef = shallowRef()

const vertexShader = `
uniform vec2 uAmplitude;
uniform vec2 uFrequency;
uniform float uTime;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

void main() {
    vec3 localPosition = position;
    localPosition.y += sin(localPosition.x * uFrequency.x - uTime) * uAmplitude.x;
    localPosition.x += cos(localPosition.y * uFrequency.y - uTime) * uAmplitude.y;

    vec4 modelPosition = modelMatrix * vec4(localPosition, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    gl_Position = projectionMatrix * viewPosition;

    vUv = uv;
    vNormal = normalMatrix * normal; // Transformer les normales locales en coordonnées du monde
    vPosition = modelPosition.xyz;
}
`

const fragmentShader = `
uniform vec3 uColor1;
uniform vec3 uColor2;
precision mediump float;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

void main() {
    vec3 normal = normalize(vNormal);
    vec3 viewDir = vec3(0.0, 0.0, 1.0);

    vec3 lightDir = normalize(vec3(5.0, 5.0, 0.0));
    float diff = max(dot(normal, lightDir), 0.2);

    float fresnel = pow(1.0 - dot(viewDir, normal), 2.0);

    float gradient = smoothstep(0.0, 1.0, vUv.y + fresnel * 0.3);

    vec3 baseColor = mix(uColor1, uColor2, gradient);

    vec3 lighting = baseColor * (0.5 + diff * 0.2) + vec3(fresnel * 1.8);

    gl_FragColor = vec4(lighting, 0.4);
}
`

watch(() => props.color1, (val) => {
  uniforms.uColor1.value.set(val[0], val[1], val[2]);
}, { immediate: true });

watch(() => props.color2, (val) => {
  uniforms.uColor2.value.set(val[0], val[1], val[2]);
}, { immediate: true });

onLoop(({delta, _}) => {
  if (blobRef.value) {
    blobRef.value.material.uniforms.uTime.value += delta * props.speed;
  }
})

</script>

<template>
  <TresGroup>
    <TresMesh :position="[0, 0, 0]" :renderOrder="1" ref="blobRef">
      <TresSphereGeometry :args="[4, 28, 28]" />
      <TresShaderMaterial
          :vertexShader="vertexShader"
          :fragmentShader="fragmentShader"
          :uniforms="uniforms"
          transparent
      />
    </TresMesh>

    <TresGroup>
      <slot />
    </TresGroup>
  </TresGroup>
</template>

<style scoped>

</style>