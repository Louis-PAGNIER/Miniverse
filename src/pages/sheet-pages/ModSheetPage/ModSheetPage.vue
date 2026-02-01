<script setup lang="ts">
import {computed, ComputedRef, inject, onMounted, provide, ref, Ref, watch} from "vue";
import {Miniverse} from "@/models/miniverse";
import {RouteLocationNormalizedLoadedGeneric, Router, useRoute, useRouter} from "vue-router";
import {apiGetModDetails, apiGetModVersionDetails, apiGetModVersions} from "@/api/mods";
import {ModrinthProject, ModrinthProjectVersion} from "@/models/mod";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {
  faDownload,
  faTags,
} from "@fortawesome/free-solid-svg-icons";
import {faHeart} from "@fortawesome/free-regular-svg-icons";
import {formatBigNumber} from "@/composables/format";


import Chip from "@/components/ui/Chip.vue";
import Tabs from "@/components/ui/Tabs.vue";
const miniverse = inject<ComputedRef<Miniverse>>('miniverse')!;

const route: RouteLocationNormalizedLoadedGeneric = useRoute();

const modId = computed(() => {
  return route.params['modId'] as string;
});

const modDetails: Ref<ModrinthProject | null> = ref(null);
const modAvailableVersions: Ref<ModrinthProjectVersion[]> = ref([]);
const installedVersionDetails: Ref<ModrinthProjectVersion | null> = ref(null);

const installedMod = computed(() => {
  return miniverse.value.mods.find(m => m.project_id === modId.value)
})

provide('modContext', {
  modId,
  modDetails,
  modAvailableVersions,
  installedVersionDetails,
  installedMod
});

watch(installedMod, async (newValue, oldValue) => {
  if (newValue) {
    installedVersionDetails.value = await apiGetModVersionDetails(newValue.version_id);
  } else {
    installedVersionDetails.value = null;
  }
  modAvailableVersions.value = modAvailableVersions.value;
}, {immediate: true})

onMounted(async () => {
  [modDetails.value, modAvailableVersions.value] = await Promise.all([
    apiGetModDetails(modId.value), apiGetModVersions(modId.value)
  ]);
})

const modTabs = [
  {label: 'Presentation', to: {name: 'PresentationModSheetPage'}},
  {label: 'Versions', to: {name: 'VersionsModSheetPage'}},
  {label: 'Gallery', to: {name: 'GalleryModSheetPage'}}
];
</script>

<template>
  <div class="main" v-if="modDetails">
    <div class="header">
      <img class="icon" :src="modDetails.icon_url"/>
      <div class="summary">
        <h3 class="title">{{ modDetails.title }}</h3>
        <p class="description">{{ modDetails.description }}</p>
        <div class="stats">
          <div class="stat">
            <FontAwesomeIcon :icon="faDownload"></FontAwesomeIcon>
            {{ formatBigNumber(modDetails.downloads) }}
          </div>
          <span class="separator"></span>
          <div class="stat">
            <FontAwesomeIcon :icon="faHeart"></FontAwesomeIcon>
            {{ formatBigNumber(modDetails.followers) }}
          </div>
          <span class="separator"></span>
          <div class="stat chip-list">
            <FontAwesomeIcon :icon="faTags"></FontAwesomeIcon>
            <Chip v-for="category of modDetails.categories">
              <span style="display: flex;">{{ category }}</span>
            </Chip>
          </div>
        </div>
      </div>
    </div>

    <br>
    <Tabs :tabs="modTabs"/>

    <router-view v-slot="{ Component }">
      <transition name="fade-slide" mode="out-in">
        <component :is="Component"/>
      </transition>
    </router-view>
  </div>

</template>

<style scoped>
.header {
  display: flex;
  flex-direction: row;
  margin-bottom: 10px;
  gap: 10px;

  .icon {
    width: 100px;
    background: var(--color-background-secondary);
    border-radius: 10px;
    aspect-ratio: 1;
    image-rendering: pixelated;
  }

  .summary {
    max-width: 600px;
    height: 100px;
    text-align: left;
    align-items: start;
    line-height: 1.1em;
    display: flex;
    flex-direction: column;

    .title {
      line-height: 1em;
      margin-bottom: 5px;
    }

    .description {
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;

      overflow: hidden;
      text-overflow: ellipsis;
    }

    .stats {
      display: flex;
      flex-direction: row;
      gap: 10px;
      margin-top: auto;
      text-transform: capitalize;
      align-items: center;
    }
  }
}
</style>