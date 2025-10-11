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
    <img :src="getIconSrc(icon)" alt="">
    <div class="column">
      <div class="value"><slot></slot></div>
      <div class="label">{{ label }}</div>
    </div>
  </div>
</template>

<style scoped>
.tile {
  background: var(--color-background-secondary);
  height: var(--cell-height);
  display: flex;
  gap: var(--cell-gap);
  padding: var(--padding-secondary);
  border-radius: 16px;
  align-items: center;
  flex: 1;
  min-width: 18.23em;
  max-width: 18.23em;
  cursor: pointer;
  transition: background 0.2s;
  overflow: hidden;

  &:hover {
    background: var(--color-background-tertiary);
  }

  img {
    aspect-ratio: 1 / 1;
    image-rendering: pixelated;
    border-radius: 15%;
    height: 100%;
  }

  .column {
    display: flex;
    flex-direction: column;
    justify-content: left;
    cursor: auto;
    white-space: nowrap;
  }

  .value {
    font-size: 1.5em;
    font-weight: bold;
    cursor: auto;
  }

  .label {
    color: var(--color-secondary);
  }


}
</style>