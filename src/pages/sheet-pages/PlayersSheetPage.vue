<script setup lang="ts">
import {computed, ComputedRef, inject} from "vue";
import {Miniverse} from "@/models/miniverse";
import {useMiniverseStore} from "@/stores/miniverseStore";
import FlatPlayerHead from "@/components/FlatPlayerHead.vue";
import {Player} from "@/models/player";
import Table, {Column} from "@/components/ui/Table.vue";
import IconButton from "@/components/ui/IconButton.vue";
import {
  faArrowRightFromBracket,
  faGavel,
  faPersonArrowDownToLine,
  faPersonArrowUpFromLine,
} from "@fortawesome/free-solid-svg-icons";
import Chip from "@/components/ui/Chip.vue";
import {apiBanPlayer, apiKickPlayer, apiSetPlayerOperator} from "@/api/miniverse";

const miniverse = inject<Miniverse>('miniverse')!;
const miniverseStore = useMiniverseStore();

const players: ComputedRef<Player[]> = computed(() => {
  const animators = miniverseStore.miniversePlayersLists.get(miniverse.id) || [];
  return animators.map((p) => p.player);
});

const playersTableColumns: Column<Player>[] = [
  { id: "head", name: "", },
  { id: "username", name: "Username", value: (p: Player) => p.name, sortable: true },
  { id: "role", name: "Role", sortable: true, sortValue: (p: Player) => p.is_operator },
  { id: "actions", name: "Actions" },
]

async function setPlayerOperator(player: Player, value: boolean) {
  await apiSetPlayerOperator(miniverse.id, player.id, value);
}

async function kickPlayer(player: Player, reason: string = 'You have been kicked by an administrator') {
  await apiKickPlayer(miniverse.id, player.id, reason);
}

async function banPlayer(player: Player, reason: string = 'You have been banned by an administrator') {
  await apiBanPlayer(miniverse.id, player.id, reason);
}
</script>

<template>
  <div class="players-sheet-page">
    <h2>Players</h2>
    <div v-if="players.length === 0">
      No players found.
    </div>
    <Table v-else :columns="playersTableColumns" :rows="players" :row-key="player => player.id" height="5em" padding="0.5em">
      <template #cell-head="{ value }">
        <FlatPlayerHead :id="value.id" />
      </template>
      <template #cell-role="{ value }">
        <Chip v-if="value.is_operator">Operator</Chip>
        <Chip v-else>Player</Chip>
      </template>
      <template #cell-actions="{ value }">
        <IconButton v-if="value.is_operator" :icon="faPersonArrowDownToLine" severity="danger" @click="() => setPlayerOperator(value, false)"></IconButton>
        <IconButton v-else :icon="faPersonArrowUpFromLine" @click="() => setPlayerOperator(value, true)"></IconButton>
        <span class="separator"></span>
        <IconButton :icon="faGavel" severity="danger" @click="() => banPlayer(value)"></IconButton>
        <IconButton :icon="faArrowRightFromBracket" severity="danger" @click="() => kickPlayer(value)"></IconButton>
      </template>
    </Table>
  </div>
</template>
