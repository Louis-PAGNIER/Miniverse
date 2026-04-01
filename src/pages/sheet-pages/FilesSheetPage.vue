<script setup lang="ts">
import {Miniverse} from "@/models/miniverse";
import FileBrowser from "@/components/ui/FileBrowser.vue";
import {useMiniverseStore} from "@/stores/miniverseStore";
import {computed} from "vue";

const miniverseStore = useMiniverseStore();
const miniverse = computed(() => miniverseStore.focusedMiniverse as Miniverse);
</script>

<template>
  <div class="files-sheet-page">
    <h2>Files</h2>
    <FileBrowser :miniverse="miniverse"></FileBrowser>
  </div>
</template>

<style scoped>

</style>