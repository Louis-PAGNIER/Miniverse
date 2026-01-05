<script setup lang="ts">
import {inject} from "vue";
import {Miniverse} from "@/models/miniverse";
import {useMiniverseStore} from "@/stores/miniverseStore";
import FileBrowser from "@/components/ui/FileBrowser.vue";

const miniverse = inject<Miniverse>('miniverse')!;
const miniverseStore = useMiniverseStore();
</script>

<template>
  <div class="files-sheet-page">
    <h2>Files</h2>
    <FileBrowser></FileBrowser>
  </div>
</template>

<style scoped>

</style>