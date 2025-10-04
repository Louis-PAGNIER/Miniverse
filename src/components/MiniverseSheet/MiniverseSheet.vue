<script setup lang="ts">
import { Miniverse } from "@/models/miniverse";
import { provide } from "vue";

import Navigator from "@/components/MiniverseSheet/Navigator.vue";
import HomeSheetPage from "@/components/MiniverseSheet/HomeSheetPage.vue";
import PlayersSheetPage from "@/components/MiniverseSheet/PlayersSheetPage.vue";

const props = defineProps<{ miniverse: Miniverse }>();

provide('miniverse', props.miniverse);

const routes = {
  home: { name: "Home", component: HomeSheetPage },
  players: { name: "Players", component: PlayersSheetPage }
};
</script>

<template>
  <div class="presentation">
    <h1 class="title">{{ miniverse.name }}</h1>
    <Navigator
        :basePath="`/miniverse/${miniverse.id}`"
        :routes="routes"
    />
  </div>
</template>

<style scoped>
.presentation {
  width: calc(100% - 40px);
  max-width: 1400px;
  padding: 10px 20px;
  background: #2c2c2c;
  border-radius: 10px;
  margin: 0 auto;
  min-height: calc(100% - 40px);
  border: #5e5e5e 1px solid;
  color: white;
  font-size: 1.2em;

  & > .title {
    font-size: 2em;
    margin: 0;
    padding: 10px 0 0 0;
    font-weight: 600;
  }
}
</style>