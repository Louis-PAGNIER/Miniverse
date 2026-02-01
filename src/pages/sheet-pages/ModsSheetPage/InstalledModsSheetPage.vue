<script setup lang="ts">

import SearchBar from "@/components/ui/SearchBar.vue";
import {computed, ComputedRef, inject, onMounted, ref} from "vue";
import {Miniverse} from "@/models/miniverse";

const miniverse = inject<ComputedRef<Miniverse>>('miniverse')!;

const search = ref("");

const filteredInstalledMods = computed(() => {
  const term = search.value.trim().toLowerCase();

  return [...miniverse.value.mods]
      .filter(m => m.title.toLowerCase().includes(term))
      .sort((a, b) => a.title.localeCompare(b.title));
});

onMounted(() => {
  console.log("Bonjour installed")
})
</script>

<template>
  <div>
    <SearchBar class="search-bar" v-model="search"></SearchBar>
    <ul>
      <router-link style="width: 100%" v-for="mod in filteredInstalledMods" :key="mod.id"
                   :to="{name: 'PresentationModSheetPage', params: {'modId': mod.project_id}}">
        <li>
          <img class="mod-icon" :src="mod.icon_url">
          <div class="text-info">
            <span class="mod-title">{{ mod.title }}</span>
            <span class="mod-description">{{ mod.version_number }}</span>
          </div>
        </li>
      </router-link>
    </ul>
  </div>
</template>

<style scoped>
@import "/src/assets/shared-styles/mods-lists.css";
</style>