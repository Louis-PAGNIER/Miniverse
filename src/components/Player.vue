<script setup>
import Entity from "@/components/Entity.vue";
import playerTemplate from "@/minecraftTemplates/PlayerTemplate.json";
import walkAnimation from "@/minecraftAnimations/PlayerWalk.json";

const props = defineProps({
  skin: String,
  position: { type: Array, default: () => [0, 0, 0] }
});
</script>

<template>
  <TresGroup>
    <Entity :entityTemplate="playerTemplate" :entityTexture="skin" :position="position" :animation="walkAnimation"/>
  </TresGroup>
</template>