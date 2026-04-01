<script setup lang="ts">
import {computed} from "vue";
import {useMiniverseStore} from "@/stores/miniverseStore";
import MiniverseSheetTile from "@/components/miniverse-sheet/MiniverseSheetTile.vue";
import MiniverseStartButton from "@/components/MiniverseStartButton.vue";
import {MiniverseType} from "@/models/enums/miniverseType";
import {Miniverse} from "@/models/miniverse";

const miniverseStore = useMiniverseStore();
const miniverse = computed(() => miniverseStore.focusedMiniverse as Miniverse);

const numberOfPlayers = computed(() =>
    miniverseStore.playersMap.get(miniverse.value.id)?.length || 0
);

const supportMods = computed(() => {
  return [MiniverseType.FABRIC, MiniverseType.FORGE, MiniverseType.NEO_FORGE].includes(miniverse.value.type);
})

function titleCase(str: string): string {
  return str.toLowerCase().replace(/\b\w/g, s => s.toUpperCase());
}

const loaderIcon = computed(() => miniverse.value.type.toLowerCase() + ".png");
</script>

<template>
  <MiniverseStartButton :miniverse="miniverse"/>

  <p class="miniverse-description">{{ miniverse.description }}</p>

  <div class="summary">
    <router-link :to="`/miniverse/${miniverse.id}/info`">
      <MiniverseSheetTile :icon="loaderIcon" :label="miniverse.mc_version">{{
          titleCase(miniverse.type)
        }}
      </MiniverseSheetTile>
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