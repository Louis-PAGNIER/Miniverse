<script setup>
import {computed} from "vue";

const props = defineProps({
  miniverse: { type: Object, required: true },
})

const numberOfPlayers = computed(() => {
  return props.miniverse.infos.connected_players.length;
});

function titleCase(str) {
  return str.toLowerCase().replace(/\b\w/g, s => s.toUpperCase());
}

function formatMemory(memory) {
  if (memory === 0) { return '0M'; }
  if (memory < 1_000_000) { return (memory / 1_000_000).toFixed(2) + 'M'; }
  return (memory / 1_000_000_000).toFixed(2) + 'G';
}

const loaderIcon = computed(() => {
  return new URL(`../assets/icons/${props.miniverse.server_type.toLowerCase()}.png`, import.meta.url).pathname;
})

const statusIcons = computed(() => {
  let url;
  switch (props.miniverse.status.toLowerCase()) {
    case 'running':
      url = '../assets/icons/running.png';
      break;
    case 'stopped':
    case 'exited':
      url = '../assets/icons/stopped.png';
      break;
    default:
      url = '../assets/icons/restarting.png';
      break;
  }
  return new URL(url, import.meta.url).pathname;
})
</script>

<template>
  <div class="presentation">
    <h1 class="title">{{ miniverse.name }}</h1>
    <div class="navigator"><span class="path">Home</span> ⟩ <span class="path">Settings</span></div>
    <div class="summary">

      <div class="tile">
        <div class="icon"><img src="@/assets/icons/version.png" alt="Version icon"></div>
        <div class="column">
          <div class="value">{{ miniverse.mc_version }}</div>
          <div class="label">MC Version</div>
        </div>
      </div>

      <div class="tile">
        <div class="icon"><img src="@/assets/icons/player-head.png" alt="Player icon"></div>
        <div class="column">
          <div class="value">{{ numberOfPlayers }}/{{ miniverse.max_players }}</div>
          <div class="label">Players</div>
        </div>
      </div>

      <div class="tile">
        <div class="icon"><img :src="loaderIcon" alt="Loader icon"></div>
        <div class="column">
          <div class="value">{{ titleCase(miniverse.server_type) }}</div>
          <div class="label">Loader</div>
        </div>
      </div>

      <div class="tile">
        <div class="icon"><img :src="statusIcons" alt="Status icon"></div>
        <div class="column">
          <div class="value">{{ titleCase(miniverse.status) }}</div>
          <div class="label">Status</div>
        </div>
      </div>

      <div class="tile">
        <div class="icon"><img src="@/assets/icons/cpu.png" alt="CPU icon"></div>
        <div class="column">
          <div class="value">{{ miniverse.infos.cpu_usage }}%</div>
          <div class="label">CPU</div>
        </div>
      </div>

      <div class="tile">
        <div class="icon"><img src="@/assets/icons/ram.png" alt="RAM icon"></div>
        <div class="column">
          <div class="value">{{ formatMemory(miniverse.infos.memory_used) }}/{{ formatMemory(miniverse.infos.memory_limit) }}</div>
          <div class="label">RAM</div>
        </div>
      </div>

    </div>
    <div class="mods">
      <h2>Installed mods</h2>
      <ul>
        <li v-for="mod in miniverse.infos.mods" :key="mod.name">
          <span class="mod-name">{{ mod.name }}</span>
          <span class="mod-version">v{{ mod.version }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.presentation {
  width: calc(100% - 40px);
  max-width: 1400px;
  padding: 10px 20px;
  background: #2c2c2c;
  border-radius: 10px;
  margin: 0 auto;
  min-height: calc(100% - 40px);
  border: #5e5e5e 1px solid;
  color: white;
  font-size: 1.2em;

  & > .title {
    font-size: 2em;
    margin: 0;
    padding: 10px 0 0 0;
    font-weight: 600;
  }
}

.summary {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  padding: 16px 0;
  gap: 20px;

  & > .tile {
    background: #3c3c3c;
    height: 6.5em;
    display: flex;
    gap: 20px;
    padding: 23px;
    border-radius: 16px;
    align-items: center;
    flex: 1;
    min-width: 16em;
    max-width: 18em;
    cursor: pointer;
    transition: background 0.2s;
    overflow: hidden;

    &:hover {
      background: #484848;
    }

    & > .icon, & > .icon > img {
      width: 4em;
      height: 4em;
      image-rendering: pixelated;
      border-radius: 8px;
      user-select: none;
      -webkit-user-drag: none;
    }

    & .column {
      display: flex;
      flex-direction: column;
      justify-content: left;
      cursor: auto;
      white-space: nowrap;
    }

    & .value {
      font-size: 1.5em;
      font-weight: bold;
      cursor: auto;
    }
  }
}

.navigator {
  color: #a0a0a0;
  font-weight: 600;
  cursor: default;

  & > .path {
    cursor: pointer;
    transition: color 0.2s;
    &:hover {
      color: white;
    }
  }
}
</style>