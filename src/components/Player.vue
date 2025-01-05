<script setup>
import Entity from "@/components/Entity.vue";
import playerTemplate from "@/assets/minecraftTemplates/PlayerTemplate.json";

const props = defineProps({
  skin: String,
  position: { type: Array, default: () => [0, 0, 0] },
  animation: {
    type: Object,
    required: false,
  }
});
</script>

<template>
  <TresGroup>
    <Entity :entityTemplate="playerTemplate" :entityTexture="skin" :position="position" :animation="animation"/>
  </TresGroup>
</template>