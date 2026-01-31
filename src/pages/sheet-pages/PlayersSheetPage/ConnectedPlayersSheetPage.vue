<script setup lang="ts">
import { computed, inject, ComputedRef } from "vue";
import { Miniverse } from "@/models/miniverse";
import { useMiniverseStore } from "@/stores/miniverseStore";
import { Player } from "@/models/player";
import { useToastStore } from "@/stores/toastStore";
import Table, {Column} from "@/components/ui/Table.vue";
import {apiBanPlayer, apiKickPlayer, apiSetPlayerOperator} from "@/api/miniverse";
import {
  faArrowRightFromBracket,
  faGavel,
  faPersonArrowDownToLine,
  faPersonArrowUpFromLine
} from "@fortawesome/free-solid-svg-icons";
import IconButton from "@/components/ui/IconButton.vue";
import Chip from "@/components/ui/Chip.vue";
import FlatPlayerHead from "@/components/FlatPlayerHead.vue";

const miniverse = inject<ComputedRef<Miniverse>>('miniverse')!;
const miniverseStore = useMiniverseStore();
const toastStore = useToastStore();

async function setPlayerOperator(player: Player, value: boolean) {
  await apiSetPlayerOperator(miniverse.value.id, player.id, value);
  if (value) {
    toastStore.addToast('Operator added', `${player.name} is now operator.`, 'success');
  } else {
    toastStore.addToast('Operator removed', `${player.name} is no longer operator.`, 'success');
  }
}

async function kickPlayer(player: Player, reason: string = 'You have been kicked by an administrator') {
  await apiKickPlayer(miniverse.value.id, player.id, reason);
  toastStore.addToast('Player kicked', `${player.name} has been kicked successfully.`, 'success');
}

async function banPlayer(player: Player, reason: string = 'You have been banned by an administrator') {
  await apiBanPlayer(miniverse.value.id, player.id, reason);
  toastStore.addToast('Player banned', `${player.name} has been banned successfully.`, 'success');
}

const players = computed(() => {
  const animators = miniverseStore.miniversePlayersLists.get(miniverse.value.id) || [];
  return animators.map((p) => p.player);
});

const connectedPlayersTableColumns: Column<Player>[] = [
  { id: "head", name: "", },
  { id: "username", name: "Username", value: (p: Player) => p.name, sortable: true },
  { id: "role", name: "Role", sortable: true, sortValue: (p: Player) => p.is_operator },
  { id: "actions", name: "Actions" },
]
</script>

<template>
  <div v-if="players.length === 0">
    No player connected.
  </div>
  <Table v-else :columns="connectedPlayersTableColumns" :rows="players" :row-key="player => player.id" height="5em" padding="0.5em">
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
</template>