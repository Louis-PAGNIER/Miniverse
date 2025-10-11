<script setup lang="ts">

const props = defineProps<{
  icon: string,
  label: string,
}>();

const icons = import.meta.glob('@/assets/icons/*', { eager: true, import: 'default' })

function getIconSrc(iconName: string): string {
  return icons[`/src/assets/icons/${iconName}`] as string
}

</script>

<template>
  <div class="tile">
    <div class="icon"><img :src="getIconSrc(icon)" alt=""></div>
    <div class="column">
      <div class="value"><slot></slot></div>
      <div class="label">{{ label }}</div>
    </div>
  </div>
</template>

<style scoped>
.tile {
  background: var(--color-background-secondary);
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
    background: var(--color-background-tertiary);
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
</style>