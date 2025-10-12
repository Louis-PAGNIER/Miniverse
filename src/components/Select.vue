<script setup lang="ts">
import {computed, nextTick, onMounted, onUnmounted, ref} from "vue";

const props = defineProps<{
  options: string[];
  disabled?: boolean;
}>();

const selected = defineModel<string>({ default: '' });

const isOpen = ref(false);
const search = ref("");

const dropdownRef = ref<HTMLElement | null>(null);
const searchInput = ref<HTMLInputElement | null>(null);
const optionsListRef = ref<HTMLElement | null>(null);

const filteredOptions = computed(() =>
    props.options.filter(opt =>
        opt.toLowerCase().includes(search.value.toLowerCase())
    )
);

function toggleIsOpen() {
  isOpen.value = !isOpen.value;
  if (isOpen.value) {
    nextTick(() => {
      searchInput.value?.focus();
      scrollToSelected();
    })
  }
}

function scrollToSelected() {
  const list = optionsListRef.value;
  if (!list) return;

  const activeOption = list.querySelector(".option.active") as HTMLElement | null;
  if (activeOption) {
    activeOption.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }
}

function selectOption(opt: string) {
  selected.value = opt;
  isOpen.value = false;
  search.value = "";
}

function handleClickOutside(event: MouseEvent) {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isOpen.value = false;
  }
}

onMounted(() => document.addEventListener("click", handleClickOutside));
onUnmounted(() => document.removeEventListener("click", handleClickOutside));
</script>

<template>
  <div class="custom-select" :class="{'disabled': disabled}" ref="dropdownRef">
    <div class="select-display" :class="{'disabled': disabled}" @click="toggleIsOpen">
      {{ selected || 'Select an option...' }}
      <span class="arrow" :class="{ open: isOpen }">▼</span>
    </div>

    <div v-if="isOpen" class="dropdown">
      <input ref="searchInput"
             type="text"
             v-model="search"
             placeholder="Search version..."
             class="search-input"
      />

      <div class="options-list" ref="optionsListRef">
        <div v-for="opt in filteredOptions"
             :key="opt"
             class="option"
             :class="{ active: opt === selected }"
             @click="selectOption(opt)"
        >
          {{ opt }}
        </div>

        <div v-if="filteredOptions.length === 0" class="no-result">
          No matching version
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-select {
  position: relative;
  width: 250px;
  margin: 5px 0;
  user-select: none;

  &.disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

.select-display {
  border: 1px solid var(--color-border);
  background: var(--color-background-secondary);
  border-radius: 8px;
  padding: 0 12px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: var(--color-primary);
  cursor: pointer;
  transition: 0.2s;

  &.disabled {
    cursor: not-allowed;
    pointer-events: none;
  }
}

.select-display:hover {
  border-color: var(--color-primary);
}

.arrow {
  transition: transform 0.2s;
  font-size: 0.8em;
  user-select: none;
  -webkit-user-select: none;
}

.arrow.open {
  transform: rotate(180deg);
}

.dropdown {
  position: absolute;
  top: 45px;
  left: 0;
  right: 0;
  border: 1px solid var(--color-border);
  background: var(--color-background-secondary);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
  z-index: 10;
}

.search-input {
  width: 100%;
  border: none;
  border-bottom: 1px solid var(--color-border);
  padding: 8px 12px;
  outline: none;
  background: var(--color-background-primary);
  color: var(--color-primary);
  font-size: 0.9em;
}

.options-list {
  max-height: 200px;
  overflow-y: auto;
}

.option {
  padding: 10px 12px;
  cursor: pointer;
  transition: 0.15s;
}

.option:hover {
  background: var(--color-background-primary);
}

.option.active {
  font-weight: bold;
  background: var(--color-background-primary);
}

.no-result {
  padding: 10px 12px;
  color: var(--color-secondary);
  font-style: italic;
}
</style>