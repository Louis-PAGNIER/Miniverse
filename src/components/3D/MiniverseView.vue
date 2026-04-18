<script setup lang="ts">
import {computed, ref, watch} from 'vue';
import Blob from "@/components/3D/Blob.vue";
import {generateFibonacciSphere} from "@/composables/maths";
import {Miniverse} from "@/models/miniverse";
import {useMiniverseStore} from "@/stores/miniverseStore";
import {Box3, Color, Vector3} from "three";
import PlayerWrapper from "@/components/3D/PlayerWrapper.vue";
import {useStableRef} from "@/composables/useStableRef";
import {useGLTF} from '@tresjs/cientos'
import {useLoop} from "@tresjs/core";

const { onBeforeRender } = useLoop();

const props = defineProps<{
  miniverse: Miniverse
}>();

const store = useMiniverseStore();
const playersData = computed(() => store.playersMap.get(props.miniverse.id) || []);

const {ref: blobRef, getStable: getBlob} = useStableRef();

const positions = computed(() => {
  const count = playersData.value.length;
  return generateFibonacciSphere(count, 2.3);
});

const scaleFactor = computed(() => {
  const count = playersData.value.length;
  return count === 1 ? 1 : 1 / Math.pow(count, 0.35);
});

const blobColors = computed(() => {
  if (props.miniverse.started) {
    return [
      new Color(0.6, 0.2, 1.0), new Color(0.2, 1.0, 0.6)
    ];
  } else {
    return [
      new Color(0.5, 0.5, 0.5), new Color(0.7, 0.7, 0.7)
    ];
  }
});

const blobSpeed = computed(() => {
  return props.miniverse.started ? 1.0 : 0.5;
});

const assemble = async () => {
  await blobRef.value.assemble();
};

const explode = async () => {
  await getBlob().explode();
};

defineExpose({assemble, explode});

/* Temporary code for Create Aeronautics */
const path = '/src/assets/misc/airship.glb'
const { state, nodes, materials } = useGLTF(path)

watch(() => state.value?.scene, (newScene) => {
  if (newScene) {
    const box = new Box3().setFromObject(newScene)
    const center = new Vector3()
    box.getCenter(center)

    newScene.position.sub(center)
    newScene.traverse((child) => {
      if (child?.isMesh) {
        if (child.material) {
          child.material.metalness = 0.1;
        }
      }
    })
  }
}, { immediate: true })

const airshipGroupRef = ref();
const orbitRadius = 5;
const orbitSpeed = 0.2;
onBeforeRender(({ elapsed }) => {
  if (airshipGroupRef.value) {
    const x = Math.cos(-elapsed * orbitSpeed) * orbitRadius
    const z = Math.sin(-elapsed * orbitSpeed) * orbitRadius

    airshipGroupRef.value.position.set(x, 1, z)

    airshipGroupRef.value.rotation.y = elapsed * orbitSpeed
  }
})
</script>

<template>
  <TresGroup>
    <Blob ref="blobRef" :color1="blobColors[0]" :color2="blobColors[1]" :speed="blobSpeed"/>

    <PlayerWrapper
        v-for="(player, index) in playersData"
        :key="player.id"
        :player="player"
        :targetPosition="positions[index]"
        :targetScale="scaleFactor"
    />

    <TresGroup v-if="miniverse.name.toLowerCase() === 'aeronautics'" ref="airshipGroupRef" :scale="[0.05, 0.05, 0.05]" :position="[0, 0, 0]" :rotation="[0, 0, 0]">
      <primitive v-if="state" :object="state?.scene" />
    </TresGroup>

  </TresGroup>
</template>