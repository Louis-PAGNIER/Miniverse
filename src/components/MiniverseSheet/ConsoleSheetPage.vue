<script setup lang="ts">
import {inject, ref, watch} from "vue";
import {Miniverse} from "@/models/miniverse";
import {WS_BASE} from "@/api/api";

const miniverse = inject<Miniverse>('miniverse')!;

const lines = ref<string[]>([]);

function getWebsocketUrl(miniverseId: string): string {
  return `${WS_BASE}/miniverse/logs/${miniverseId}`;
}

const websocket = ref<WebSocket | null>(null);
watch(miniverse, (newMiniverse) => {
  if (websocket.value) {
    console.log("Miniverse changed, closing previous WebSocket");
    websocket.value.close();
  }

  websocket.value = new WebSocket(getWebsocketUrl(newMiniverse.id));

  websocket.value.onmessage = (event) => {
    const chunk = event.data as string;
    const newLines = chunk.split('\n');
    // Check if the last previous line is incomplete
    if (lines.value.length > 0 && !lines.value[0].endsWith('\n')) {
      // Append the first new line to the last previous line
      lines.value[0] += newLines.shift() || '';
    }
    lines.value.unshift(...newLines);
  };

  websocket.value.onclose = () => {
    websocket.value = null;
  };

  websocket.value.onerror = (error) => {
    console.error("WebSocket error:", error);
    websocket.value?.close();
  };
}, {immediate: true});
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
    overflow-y: scroll;
    display: flex;
    flex-direction: column-reverse;
  }
}
</style>