<script setup lang="ts">
import {computed, inject} from "vue";
import { Miniverse } from "@/models/miniverse";
import { useMiniverseStore } from "@/stores/miniverseStore";
import MiniverseSheetTile from "@/components/MiniverseSheet/MiniverseSheetTile.vue";
import MiniverseStartButton from "@/components/MiniverseStartButton.vue";

const miniverse = inject<Miniverse>('miniverse')!;
const miniverseStore = useMiniverseStore();

const numberOfPlayers = computed(() =>
    miniverseStore.miniversePlayersLists.get(miniverse.id)?.length || 0
);

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
    <MiniverseSheetTile icon="version.png" label="MC Version">{{ miniverse.mc_version }}</MiniverseSheetTile>
    <MiniverseSheetTile icon="player-head.png" label="Players" @click="$router.push(`/miniverse/${miniverse.id}/players`)">{{ numberOfPlayers }}/20</MiniverseSheetTile>
    <MiniverseSheetTile :icon="loaderIcon" label="Loader">{{ titleCase(miniverse.type) }}</MiniverseSheetTile>
    <MiniverseSheetTile :icon="statusIcon" label="Status">{{ miniverse.started ? 'Started' : 'Stopped' }}</MiniverseSheetTile>

    <div class="mods" v-if="miniverse.mods.length > 0">
      <h2>Installed mods</h2>
      <ul>
        <li v-for="mod in miniverse.mods" :key="mod.id">
          <span class="mod-name">{{ mod.title }}</span>
        </li>
      </ul>
    </div>
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