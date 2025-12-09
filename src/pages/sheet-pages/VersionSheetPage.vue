<script setup lang="ts">
import {computed, inject, onMounted, ref} from "vue";
import {Miniverse} from "@/models/miniverse";
import Select from "@/components/ui/Select.vue";
import Checkbox from "@/components/ui/Checkbox.vue";
import {apiGetMinecraftVersions} from "@/api/minecraft";
import {MinecraftVersion} from "@/models/minecraftVersion";
import {MinecraftVersionType} from "@/models/enums/minecraftVersionType";
import {isReleaseVersion} from "@/composables/mcVersions";
import ActionButton from "@/components/ui/ActionButton.vue";
import MessagePopup from "@/components/popups/MessagePopup.vue";
import {apiUpdateMiniverseMCVersion} from "@/api/miniverse";
import {useAuthStore} from "@/stores/authStore";

const miniverse = inject<Miniverse>('miniverse')!;

const authStore = useAuthStore();

const selectedVersion = ref<string>(miniverse.mc_version);
const versions = ref<MinecraftVersion[]>([]);

const showSnapshots = ref(!isReleaseVersion(miniverse.mc_version));
const showPopup = ref(false);
const isUpdating = ref(false);

onMounted(async () => {
  versions.value = await apiGetMinecraftVersions(miniverse.mc_version);
});

const options = computed(() => {
  let filtered = versions.value.filter(v => showSnapshots.value || v.version_type === MinecraftVersionType.RELEASE);
  return filtered.map(v => v.version);
});

function showUpdateServerPopup() {
  showPopup.value = true;
}

async function updateServer() {
  showPopup.value = false;
  isUpdating.value = true;
  await apiUpdateMiniverseMCVersion(miniverse.id, selectedVersion.value);
  isUpdating.value = false;
}
</script>

<template>
  <div class="version-sheet-page">
    <h2>Version</h2>

    <Select v-model="selectedVersion" :options="options" :disabled="!authStore.isAdmin"></Select>
    <Checkbox v-model="showSnapshots" label="Show snapshot versions" :disabled="!authStore.isAdmin"></Checkbox>

    <ActionButton @click="showUpdateServerPopup" v-if="miniverse.mc_version !== selectedVersion" width="100px" :disabled="isUpdating" severity="warning" icon="download.svg">
      Update
    </ActionButton>

    <MessagePopup v-model="showPopup"
                  title="Update Miniverse ?"
                  :message="`Are you sure you want to update your miniverse to ${selectedVersion} ?`"
                  @ok="updateServer">
    </MessagePopup>
  </div>
</template>

<style scoped>
.version-sheet-page {
  display: flex;
  flex-direction: column;
}
</style>