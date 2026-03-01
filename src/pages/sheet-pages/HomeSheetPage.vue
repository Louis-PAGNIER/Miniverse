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

  <p class="miniverse-description">{{ miniverse.description }}</p>

  <div class="summary">
    <router-link :to="`/miniverse/${miniverse.id}/info`">
      <MiniverseSheetTile :icon="loaderIcon" :label="miniverse.mc_version">{{ titleCase(miniverse.type) }}</MiniverseSheetTile>
    </router-link>

    <router-link :to="`/miniverse/${miniverse.id}/players`">
      <MiniverseSheetTile icon="player-head.png" label="Players">{{ numberOfPlayers }}/20</MiniverseSheetTile>
    </router-link>

    <router-link :to="`/miniverse/${miniverse.id}/console`">
      <MiniverseSheetTile icon="console.png" label="$sh">Console</MiniverseSheetTile>
    </router-link>

    <router-link :to="`/miniverse/${miniverse.id}/files`">
      <MiniverseSheetTile icon="bookshelf.png" label="World data">Files</MiniverseSheetTile>
    </router-link>

    <router-link :to="`/miniverse/${miniverse.id}/mods`" v-if="supportMods">
      <MiniverseSheetTile icon="mods.png" label="Mods">{{ miniverse.mods.length }}</MiniverseSheetTile>
    </router-link>

    <router-link :to="`/miniverse/${miniverse.id}/permissions`">
      <MiniverseSheetTile icon="permissions.png" label="Manage">Permissions</MiniverseSheetTile>
    </router-link>
  </div>
</template>

<style scoped>
.summary {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  padding: 0;
  gap: var(--cell-gap);
}

.miniverse-description {
  margin-top: 1em;
  margin-bottom: 0.5em;
  color: var(--color-secondary);
  line-height: 1em;
  max-width: 600px;
}

a {
  text-decoration: none;
}
</style>