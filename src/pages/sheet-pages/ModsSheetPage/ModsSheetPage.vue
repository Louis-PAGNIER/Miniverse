<script setup lang="ts">
import Tabs from "@/components/ui/Tabs.vue";

const modsTabs = [
  { label: 'Installed', to: { name: 'InstalledModsSheetPage' } },
  { label: 'Search', to: { name: 'SearchModsSheetPage' } }
];
</script>

<template>
  <div class="mods-sheet-page">
    <h2>Mods</h2>

    <Tabs :tabs="modsTabs" />

    <router-view v-slot="{ Component }">
      <transition name="fade-slide" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>