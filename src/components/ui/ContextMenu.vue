<script setup lang="ts">
import {ref, onMounted, onUnmounted, computed} from 'vue'

export interface ContextMenuItem {
  label: string
  action: () => void
  disabled?: boolean | (() => boolean)
  visible?: boolean | (() => boolean)
}

const props = defineProps<{
  items: ContextMenuItem[]
}>()

const visible = ref(false)
const x = ref(0)
const y = ref(0)

function open(event: MouseEvent) {
  event.preventDefault()
  x.value = event.clientX
  y.value = event.clientY
  visible.value = true
}

function close() {
  visible.value = false
}

function onGlobalClick(e: MouseEvent) {
  if (visible.value) close()
}

function onKeyDown(e: KeyboardEvent) {
  if (e.key === 'Escape') close()
}

function isDisabled(item: ContextMenuItem): boolean {
  if (typeof item.disabled === 'function') {
    return item.disabled()
  }
  return !!item.disabled
}

function isVisible(item: ContextMenuItem): boolean {
  if (typeof item.visible === 'function') {
    return item.visible()
  }
  return item.visible === undefined || item.visible
}

const visibleItems = computed(() =>
    props.items.filter(i => isVisible(i))
)

defineExpose({ open, close })

onMounted(() => {
  window.addEventListener('click', onGlobalClick)
  window.addEventListener('keydown', onKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('click', onGlobalClick)
  window.removeEventListener('keydown', onKeyDown)
})
</script>

<template>
  <teleport to="body">
    <div
        v-if="visible"
        class="context-menu"
        :style="{ top: `${y}px`, left: `${x}px` }"
    >
      <div
          v-for="(item, i) in visibleItems"
          :key="i"
          class="item"
          :class="{ disabled: isDisabled(item) }"
          @click="!isDisabled(item) && (item.action(), close())"
      >
        {{ item.label }}
      </div>
    </div>
  </teleport>
</template>

<style scoped>
.context-menu {
  position: fixed;
  background: #1e1e1e;
  border: 1px solid #333;
  border-radius: 6px;
  min-width: 160px;
  box-shadow: 0 8px 20px rgba(0,0,0,.35);
  padding: 6px 0;
  z-index: 10000;
}

.item {
  padding: 8px 12px;
  cursor: pointer;
  color: #eee;
}

.item:hover {
  background: #333;
}

.item.disabled {
  opacity: 0.4;
  pointer-events: none;
}
</style>