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
  uAssemble: { value: 1.0 },
};

const blobRef: Ref<Mesh | null> = shallowRef(null);

const vertexShader = `
uniform vec2 uAmplitude;
uniform vec2 uFrequency;
uniform float uTime;
uniform float uExplosion;
uniform float uAssemble;

varying vec2 vUv;
varying vec3 vNormal;
varying float vExplosionProgress;

float hash(vec3 p) {
    p = fract(p * 0.3183099 + 0.1);
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
}

float voronoiId(vec3 x) {
    vec3 p = floor(x);
    vec3 f = fract(x);
    float d = 8.0;
    float id = 0.0;

    for(int k=-1; k<=1; k++) {
        for(int j=-1; j<=1; j++) {
            for(int i=-1; i<=1; i++) {
                vec3 b = vec3(float(i), float(j), float(k));
                vec3 r = vec3(b) - f + hash(p + b);
                float pg = hash(p + b);
                float d_check = dot(r, r);

                if(d_check < d) {
                    d = d_check;
                    id = pg;
                }
            }
        }
    }
    return id;
}

mat3 rotationMatrix(vec3 axis, float angle) {
    axis = normalize(axis);
    float s = sin(angle);
    float c = cos(angle);
    float oc = 1.0 - c;
    return mat3(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.x * axis.z + axis.y * s,
                oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,
                oc * axis.x * axis.z - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c);
}

void main() {
    float cellId = voronoiId(position.xyz * 2.0);

    float faceProgress = smoothstep(cellId * 0.5, cellId * 0.5 + 0.5, uAssemble);
    vec3 localPosition = position * faceProgress;

    localPosition.y += sin(localPosition.x * uFrequency.x - uTime) * uAmplitude.x * faceProgress;
    localPosition.x += cos(localPosition.y * uFrequency.y - uTime) * uAmplitude.y * faceProgress;

    vec3 explodeDir = normalize(normal + (vec3(hash(vec3(cellId)), hash(vec3(cellId+1.0)), hash(vec3(cellId+2.0))) - 0.5) * 0.5);

    float explodePower = uExplosion * 10.0 * (1.0 + hash(vec3(cellId * 10.0)));

    vec3 rotationAxis = vec3(hash(vec3(cellId * 5.0)), hash(vec3(cellId * 6.0)), hash(vec3(cellId * 7.0)));
    float rotationAngle = uExplosion * 2.0 * (0.5 + hash(vec3(cellId * 8.0)));
    mat3 rotMat = rotationMatrix(rotationAxis, rotationAngle);

    localPosition = rotMat * localPosition;

    localPosition += explodeDir * explodePower;

    vec4 modelPosition = modelMatrix * vec4(localPosition, 1.0);
    vNormal = normalMatrix * (rotMat * normal);
    vUv = uv;
    vExplosionProgress = uExplosion;

    gl_Position = projectionMatrix * viewMatrix * modelPosition;
}
`

const fragmentShader = `
uniform vec3 uColor1;
uniform vec3 uColor2;

varying vec2 vUv;
varying vec3 vNormal;
varying float vExplosionProgress;

void main() {
    vec3 normal = normalize(vNormal);
    vec3 viewDir = vec3(0.0, 0.0, 1.0);
    vec3 lightDir = normalize(vec3(5.0, 5.0, 0.0));

    float diff = max(dot(normal, lightDir), 0.2);
    float fresnel = pow(1.0 - dot(viewDir, normal), 2.0);

    float gradient = smoothstep(0.0, 1.0, vUv.y + fresnel * 0.3);
    vec3 baseColor = mix(uColor1, uColor2, gradient);
    vec3 lighting = baseColor * (0.5 + diff * 0.2) + vec3(fresnel * 1.8);

    vec3 fireColor = vec3(1.0, 0.6, 0.2);

    float combustionIntensity = smoothstep(0.0, 0.5, vExplosionProgress) * smoothstep(1.0, 0.7, vExplosionProgress);
    lighting = mix(lighting, lighting + fireColor * 1.5, combustionIntensity * fresnel * 0.8);

    float alpha = clamp(0.4 - vExplosionProgress * 0.4, 0.0, 0.6);

    gl_FragColor = vec4(lighting, alpha);
}
`

const assemble = (duration: number = 2.0): Promise<void> => {
  return new Promise((resolve) => {
    uniforms.uAssemble.value = 0;
    if (blobRef.value) blobRef.value.visible = true;

    let elapsed = 0;
    const { off } = onLoop(({ delta }) => {
      elapsed += delta;
      const progress = Math.min(elapsed / duration, 1);

      uniforms.uAssemble.value = interpolate(0, 1, progress, InterpolationType.EASE_OUT);

      if (progress >= 1) {
        off();
        resolve();
      }
    });
  });
};

const explode = (duration: number = 2.0): Promise<void> => {
  return new Promise((resolve) => {
    let elapsed = 0;

    uniforms.uAssemble.value = 1.0;

    const { off } = onLoop(({ delta }) => {
      elapsed += delta;
      const progress = Math.min(elapsed / duration, 1);

      uniforms.uExplosion.value = interpolate(0.0, 1.0, progress, InterpolationType.EASE_OUT);

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

defineExpose({ assemble, explode });
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