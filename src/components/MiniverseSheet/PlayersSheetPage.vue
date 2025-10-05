<script setup lang="ts">
import {computed, ComputedRef, inject} from "vue";
import {Miniverse} from "@/models/miniverse";
import {useMiniverseStore} from "@/stores/miniverseStore";
import FlatPlayerHead from "@/components/FlatPlayerHead.vue";
import {Player} from "@/models/player";

const miniverse = inject<Miniverse>('miniverse')!;
const miniverseStore = useMiniverseStore();

const players: ComputedRef<Player[]> = computed(() => {
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
        <FlatPlayerHead :username="player.name" />
        <div class="text-info">
          <span class="player-name">{{ player.name }}</span>
          <span class="player-role">Operator</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
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
  height: 80px;
  background: #3c3c3c;
  padding: 8px;
  border-radius: 10px;
  transition: background 0.2s;
  cursor: pointer;
  display: flex;
  flex-direction: row;
  gap: 15px;

  &:hover {
    background: #484848;
  }

  .text-info {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 5px 0;

    .player-name {
      font-size: 1.5em;
      line-height: 1em;
    }

    .player-role {
      font-size: 1.15em;
      color: #b5b5b5;
      line-height: 1em;
    }
  }
}

h2 {
  font-size: 1.75em;
  margin: 0;
  padding: 10px 0 0 0;
  font-weight: 500;
}
</style>