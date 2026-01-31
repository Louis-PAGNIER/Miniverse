<script setup lang="ts">
import {computed, ComputedRef, inject} from "vue";
import { Miniverse } from "@/models/miniverse";
import { useMiniverseStore } from "@/stores/miniverseStore";
import MiniverseSheetTile from "@/components/miniverse-sheet/MiniverseSheetTile.vue";
import MiniverseStartButton from "@/components/MiniverseStartButton.vue";
import {MiniverseType} from "@/models/enums/miniverseType";

const miniverse = inject<ComputedRef<Miniverse>>('miniverse')!;
const miniverseStore = useMiniverseStore();

const numberOfPlayers = computed(() =>
    miniverseStore.miniversePlayersLists.get(miniverse.value.id)?.length || 0
);

const supportMods = computed(() => {
  return [MiniverseType.FABRIC, MiniverseType.FORGE, MiniverseType.NEO_FORGE].includes(miniverse.value.type);
})

function titleCase(str: string): string {
  console.log("miniverse", miniverse)
  return str.toLowerCase().replace(/\b\w/g, s => s.toUpperCase());
}

const loaderIcon = computed(() => miniverse.value.type.toLowerCase() + ".png");


</script>

<template>
  <MiniverseStartButton :miniverse="miniverse"/>

  <div class="summary">
    <MiniverseSheetTile icon="version.png" label="MC Version" @click="$router.push(`/miniverse/${miniverse.id}/version`)">{{ miniverse.mc_version }}</MiniverseSheetTile>
    <MiniverseSheetTile icon="player-head.png" label="Players" @click="$router.push(`/miniverse/${miniverse.id}/players`)">{{ numberOfPlayers }}/20</MiniverseSheetTile>
    <MiniverseSheetTile icon="console.png" label="$sh" @click="$router.push(`/miniverse/${miniverse.id}/console`)">Console</MiniverseSheetTile>
    <MiniverseSheetTile :icon="loaderIcon" label="Loader">{{ titleCase(miniverse.type) }}</MiniverseSheetTile>
    <MiniverseSheetTile icon="bookshelf.png" label="World data" @click="$router.push(`/miniverse/${miniverse.id}/files`)">Files</MiniverseSheetTile>
    <MiniverseSheetTile v-if="supportMods" icon="mods.png" label="Mods" @click="$router.push(`/miniverse/${miniverse.id}/mods`)">{{ miniverse.mods.length }}</MiniverseSheetTile>
  </div>
</template>

<style scoped>
.summary {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  padding: 16px 0;
  gap: var(--cell-gap);
}
</style>