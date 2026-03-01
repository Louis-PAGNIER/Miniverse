<script setup lang="ts">
import { computed, ComputedRef, inject, onMounted, ref } from "vue";
import { Miniverse } from "@/models/miniverse";
import { MinecraftVersion } from "@/models/minecraftVersion";
import { MinecraftVersionType } from "@/models/enums/minecraftVersionType";
import { isReleaseVersion } from "@/composables/mcVersions";
import { apiGetMinecraftVersions } from "@/api/minecraft";
import { useAuthStore } from "@/stores/authStore";
import { useToastStore } from "@/stores/toastStore";

import Select from "@/components/ui/Select.vue";
import Input from "@/components/ui/Input.vue";
import ActionButton from "@/components/ui/ActionButton.vue";
import Divider from "@/components/ui/Divider.vue";
import Checkbox from "@/components/ui/Checkbox.vue";
import MessagePopup from "@/components/popups/MessagePopup.vue";
import {apiUpdateMiniverseInfo} from "@/api/miniverse";

const miniverse = inject<ComputedRef<Miniverse>>('miniverse')!;
const authStore = useAuthStore();
const toastStore = useToastStore();

const newName = ref<string>('');
const newSubdomain = ref<string>('');
const selectedVersion = ref<string>('');
const showSnapshots = ref(false);
const versions = ref<MinecraftVersion[]>([]);
const isUpdating = ref(false);
const showConfirmPopup = ref(false);

const options = computed(() => {
  return versions.value
      .filter(v => showSnapshots.value || v.version_type === MinecraftVersionType.RELEASE)
      .map(v => v.version);
});

const hasGeneralInfoChanged = computed(() => {
  return newName.value !== miniverse.value.name ||
  newSubdomain.value !== miniverse.value.subdomain
})

const hasVersionChanged = computed(() => {
  return selectedVersion.value !== miniverse.value.mc_version;
})

const hasChanged = computed(() => {
  return hasGeneralInfoChanged.value || hasVersionChanged.value;
});

onMounted(async () => {
  newName.value = miniverse.value.name;
  newSubdomain.value = miniverse.value.subdomain;
  selectedVersion.value = miniverse.value.mc_version;
  showSnapshots.value = !isReleaseVersion(miniverse.value.mc_version);

  versions.value = await apiGetMinecraftVersions(miniverse.value.mc_version);
});

async function handleSave() {
  if (selectedVersion.value !== miniverse.value.mc_version) {
    showConfirmPopup.value = true;
  } else {
    await submitChanges();
  }
}

async function submitChanges() {
  showConfirmPopup.value = false;
  isUpdating.value = true;

  try {
    await apiUpdateMiniverseInfo(miniverse.value.id, newName.value, newSubdomain.value, selectedVersion.value);
    toastStore.addToast('Configuration updated', 'Miniverse configuration successfully updated.');
  } finally {
    isUpdating.value = false;
  }
}
</script>

<template>
  <div class="info-sheet-page">
    <section>
      <h2>General Settings</h2>

      <h4>Miniverse name</h4>
      <Input v-model="newName" placeholder="My awesome server" />

      <h4>Domain</h4>
      <div class="domain-wrapper">
        <Input v-model="newSubdomain" placeholder="subdomain" />
        <div class="domain-suffix">.miniverse.satsunfox.fr</div>
      </div>
    </section>

    <Divider />

    <section>
      <h2>Game Version</h2>
      <div class="version-controls">
        <Select
            v-model="selectedVersion"
            :options="options"
            :disabled="!authStore.isAdmin"
        />
        <Checkbox
            v-if="authStore.isAdmin"
            v-model="showSnapshots"
            label="Include snapshots"
        />
      </div>
    </section>

    <div v-if="hasChanged" class="save-bar">
      <Divider />
      <ActionButton
          @click="handleSave"
          :disabled="isUpdating"
          severity="success"
      >
        Save all changes
      </ActionButton>
    </div>

    <MessagePopup
        v-model="showConfirmPopup"
        title="Update Version?"
        @ok="submitChanges"
    >
      Changing the version to {{selectedVersion}} will require a server restart.
      Moreover, no server downgrade will be possible.
      Continue?
    </MessagePopup>
  </div>
</template>

<style scoped>
.info-sheet-page {
  min-height: 610px;
}

section {
  margin-bottom: 2rem;
}

.domain-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
}

.domain-suffix {
  color: #666;
  font-size: 0.9rem;
  font-family: monospace;
}

.version-controls {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.save-bar {
  margin-top: 20px;
}
</style>