<script setup lang="ts">
import { Mesh, Vector2 } from "three";
import { Ref, shallowRef, watch } from "vue";
import { useRenderLoop } from "@tresjs/core";
import * as THREE from "three";
import {interpolate, InterpolationType} from "@/composables/animations";

const { onLoop } = useRenderLoop();

const props = defineProps<{
  color1: THREE.Color,
  color2: THREE.Color,
  speed: number,
}>();

const uniforms = {
  uTime: { value: 0 },
  uAmplitude: { value: new Vector2(0.15, 0.15) },
  uFrequency: { value: new Vector2(35, 35) },
  uColor1: { value: props.color1 },
  uColor2: { value: props.color2 },
  uExplosion: { value: 0.0 },
};

const blobRef: Ref<Mesh | null> = shallowRef(null);

const vertexShader = `
uniform vec2 uAmplitude;
uniform vec2 uFrequency;
uniform float uTime;
uniform float uExplosion;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

float hash(float n) { return fract(sin(n) * 43758.5453123); }

void main() {
    vec3 localPosition = position;
    localPosition.y += sin(localPosition.x * uFrequency.x - uTime) * uAmplitude.x;
    localPosition.x += cos(localPosition.y * uFrequency.y - uTime) * uAmplitude.y;

    float offset = hash(dot(position.xyz, vec3(12.9898, 78.233, 45.164)));
    float explosionPower = uExplosion * 26.0 * (1.0 + offset);
    localPosition += normal * explosionPower;

    vec4 modelPosition = modelMatrix * vec4(localPosition, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    gl_Position = projectionMatrix * viewPosition;

    vUv = uv;
    vNormal = normalMatrix * normal;
    vPosition = modelPosition.xyz;

    gl_Position = projectionMatrix * viewMatrix * modelPosition;
}
`

const fragmentShader = `
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform float uExplosion;

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

    float alpha = clamp(0.4 - uExplosion, 0.0, 0.6);

    gl_FragColor = vec4(lighting, alpha);
}
`

const explode = (duration: number = 2.5): Promise<void> => {
  return new Promise((resolve) => {
    let elapsed = 0;

    const { off } = onLoop(({ delta }) => {
      elapsed += delta;

      const progress = Math.min(elapsed / duration, 1);

      console.log("progress", progress)

      uniforms.uExplosion.value = interpolate(0, 0.4, progress, InterpolationType.EASE_OUT);

      if (progress >= 1) {
        off();
        if (blobRef.value) blobRef.value.visible = false;
        resolve();
      }
    });
  });
};

watch(() => props.color1, (val) => { uniforms.uColor1.value = val; }, { immediate: true });
watch(() => props.color2, (val) => { uniforms.uColor2.value = val; }, { immediate: true });

onLoop(({delta}) => {
  if (blobRef.value) {
    uniforms.uTime.value += delta * props.speed;
  }
});

defineExpose({ explode });
</script>

<template>
  <TresGroup>
    <TresMesh :renderOrder="1" ref="blobRef">
      <TresIcosahedronGeometry :args="[4, 6]" />
      <TresShaderMaterial
          :depthWrite="false"
          :vertexShader="vertexShader"
          :fragmentShader="fragmentShader"
          :uniforms="uniforms"
          transparent
      />
    </TresMesh>
  </TresGroup>
</template>