<script setup lang="ts">
import {computed, inject, ref} from "vue";
import {Miniverse} from "@/models/miniverse";
import Tabs from "@/components/Tabs.vue";
import Tab from "@/components/Tab.vue";
import FlatPlayerHead from "@/components/FlatPlayerHead.vue";

const miniverse = inject<Miniverse>('miniverse')!;

const sortedInstalledMods = computed(() => {
  return [...miniverse.mods].sort((a, b) => a.title.localeCompare(b.title));
});

const activeTab = ref("installedMods");
</script>

<template>
  <div class="mods-sheet-page">

    <Tabs v-model="activeTab">
      <template #tabs>
        <Tab name="installedMods" label="Installed Mods"></Tab>
        <Tab name="searchMods" label="Search Mods"></Tab>
      </template>

      <template #installedMods>
        <ul>
          <li v-for="mod in sortedInstalledMods" :key="mod.id">
            <img class="mod-icon" :src="mod.icon_url">
            <div class="text-info">
              <span class="mod-title">{{ mod.title }}</span>
              <span class="mod-description">{{ mod.version_number }}</span>
            </div>
          </li>
        </ul>
      </template>

      <template #searchMods>
        <h2>Search Mods</h2>
      </template>
    </Tabs>
  </div>
</template>

<style scoped>
.mod-icon {
  aspect-ratio: 1 / 1;
  image-rendering: pixelated;
  border-radius: 15%;
  max-width: 100%;
  max-height: 100%;
  background: var(--color-background-primary);
}

ul {
  padding: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

li {
  list-style: none;
  margin-bottom: 10px;
  width: 100%;
  height: 4.5em;
  background: var(--color-background-secondary);
  padding: var(--padding-secondary);
  border-radius: 10px;
  transition: background 0.2s;
  cursor: pointer;
  display: flex;
  flex-direction: row;
  gap: 15px;

  &:hover {
    background: var(--color-background-tertiary);
  }

  .text-info {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 5px 0;

    .mod-title {
      font-size: 1.5em;
      line-height: 0.75em;
      font-weight: 500;
    }

    .mod-description {
      font-size: 1em;
      color: var(--color-secondary);
      line-height: 1em;
    }
  }
}
</style>