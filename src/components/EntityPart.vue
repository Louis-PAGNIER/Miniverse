<script setup>
import EntityPart from "./EntityPart.vue";
import {addArray, negArray} from "@/math.js";
import {DoubleSide, FrontSide} from "three";
defineProps({
  template: Object,
  materials: Object
})
</script>

<template>
  <TresGroup :position="addArray(template.rotationCenter, template.position)">
    <TresMesh ref="myRef" :position="negArray(template.rotationCenter)">
      <TresBoxGeometry :args="template.size"/>
      <TresMeshStandardMaterial
          v-for="(texture, index) in materials[template.id]"
          :key="index"
          :map="texture"
          :transparent="template.transparent"
          :side="template.transparent ? DoubleSide : FrontSide"
          :alphaTest="template.transparent ? 0.001 : 0"
          :attach="'material-' + index"
      />
      <template v-for="(child, index) in template.children" :key="index">
        <EntityPart :template="child" :materials="materials"></EntityPart>
      </template>
    </TresMesh>
  </TresGroup>
</template>

<style scoped>

</style>