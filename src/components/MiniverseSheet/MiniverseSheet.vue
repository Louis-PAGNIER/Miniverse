<script setup lang="ts">
import {computed} from "vue";
import {Miniverse} from "@/models/miniverse";
import {useMiniverseStore} from "@/stores/miniverseStore";
import MiniverseSheetTile from "@/components/MiniverseSheet/MiniverseSheetTile.vue";

const miniverseStore = useMiniverseStore();
const props = defineProps<{
  miniverse: Miniverse,
}>();

const numberOfPlayers = computed(() => {
  return miniverseStore.miniversePlayersLists.get(props.miniverse.id)?.length || 0;
});

function titleCase(str: string): string {
  return str.toLowerCase().replace(/\b\w/g, s => s.toUpperCase());
}

function formatMemory(memory: number): string {
  if (memory === 0) { return '0M'; }
  if (memory < 1_000_000) { return (memory / 1_000_000).toFixed(2) + 'M'; }
  return (memory / 1_000_000_000).toFixed(2) + 'G';
}

const loaderIcon = computed(() => {
  return props.miniverse.type.toLowerCase() + '.png';
})

const statusIcon = computed(() => {
  return props.miniverse.started ? 'running.png' : 'stoped.png';
})
</script>

<template>
  <div class="presentation">
    <h1 class="title">{{ miniverse.name }}</h1>
    <div class="navigator"><span class="path">Home</span> ⟩ <span class="path">Settings</span></div>
    <div class="summary">

      <MiniverseSheetTile icon="version.png" label="MC Version">{{ miniverse.mc_version }}</MiniverseSheetTile>
      <MiniverseSheetTile icon="player-head.png" label="Players">{{ numberOfPlayers }}/20</MiniverseSheetTile>
      <MiniverseSheetTile :icon="loaderIcon" label="Loader">{{ titleCase(miniverse.type) }}</MiniverseSheetTile>
      <MiniverseSheetTile :icon="statusIcon" label="Status">{{ miniverse.started ? 'Started' : 'Stoped' }}</MiniverseSheetTile>

    </div>
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

.summary {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  padding: 16px 0;
  gap: 20px;
}

.navigator {
  color: #a0a0a0;
  font-weight: 600;
  cursor: default;

  & > .path {
    cursor: pointer;
    transition: color 0.2s;
    &:hover {
      color: white;
    }
  }
}
</style>