<script setup lang="ts">
import EntityPart from "./EntityPart.vue";
import {DoubleSide, FrontSide, Group} from "three";
import {computed, ShallowRef, shallowRef} from "vue";
import {useLoop} from "@tresjs/core";
import {interpolateRotation} from "@/scripts/animations";
import {ModelTemplate} from "@/models/modelTemplate";
import {ModelAnimation} from "@/models/modelAnimation";

const props = defineProps<{
  template: ModelTemplate,
  materials: any,
  animation: ModelAnimation
}>();

const partRef: ShallowRef<Group | null> = shallowRef(null);
const animationIndex = shallowRef(0);

const anchorPosition = computed(() => {
  return props.template.position.clone().add(props.template.rotationCenter);
});

const meshPosition = computed(() => {
  return props.template.rotationCenter.clone().multiplyScalar(-1);
});

const {onBeforeRender} = useLoop();
onBeforeRender(({delta, elapsed}) => {
  if (!props.animation?.keyframes) {
    return;
  }

  const keyframes = props.animation.keyframes.get(props.template.id);
  if (keyframes !== undefined) {
    const duration = props.animation.duration
    const time = ((elapsed + props.animation.start * duration) % duration) / duration;
    const rot = interpolateRotation(time, keyframes, animationIndex);
    if (partRef.value) {
      partRef.value.rotation.setFromVector3(rot);
    }
    // Object.assign(partRef.value.rotation, {x: rot[0], y: rot[1], z: rot[2]});
  }
});
</script>

<template>
  <TresGroup ref="partRef" :position="anchorPosition">
    <TresMesh :position="meshPosition">
      <TresBoxGeometry :args="template.size.toArray()"/>
      <TresMeshStandardMaterial
          v-for="(texture, index) in materials[template.id]"
          :key="index"
          :map="texture"
          :transparent="template.transparent"
          :side="template.transparent ? DoubleSide : FrontSide"
          :alphaTest="template.transparent ? 0.0001 : 0"
          :attach="'material-' + index"
      />
      <template v-for="(child, childrenIndex) in template.children" :key="childrenIndex">
        <EntityPart :template="child" :materials="materials" :animation="animation"></EntityPart>
      </template>
    </TresMesh>
  </TresGroup>
</template>

<style scoped>

</style>