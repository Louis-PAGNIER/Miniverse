<script setup lang="ts">
import {inject, ref, watch} from "vue";
import {Miniverse} from "@/models/miniverse";

const miniverse = inject<Miniverse>('miniverse')!;

const lines = ref<string[]>([
    "[INFO] Console initialized.",
    `[INFO] Starting Miniverse: ${miniverse.name}`,
    "[INFO] Loading world...",
    "[INFO] World loaded successfully.",
    "[INFO] Server is now running.",
]);
</script>

<template>
<div class="console-sheet-page">
  <h2>Console</h2>
  <div class="console-wrapper">
    <div class="console-screen">
      <div v-for="(line, index) in lines" :key="index">{{ line }}</div>
    </div>
  </div>
</div>
</template>

<style scoped>
.console-wrapper {
  width: 100%;
  height: 60vh;
  background: var(--color-background-secondary);
  border-radius: 10px;
  border: var(--color-border) 1px solid;
  padding: 10px;
  box-sizing: border-box;
  display: flex;

  .console-screen {
    width: 100%;
    height: 100%;
    background: black;
    border-radius: 10px;
    box-sizing: border-box;
    color: white;
    font-family: monospace;
    padding: 10px;
    font-size: 0.75em;
    overflow-y: auto;
  }
}
</style>