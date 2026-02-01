<script setup lang="ts">

import SearchBar from "@/components/ui/SearchBar.vue";
import {onMounted, ref, Ref} from "vue";
import {ModrinthSearchResult} from "@/models/mod";
import {apiSearchMods} from "@/api/mods";
import {useRoute, useRouter} from "vue-router";

const allModrinthMods: Ref<ModrinthSearchResult[]> = ref([]);

const router = useRouter();
const route = useRoute();

const search = ref("");

async function updateSearchedModrinthMods() {
  allModrinthMods.value = (await apiSearchMods(search.value)).hits;
  await router.replace({
    path: route.path,
    query: {...route.query, 'mod-search': search.value}
  })
}

onMounted(async () => {
  await updateSearchedModrinthMods();
});
</script>

<template>
  <div>
    <SearchBar class="search-bar" v-model="search" @change="updateSearchedModrinthMods" :debounce="1000"></SearchBar>
    <ul>
      <router-link style="width: 100%"  v-for="mod in allModrinthMods" :key="mod.project_id"
                   :to="{name: 'PresentationModSheetPage', params: {'modId': mod.project_id}}">
        <li>
          <img class="mod-icon" :src="mod.icon_url">
          <div class="text-info">
            <span class="mod-title">{{ mod.title }}</span>
            <span class="mod-description">{{ mod.description }}</span>
          </div>
        </li>
      </router-link>
    </ul>
  </div>

</template>

<style scoped>
@import "/src/assets/shared-styles/mods-lists.css";
</style>