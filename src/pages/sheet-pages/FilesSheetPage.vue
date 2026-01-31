<script setup lang="ts">
import {inject} from "vue";
import {Miniverse} from "@/models/miniverse";
import FileBrowser from "@/components/ui/FileBrowser.vue";

const miniverse = inject<Miniverse>('miniverse')!;
</script>

<template>
  <div class="files-sheet-page">
    <h2>Files</h2>
    <FileBrowser :miniverse="miniverse"></FileBrowser>
  </div>
</template>

<style scoped>

</style>