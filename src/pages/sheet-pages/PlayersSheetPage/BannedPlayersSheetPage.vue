<script setup lang="ts">

import {faFaceKissWinkHeart} from "@fortawesome/free-regular-svg-icons";
import IconButton from "@/components/ui/IconButton.vue";
import Table, {Column} from "@/components/ui/Table.vue";
import FlatPlayerHead from "@/components/FlatPlayerHead.vue";
import {MSMPPlayerBan, Player} from "@/models/player";
import {computed, ComputedRef, inject} from "vue";
import {Miniverse} from "@/models/miniverse";
import {useMiniverseStore} from "@/stores/miniverseStore";
import {useToastStore} from "@/stores/toastStore";
import {apiUnbanPlayer} from "@/api/miniverse";

const miniverse = inject<ComputedRef<Miniverse>>('miniverse')!;
const miniverseStore = useMiniverseStore();
const toastStore = useToastStore();

const bannedPlayers: ComputedRef<MSMPPlayerBan[]> = computed(() => {
  return miniverseStore.miniverseBannedPlayersLists.get(miniverse.value.id) || [];
});

async function unbanPlayer(player: Player) {
  await apiUnbanPlayer(miniverse.value.id, player.id);
  toastStore.addToast('Player pardoned', `${player.name} is no longer banned.`, 'success');
}

const bannedPlayersTableColumns: Column<MSMPPlayerBan>[] = [
  { id: "head", name: "", },
  { id: "username", name: "Username", value: (p: MSMPPlayerBan) => p.player.name, sortable: true },
  { id: "reason", name: "Reason", value: (p: MSMPPlayerBan) => p.reason },
  { id: "actions", name: "Actions" },
]
</script>

<template>
  <div v-if="bannedPlayers.length === 0">
    No player banned.
  </div>
  <Table v-else :columns="bannedPlayersTableColumns" :rows="bannedPlayers" :row-key="ban => ban.player.id" height="5em" padding="0.5em">
    <template #cell-head="{ value }">
      <FlatPlayerHead :id="value.player.id" />
    </template>
    <template #cell-actions="{ value }">
      <IconButton :icon="faFaceKissWinkHeart" @click="() => unbanPlayer(value.player)"></IconButton>
    </template>
  </Table>
</template>

<style scoped>

</style>