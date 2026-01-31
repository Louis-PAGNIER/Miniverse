<script setup lang="ts">

import Tabs from "@/components/ui/Tabs.vue";

const playerTabs = [
  { label: 'Connected', to: { name: 'ConnectedPlayersSheetPage' } },
  { label: 'Banned', to: { name: 'BannedPlayersSheetPage' } }
];
</script>

<template>
  <div class="players-sheet-page">
    <h2>Players</h2>

    <Tabs :tabs="playerTabs" />

    <router-view v-slot="{ Component }">
      <transition name="fade-slide" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>