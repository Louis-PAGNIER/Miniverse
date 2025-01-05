<script setup>
import Entity from "@/components/Entity.vue";
import {playerTemplate} from "@/minecraftTemplates/PlayerTemplate.js";

const skinTexture = "/src/assets/louisleroisoleil.png";
</script>

<template>
  <TresGroup>
    <Entity :entityTemplate="playerTemplate" :entityTexture="skinTexture"/>
  </TresGroup>
</template>