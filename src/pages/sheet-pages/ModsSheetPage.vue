<script setup lang="ts">
import {computed, ComputedRef, inject, onMounted, Ref, ref} from "vue";
import {Miniverse} from "@/models/miniverse";
import Tabs from "@/components/ui/Tabs.vue";
import Tab from "@/components/ui/Tab.vue";
import SearchBar from "@/components/ui/SearchBar.vue";
import {Mod, ModrinthSearchResult} from "@/models/mod";
import {apiSearchMods} from "@/api/mods";

const miniverse = inject<Miniverse>('miniverse')!;

const activeTab = ref("installedMods");
const search = ref("");

const allModrinthMods: Ref<ModrinthSearchResult[]> = ref([]);

async function updateSearchedModrinthMods() {
  allModrinthMods.value = (await apiSearchMods(search.value)).hits;
}

const filteredInstalledMods = computed(() => {
  const term = search.value.trim().toLowerCase();

  return [...miniverse.mods]
      .filter(m => m.title.toLowerCase().includes(term))
      .sort((a, b) => a.title.localeCompare(b.title));
});

onMounted(async () => {
  await updateSearchedModrinthMods();
});

</script>

<template>
  <div class="mods-sheet-page">

    <Tabs v-model="activeTab">
      <template #tabs>
        <Tab name="installedMods" label="Installed Mods"></Tab>
        <Tab name="searchMods" label="Search Mods"></Tab>
      </template>

      <template #installedMods>
        <SearchBar class="search-bar" v-model="search"></SearchBar>
        <ul>
          <li v-for="mod in filteredInstalledMods" :key="mod.id">
            <img class="mod-icon" :src="mod.icon_url">
            <div class="text-info">
              <span class="mod-title">{{ mod.title }}</span>
              <span class="mod-description">{{ mod.version_number }}</span>
            </div>
          </li>
        </ul>
      </template>

      <template #searchMods>
        <SearchBar class="search-bar" v-model="search" @change="updateSearchedModrinthMods" :debounce="1000"></SearchBar>
        <ul>
          <li v-for="mod in allModrinthMods" :key="mod.project_id">
            <img class="mod-icon" :src="mod.icon_url">
            <div class="text-info">
              <span class="mod-title">{{ mod.title }}</span>
              <span class="mod-description">{{ mod.description }}</span>
            </div>
          </li>
        </ul>
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

.search-bar {
  margin-bottom: 10px;
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
    flex: 1;
    min-width: 0;
    flex-direction: column;
    justify-content: space-between;
    padding: 5px 0;

    .mod-title {
      font-size: 1.4em;
      line-height: 0.75em;
      font-weight: 500;
    }

    .mod-description {
      width: 100%;
      font-size: 1em;
      color: var(--color-secondary);
      line-height: 1em;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
  }
}
</style>