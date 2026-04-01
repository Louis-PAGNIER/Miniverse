<script setup lang="ts">
import {computed, onMounted, ref} from "vue";
import {Miniverse} from "@/models/miniverse";
import {MinecraftVersion} from "@/models/minecraftVersion";
import {MinecraftVersionType} from "@/models/enums/minecraftVersionType";
import {isReleaseVersion} from "@/composables/mcVersions";
import {apiGetMinecraftVersions} from "@/api/minecraft";
import {useAuthStore} from "@/stores/authStore";
import {useToastStore} from "@/stores/toastStore";

import Select from "@/components/ui/Select.vue";
import Input from "@/components/ui/Input.vue";
import ActionButton from "@/components/ui/ActionButton.vue";
import Divider from "@/components/ui/Divider.vue";
import Checkbox from "@/components/ui/Checkbox.vue";
import MessagePopup from "@/components/popups/MessagePopup.vue";
import {apiUpdateMiniverseInfo} from "@/api/miniverse";
import TextArea from "@/components/ui/TextArea.vue";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {faSave} from "@fortawesome/free-solid-svg-icons";
import {useMiniverseStore} from "@/stores/miniverseStore";

const authStore = useAuthStore();
const toastStore = useToastStore();
const miniverseStore = useMiniverseStore();
const miniverse = computed(() => miniverseStore.focusedMiniverse as Miniverse);

const newName = ref<string>('');
const newDescription = ref<string>('');
const newSubdomain = ref<string>('');
const newGameVersion = ref<string>('');
const newJavaVersion = ref<string>('');
const showSnapshots = ref(false);
const newAllowBedrock = ref(false);
const versions = ref<MinecraftVersion[]>([]);
const isUpdating = ref(false);
const showConfirmPopup = ref(false);

const options = computed(() => {
  return versions.value
      .filter(v => showSnapshots.value || v.version_type === MinecraftVersionType.RELEASE)
      .map(v => v.version);
});

const javaOptions = computed(() => {
  return ["java25", "java21", "java17", "java11", "java8"]
//   TODO : ask versions to backend
})

const hasGeneralInfoChanged = computed(() => {
  return newName.value !== miniverse.value.name ||
      newSubdomain.value !== miniverse.value.subdomain ||
      newDescription.value !== miniverse.value.description ||
      newAllowBedrock.value !== miniverse.value.allow_bedrock;
})

const hasGameVersionChanged = computed(() => {
  return newGameVersion.value !== miniverse.value.mc_version;
})

const hasJavaVersionChanged = computed(() => {
  return newGameVersion.value !== miniverse.value.java_version;
})

const hasChanged = computed(() => {
  return hasGeneralInfoChanged.value || hasGameVersionChanged.value || hasJavaVersionChanged.value;
});

onMounted(async () => {
  newName.value = miniverse.value.name;
  newDescription.value = miniverse.value.description;
  newSubdomain.value = miniverse.value.subdomain;
  newGameVersion.value = miniverse.value.mc_version;
  newJavaVersion.value = miniverse.value.java_version;
  newJavaVersion.value = miniverse.value.java_version;
  showSnapshots.value = !isReleaseVersion(miniverse.value.mc_version);
  newAllowBedrock.value = miniverse.value.allow_bedrock;

  versions.value = await apiGetMinecraftVersions(miniverse.value.mc_version);
});

async function handleSave() {
  if (newGameVersion.value !== miniverse.value.mc_version) {
    showConfirmPopup.value = true;
  } else {
    await submitChanges();
  }
}

async function submitChanges() {
  showConfirmPopup.value = false;
  isUpdating.value = true;

  try {
    await apiUpdateMiniverseInfo(
        miniverse.value.id,
        newName.value,
        newDescription.value,
        newSubdomain.value,
        newJavaVersion.value,
        newGameVersion.value,
        newAllowBedrock.value);
    toastStore.addToast('Configuration updated', 'Miniverse configuration successfully updated.');
  } finally {
    isUpdating.value = false;
  }
}
</script>

<template>
  <div class="info-sheet-page">
    <teleport defer to="#sheets-container">
      <ActionButton v-if="hasChanged"
                    class="save-button"
                    @click="handleSave"
                    :disabled="isUpdating"
                    severity="success"
      >
        <font-awesome-icon :icon="faSave"></font-awesome-icon>
        Save
      </ActionButton>
    </teleport>

    <div class="settings-grid">
      <section>
        <h2>Miniverse Settings</h2>

        <h4>Name</h4>
        <Input v-model="newName" placeholder="Name..."/>

        <h4>Domain</h4>
        <div class="domain-wrapper">
          <Input v-model="newSubdomain" placeholder="Subdomain..."/>
          <div class="domain-suffix">.miniverse.satsunfox.fr</div>
        </div>

        <h4>Description</h4>
        <TextArea style="width: 100%;" v-model="newDescription" placeholder="Description..."></TextArea>

        <h4>Bedrock</h4>
        <Checkbox
            v-if="authStore.isAdmin && !miniverse.is_on_lite_proxy"
            v-model="newAllowBedrock"
            label="Allow bedrock players"
        />
      </section>

      <Divider class="section-divider"/>

      <section>
        <h2>Minecraft Settings</h2>

        <h4>Type</h4>
        <Select
            v-model="miniverse.type"
            :options="[miniverse.type]"
            :disabled="true"
        />

        <h4>MC Version</h4>
        <div class="version-controls">
          <Select
              v-model="newGameVersion"
              :options="options"
              :disabled="!authStore.isAdmin"
          />
          <Checkbox
              v-if="authStore.isAdmin"
              v-model="showSnapshots"
              label="Include snapshots"
          />
        </div>

        <h4>Java Version</h4>
        <div class="version-controls">
          <Select
              v-model="newJavaVersion"
              :options="javaOptions"
              :disabled="!authStore.isAdmin"
          />
        </div>
      </section>
    </div>

    <MessagePopup
        v-model="showConfirmPopup"
        title="Update Version?"
        @ok="submitChanges"
    >
      Changing the version to {{ newGameVersion }} will require a server restart.
      Moreover, no server downgrade will be possible.
      Continue?
    </MessagePopup>
  </div>
</template>

<style scoped>
.domain-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
}

.domain-suffix {
  color: var(--color-secondary);
  font-size: 0.9rem;
  font-family: monospace;
}

.version-controls {
  display: flex;
  flex-direction: column;
}

.save-button {
  position: absolute;
  top: 1.25em;
  right: 1.25em;
}

.settings-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0;
}

section {
  flex: 1 1 400px;
  min-width: 300px;
}

.section-divider {
  display: block;
  width: 100%;
}

@media (min-width: 963px) {
  .section-divider {
    width: 1px !important;
    height: auto !important;
    align-self: stretch !important;
    margin: 0 20px !important;
  }
}
</style>