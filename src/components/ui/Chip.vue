<script setup lang="ts">
const props = defineProps<{
  background?: string;
}>();
</script>

<template>
<div class="chip" :style="{background: props.background ?? '#5e599a'}">
  <slot></slot>
</div>
</template>

<style scoped>
.chip {
  display: flex;
  border-radius: 500px;
  padding: 0 10px;
  margin: 2px 3px;
  width: fit-content;
  font-size: 0.9em;
  min-height: 24px;
  align-items: center;
}
</style>

<style>
.chip-list {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}
</style>