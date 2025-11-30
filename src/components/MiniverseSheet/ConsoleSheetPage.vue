<script setup lang="ts">
import {inject, onUnmounted, ref, watch} from "vue";
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

onUnmounted(() => {
  if (websocket.value) {
    websocket.value.close();
  }
});
</script>

<template>
  <div class="console-sheet-page">
    <h2>Console</h2>
    <div class="console-wrapper">
      <div class="screen-wrapper">
        <div class="console-screen">
          <div v-for="(line, index) in lines" :key="index">{{ line }}</div>
        </div>
      </div>

      <div class="screen-wrapper">
        <input type="text" class="console-input" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.console-wrapper {
  width: 100%;
  max-height: 50vh;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.screen-wrapper {
  border-radius: 10px;
  border: var(--color-border) 1px solid;
  padding: 10px;
  box-sizing: border-box;
  background: var(--color-background-secondary);
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.console-screen {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column-reverse;
  overflow-y: auto;
  width: 100%;
  background: black;
  border-radius: 10px;
  color: white;
  font-family: monospace;
  padding: 10px;
  font-size: 0.75em;
}

.console-input {
  height: 40px;
  width: 100%;
  background: black;
  border-radius: 10px;
  color: white;
  font-family: monospace;
  padding: 0 10px;
  font-size: 0.75em;
  outline: none;
  border: none;
}

</style>