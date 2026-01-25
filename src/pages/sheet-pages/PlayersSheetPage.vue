<script setup lang="ts">
import {computed, ComputedRef, inject} from "vue";
import {Miniverse} from "@/models/miniverse";
import {useMiniverseStore} from "@/stores/miniverseStore";
import FlatPlayerHead from "@/components/FlatPlayerHead.vue";
import {MSMPPlayerBan, Player} from "@/models/player";
import Table, {Column} from "@/components/ui/Table.vue";
import IconButton from "@/components/ui/IconButton.vue";
import {
  faArrowRightFromBracket,
  faGavel,
  faPersonArrowDownToLine,
  faPersonArrowUpFromLine,
} from "@fortawesome/free-solid-svg-icons";
import Chip from "@/components/ui/Chip.vue";
import {apiBanPlayer, apiKickPlayer, apiSetPlayerOperator, apiUnbanPlayer} from "@/api/miniverse";
import {RouteLocationNormalizedLoadedGeneric, Router, useRoute, useRouter} from "vue-router";
import Tabs from "@/components/ui/Tabs.vue";
import Tab from "@/components/ui/Tab.vue";
import {faFaceKissWinkHeart} from "@fortawesome/free-regular-svg-icons";
import {useToastStore} from "@/stores/toastStore";

const miniverse = inject<Miniverse>('miniverse')!;
const miniverseStore = useMiniverseStore();

const VALID_TABS = ["connected", "banned"];
const route: RouteLocationNormalizedLoadedGeneric = useRoute();
const router: Router = useRouter();

const players: ComputedRef<Player[]> = computed(() => {
  const animators = miniverseStore.miniversePlayersLists.get(miniverse.id) || [];
  return animators.map((p) => p.player);
});

const bannedPlayers: ComputedRef<MSMPPlayerBan[]> = computed(() => {
  return miniverseStore.miniverseBannedPlayersLists.get(miniverse.id) || [];
});

const toastStore = useToastStore();

const activeTab = computed({
  get() {
    const tab = route.query.tab as string;
    return VALID_TABS.includes(tab) ? tab : VALID_TABS[0];
  },
  set(tab) {
    router.replace({
      path: route.path,
      query: {...route.query, 'tab': tab}
    })
  }
});

const connectedPlayersTableColumns: Column<Player>[] = [
  { id: "head", name: "", },
  { id: "username", name: "Username", value: (p: Player) => p.name, sortable: true },
  { id: "role", name: "Role", sortable: true, sortValue: (p: Player) => p.is_operator },
  { id: "actions", name: "Actions" },
]

const bannedPlayersTableColumns: Column<MSMPPlayerBan>[] = [
  { id: "head", name: "", },
  { id: "username", name: "Username", value: (p: MSMPPlayerBan) => p.player.name, sortable: true },
  { id: "reason", name: "Reason", value: (p: MSMPPlayerBan) => p.reason },
  { id: "actions", name: "Actions" },
]

async function setPlayerOperator(player: Player, value: boolean) {
  await apiSetPlayerOperator(miniverse.id, player.id, value);
  if (value) {
    toastStore.addToast('Operator added', `${player.name} is now operator.`, 'success');
  } else {
    toastStore.addToast('Operator removed', `${player.name} is no longer operator.`, 'success');
  }
}

async function kickPlayer(player: Player, reason: string = 'You have been kicked by an administrator') {
  await apiKickPlayer(miniverse.id, player.id, reason);
  toastStore.addToast('Player kicked', `${player.name} has been kicked successfully.`, 'success');
}

async function banPlayer(player: Player, reason: string = 'You have been banned by an administrator') {
  await apiBanPlayer(miniverse.id, player.id, reason);
  toastStore.addToast('Player banned', `${player.name} has been banned successfully.`, 'success');
}

async function unbanPlayer(player: Player) {
  await apiUnbanPlayer(miniverse.id, player.id);
  toastStore.addToast('Player pardoned', `${player.name} is no longer banned.`, 'success');
}
</script>

<template>
  <div class="players-sheet-page">
    <h2>Players</h2>
    <Tabs v-model="activeTab">
      <template #tabs>
        <Tab name="connected" label="Connected"></Tab>
        <Tab name="banned" label="Banned"></Tab>
      </template>

      <template #connected>
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

      <template #banned>
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
    </Tabs>
  </div>
</template>
