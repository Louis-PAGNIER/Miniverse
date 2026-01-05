<script setup lang="ts">
import {computed, inject} from "vue";
import { Miniverse } from "@/models/miniverse";
import { useMiniverseStore } from "@/stores/miniverseStore";
import MiniverseSheetTile from "@/components/miniverse-sheet/MiniverseSheetTile.vue";
import MiniverseStartButton from "@/components/MiniverseStartButton.vue";
import {MiniverseType} from "@/models/enums/miniverseType";

const miniverse = inject<Miniverse>('miniverse')!;
const miniverseStore = useMiniverseStore();

const numberOfPlayers = computed(() =>
    miniverseStore.miniversePlayersLists.get(miniverse.id)?.length || 0
);

const supportMods = computed(() => {
  return [MiniverseType.FABRIC, MiniverseType.FORGE, MiniverseType.NEO_FORGE].includes(miniverse.type);
})

function titleCase(str: string): string {
  return str.toLowerCase().replace(/\b\w/g, s => s.toUpperCase());
}

function formatMemory(memory: number): string {
  if (memory === 0) return "0M";
  if (memory < 1_000_000) return (memory / 1_000_000).toFixed(2) + "M";
  return (memory / 1_000_000_000).toFixed(2) + "G";
}

const loaderIcon = computed(() => miniverse.type.toLowerCase() + ".png");
const statusIcon = computed(() => (miniverse.started ? "running.png" : "stoped.png"));
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