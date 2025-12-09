<script setup lang="ts">
import BasePopup from "./BasePopup.vue";
import {computed, onMounted, ref, watch} from "vue";
import Select from "@/components/ui/Select.vue";
import {MiniverseType} from "@/models/enums/miniverseType";
import {MinecraftVersionType} from "@/models/enums/minecraftVersionType";
import {apiGetMinecraftVersions} from "@/api/minecraft";
import {MinecraftVersion} from "@/models/minecraftVersion";
import Checkbox from "@/components/ui/Checkbox.vue";
import Input from "@/components/ui/Input.vue";
import Button from "@/components/ui/Button.vue";
import {apiCreateMiniverse} from "@/api/miniverse";

const popupRef = ref<InstanceType<typeof BasePopup> | null>(null);
const showSnapshots = ref<boolean>(false);
const allVersions = ref<MinecraftVersion[]>([]);

const show = defineModel<boolean>({ default: false });

const emit = defineEmits<{
  (e: "create"): void;
  (e: "cancel"): void;
}>();

const miniverseType = ref<MiniverseType>(MiniverseType.VANILLA);
const versionsOptions = computed(() => {
  let filtered = allVersions.value.filter(v => showSnapshots.value || v.version_type === MinecraftVersionType.RELEASE);
  return filtered.map(v => v.version);
});
const miniverseSelectedVersion = ref<string>("");
const miniverseName = ref<string>("");
const miniverseSubdomain = ref<string>("");
const miniverseLiteProxy = ref<boolean>(true);
const miniverseLiteProxyDisabled = computed(() => miniverseType.value === MiniverseType.VANILLA);

const miniverseNameError = ref<boolean>(false);
const miniverseSubdomainError = ref<boolean>(false);

function validateName() {
  miniverseNameError.value = miniverseName.value.trim() === "";
}

function validateSubdomain() {
  const regex = /^[a-zA-Z0-9-]+$/;
  miniverseSubdomainError.value = !regex.test(miniverseSubdomain.value);
}

function clearInputs() {
  miniverseName.value = "";
  miniverseSubdomain.value = "";
  miniverseType.value = MiniverseType.VANILLA;
  miniverseLiteProxy.value = true;
  miniverseSelectedVersion.value = versionsOptions.value[0] || "";
  showSnapshots.value = false;
  miniverseNameError.value = false;
  miniverseSubdomainError.value = false;
}

async function createMiniverse() {
  validateName();
  validateSubdomain();
  if (!miniverseNameError.value && !miniverseSubdomainError.value) {
    await apiCreateMiniverse(
        miniverseName.value,
        "",
        miniverseType.value,
        miniverseSelectedVersion.value,
        miniverseSubdomain.value,
        miniverseLiteProxy.value
    );
    clearInputs();
    show.value = false;
    emit("create");
  }
}

onMounted(async () => {
  allVersions.value = await apiGetMinecraftVersions("1.16");
  miniverseSelectedVersion.value = versionsOptions.value[0] || "";
});

watch(miniverseName, validateName);
watch(miniverseSubdomain, validateSubdomain);
watch(miniverseType, (newType) => {
  if (newType === MiniverseType.VANILLA) {
    miniverseLiteProxy.value = true;
  }
});

watch(show, (newShow) => {
  if (newShow) {
    clearInputs();
    miniverseNameError.value = false;
    miniverseSubdomainError.value = false;
  }
});
</script>

<template>
  <BasePopup
      ref="popupRef"
      v-model="show"
      title="Create new Miniverse"
      close-on-outside-click
      show-footer
      @ok="emit('create')"
      @cancel="emit('cancel')"
  >
    <form>
      <div class="field">
        <span class="label">Name</span>
        <Input v-model="miniverseName" :error="miniverseNameError" placeholder="Server name..."/>
      </div>

      <div class="field">
        <span class="label">Type</span>
        <Select :options="Object.values(MiniverseType)" v-model="miniverseType" :allow-search="false" />
      </div>

      <div class="field">
        <span class="label">Minecraft Version</span>
        <Select :options=versionsOptions v-model="miniverseSelectedVersion" />
        <Checkbox v-model="showSnapshots" label="Show snapshot versions"></Checkbox>
      </div>

      <div class="field">
        <span class="label">Subdomain</span>
        <Input v-model="miniverseSubdomain" :error="miniverseSubdomainError" placeholder="Proxy subdomain..." />
        <Checkbox v-model="miniverseLiteProxy" :disabled="miniverseLiteProxyDisabled" label="Run on lite proxy"></Checkbox>
      </div>

    </form>
    <template #footer>
      <Button @click="popupRef?.close">Cancel</Button>
      <Button severity="primary" @click="createMiniverse">Create</Button>
    </template>
  </BasePopup>
</template>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.field {
  display: flex;
  flex-direction: column;
}

.label {
  font-weight: bold;
}
</style>