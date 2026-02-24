<script setup lang="ts">
import {computed, ComputedRef, inject, onMounted, ref} from "vue";
import {Miniverse} from "@/models/miniverse";
import Select from "@/components/ui/Select.vue";
import Input from "@/components/ui/Input.vue";
import ActionButton from "@/components/ui/ActionButton.vue";
import Divider from "@/components/ui/Divider.vue";

const miniverse = inject<ComputedRef<Miniverse>>('miniverse')!;

const newName = ref<string>();
const newType = ref<string>();
const newSubdomain = ref<string>();
const newDomain = ref('.miniverse.satsunfox.fr');

const hasChanged = computed(() => [newName.value !== miniverse.value.name, newType.value !== miniverse.value.type, newSubdomain.value !== miniverse.value.subdomain].some(x => x));

onMounted(() => {
  newName.value = miniverse.value.name;
  newType.value = miniverse.value.type;
  newSubdomain.value = miniverse.value.subdomain;
})
</script>

<template>
  <div class="version-sheet-page">
    <h2>Info</h2>

    <h4>Name</h4>
    <Input v-model="newName" placeholder="Miniverse name..."></Input>

    <h4>Type</h4>
    <Select v-model="newType" :options="[miniverse.type]" :disabled="true"></Select>

    <h4>Domain</h4>
    <div class="domain-wrapper">
      <Input v-model="newSubdomain" placeholder="Subdomain..."></Input>
      <Select v-model="newDomain" :options="['.miniverse.satsunfox.fr']" :allow-search="false"></Select>
    </div>

    <div v-if="hasChanged">
      <Divider></Divider>
      <ActionButton severity="success">Save changes</ActionButton>
    </div>
  </div>
</template>

<style scoped>
.version-sheet-page {
  display: flex;
  flex-direction: column;
  width: max-content;
  max-width: 100%;
}

.domain-wrapper {
  display: flex;
  flex-direction: row;
  gap: 10px;
}
</style>