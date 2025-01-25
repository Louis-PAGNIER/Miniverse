<script setup>

import {TresCanvas} from "@tresjs/core";
import System from "@/components/System.vue";
</script>

<template>
  <TresCanvas window-size clear-color="black" :antialias="false">
    <System></System>
  </TresCanvas>
</template>

<style scoped>

</style>