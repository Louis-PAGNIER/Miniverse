<script setup lang="ts">
import { Miniverse } from "@/models/miniverse";
import { provide } from "vue";

import Navigator from "@/components/miniverse-sheet/Navigator.vue";
import {sheetPagesRoutes} from "@/router";

const props = defineProps<{ miniverse: Miniverse }>();

provide('miniverse', props.miniverse);

</script>

<template>
  <div class="presentation">
    <h1 class="title">{{ miniverse.name }}</h1>
    <div class="content">
      <Navigator
          :basePath="`/miniverse/${miniverse.id}`"
          :routes="sheetPagesRoutes"
      />
    </div>
  </div>
</template>

<style scoped>
.presentation {
  width: calc(100% - 40px);
  min-height: calc(50vh - 40px);
  max-width: 1400px;
  padding: 10px 20px;
  background: var(--color-background-primary);
  border-radius: 10px;
  margin: auto auto 20px auto;
  border: var(--color-border) 1px solid;
  font-size: 1.2em;

  & > .title {
    font-size: 2em;
    margin: 0;
    padding: 10px 0 0 0;
    font-weight: 600;
  }
}
</style>