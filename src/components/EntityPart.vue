<script setup>
import EntityPart from "./EntityPart.vue";
import {addArray, negArray} from "@/math.js";
import {DoubleSide, FrontSide} from "three";
import {shallowRef} from "vue";
import {useLoop} from "@tresjs/core";
import {interpolateRotation} from "@/animations.js";

const props = defineProps({
  template: Object,
  materials: Object,
  animation: {
    type: Object,
    required: false,
  }
})

const partRef = shallowRef()
const rotation = shallowRef([0, 0, 0]);

const {onBeforeRender} = useLoop();

onBeforeRender(({delta, elapsed}) => {
  if (props.animation?.keyframes[props.template.id]) {
    const time = (elapsed % props.animation.duration) / props.animation.duration;
    rotation.value = interpolateRotation(time, props.animation.keyframes[props.template.id]);
  }
});
</script>

<template>
  <TresGroup ref="partRef" :position="addArray(template.rotationCenter, template.position)" :rotation="rotation">
    <TresMesh :position="negArray(template.rotationCenter)">
      <TresBoxGeometry :args="template.size"/>
      <TresMeshStandardMaterial
          v-for="(texture, index) in materials[template.id]"
          :key="index"
          :map="texture"
          :transparent="template.transparent"
          :side="template.transparent ? DoubleSide : FrontSide"
          :alphaTest="template.transparent ? 0.0001 : 0"
          :attach="'material-' + index"
      />
      <template v-for="(child, index) in template.children" :key="index">
        <EntityPart :template="child" :materials="materials" :animation="animation"></EntityPart>
      </template>
    </TresMesh>
  </TresGroup>
</template>

<style scoped>

</style>