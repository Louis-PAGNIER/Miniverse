<script setup lang="ts">
import {computed, inject} from "vue";
import {Miniverse} from "@/models/miniverse";
import {useMiniverseStore} from "@/stores/miniverseStore";

const miniverse = inject<Miniverse>('miniverse')!;
const miniverseStore = useMiniverseStore();

const players = computed(() => {
  const animators = miniverseStore.miniversePlayersLists.get(miniverse.id) || [];
  return animators.map((p) => p.player);
});
</script>

<template>
  <div class="players-sheet-page">
    <h2>Players</h2>
    <div v-if="players.length === 0">
      No players found.
    </div>
    <ul v-else>
      <li v-for="player in players" :key="player.id">
        {{ player.name }} ({{ player.id }})
      </li>
    </ul>
  </div>
</template>

<style scoped>

</style>