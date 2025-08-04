<script setup>
import {Vector2} from "three";
import {shallowRef} from "vue";
import {useRenderLoop} from "@tresjs/core";

const {onLoop} = useRenderLoop()

const uniforms = {
  uTime: {value: 0},
  uAmplitude: {value: new Vector2(0.15, 0.15)},
  uFrequency: {value: new Vector2(35, 35)},
}

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

    vec3 color1 = vec3(0.6, 0.2, 1.0); // Violet avec une touche de douceur
    vec3 color2 = vec3(0.2, 1.0, 0.6); // Vert légèrement atténué
    vec3 baseColor = mix(color1, color2, gradient);

    vec3 lighting = baseColor * (0.5 + diff * 0.2) + vec3(fresnel * 1.8);

    gl_FragColor = vec4(lighting, 0.4);
}
`

onLoop(({delta, _}) => {
  if (blobRef.value) {
    blobRef.value.material.uniforms.uTime.value += delta
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