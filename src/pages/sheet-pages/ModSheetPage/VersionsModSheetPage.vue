<script setup lang="ts">

import {openNewTab} from "@/composables/browser";
import Table, {Column} from "@/components/ui/Table.vue";
import Chip from "@/components/ui/Chip.vue";
import IconButton from "@/components/ui/IconButton.vue";
import {apiInstallMod} from "@/api/miniverse";
import {capitalize, ComputedRef, inject} from "vue";
import {Miniverse} from "@/models/miniverse";
import {useToastStore} from "@/stores/toastStore";
import {ModrinthProjectVersion} from "@/models/mod";
import {computeVersionRange, formatBigNumber, timeAgo} from "@/composables/format";

const miniverse = inject<ComputedRef<Miniverse>>('miniverse')!;
const toastStore = useToastStore();

const {
  modDetails,
  modAvailableVersions,
  installedVersionDetails
} = inject<any>('modContext');

async function installMod(versionId: string) {
  await apiInstallMod(miniverse.value.id, versionId)
  toastStore.addToast('Mod installed', `Mod ${modDetails.value?.title} installed successfully.`, 'success');
}

const versionsTableColumns: Column<ModrinthProjectVersion>[] = [
  {
    id: "version_type",
    name: "Type",
    class: "optional3",
    value: (v: ModrinthProjectVersion) => capitalize(v.version_type)
  },
  {id: "name", name: "Name", value: (v: ModrinthProjectVersion) => v},
  {id: "game_versions", name: "MC Versions", value: (v: ModrinthProjectVersion) => v.game_versions},
  {id: "loaders", name: "Platforms", value: (v: ModrinthProjectVersion) => v.loaders},
  {id: "date_published", name: "Published", class: "optional2", value: (v: ModrinthProjectVersion) => v.date_published},
  {id: "downloads", name: "Downloads", class: "optional1", value: (v: ModrinthProjectVersion) => v.downloads},
  {id: "actions", name: "Actions", value: (v: ModrinthProjectVersion) => v}
]
</script>

<template>
  <Table :columns="versionsTableColumns" :rows="modAvailableVersions" :row-key="row => row.id">
    <template #cell-name="{ value }">
      <div class="name-column">
        <span class="version-number">{{ value.version_number }}</span>
        <span class="version-name">{{ value.name }}</span>
      </div>
    </template>

    <template #cell-game_versions="{ value }">
      <Chip>{{ computeVersionRange(value) }}</Chip>
    </template>

    <template #cell-loaders="{ value }">
      <Chip v-for="loader of value">{{ loader }}</Chip>
    </template>

    <template #cell-date_published="{ value }">
      {{ timeAgo(value) }}
    </template>

    <template #cell-downloads="{ value }">
      {{ formatBigNumber(value) }}
    </template>

    <template #cell-actions="{ value }">
      <IconButton :disabled="value.id == installedVersionDetails?.id"
                  :icon="value.id == installedVersionDetails?.id ? 'check' : 'arrow-right-arrow-left'"
                  @click="installMod(value.id)"/>

      <IconButton icon="arrow-up-right-from-square"
                  severity="neutral"
                  @click="openNewTab(`https://modrinth.com/mod/${value.project_id}/version/${value.id}`)"/>
    </template>
  </Table>
</template>

<style scoped>

</style>