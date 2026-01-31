<script setup lang="ts">
import {AnsiUp} from 'ansi_up';
import {inject, onUnmounted, ref, watch, nextTick, ComputedRef} from "vue";
import {Miniverse} from "@/models/miniverse";
import {WS_BASE} from "@/api/api";

const ansiUp = new AnsiUp();
ansiUp.use_classes = true;

const miniverse = inject<ComputedRef<Miniverse>>('miniverse')!;

const lines = ref<string[]>([]);
const consoleScreenRef = ref<HTMLElement | null>(null);
const userScrolledUp = ref(false);
const inputCommand = ref("");

function getWebsocketUrl(miniverseId: string): string {
  return `${WS_BASE}/miniverse/logs/${miniverseId}`;
}

function isScrolledToBottom(): boolean {
  if (!consoleScreenRef.value) return false;

  const el = consoleScreenRef.value;
  const tolerance = 5;
  return el.scrollHeight - el.scrollTop - el.clientHeight < tolerance;
}

function scrollToBottom() {
  if (consoleScreenRef.value) {
    consoleScreenRef.value.scrollTop = consoleScreenRef.value.scrollHeight;
  }
}

function sendCommand() {
  if (inputCommand.value) {
    websocket.value?.send(inputCommand.value)
    inputCommand.value = "";
  }
}

function handleScroll() {
  if (!consoleScreenRef.value) return;
  userScrolledUp.value = !isScrolledToBottom();
}

const websocket = ref<WebSocket | null>(null);
watch(miniverse, (newMiniverse) => {
  if (websocket.value) {
    websocket.value.close();
  }

  lines.value = [];
  userScrolledUp.value = false;

  websocket.value = new WebSocket(getWebsocketUrl(newMiniverse.id));

  websocket.value.onmessage = (event) => {
    const chunk = event.data as string;
    const newLines = chunk.split('\n');

    const shouldScrollAuto = !userScrolledUp.value || isScrolledToBottom();

    if (lines.value.length > 0 && !lines.value[lines.value.length - 1].endsWith('\n')) {
      lines.value[lines.value.length - 1] += newLines.shift() || '';
    }

    const rawLines = newLines.map(line => ansiUp.ansi_to_html(line));
    lines.value.push(...rawLines);

    if (shouldScrollAuto) {
      nextTick(scrollToBottom);
    }
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
        <div class="console-screen scrollbar" ref="consoleScreenRef" @scroll="handleScroll">
          <div v-for="(line, index) in lines" :key="index" v-html="line"></div>
        </div>
      </div>

      <div class="screen-wrapper">
        <input v-model="inputCommand" type="text" class="console-input" @keyup.enter="sendCommand"/>
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
  padding: 3px;
  box-sizing: border-box;
  background: var(--color-background-secondary);
  min-height: 0;
  display: flex;
  flex-direction: column;

  &:has(input) {
    min-height: auto;
  }
}

.console-screen {
  flex: 1;
  display: flex;
  flex-direction: column;
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
  height: 30px;
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

<style>
.ansi-red-fg { color: #ff5555; }
.ansi-green-fg { color: #50fa7b; }
.ansi-yellow-fg { color: #f1fa8c; }
.ansi-blue-fg { color: #6272a4; }
.ansi-magenta-fg { color: #ff79c6; }
.ansi-cyan-fg { color: #8be9fd; }
.ansi-white-fg { color: #f8f8f2; }
</style>