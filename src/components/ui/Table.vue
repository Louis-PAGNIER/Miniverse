<script setup lang="ts" generic="T extends Record<string, any>">
import {computed, ref} from "vue";

export interface Column<T, V = unknown> {
  id: string
  name: string
  class?: string
  width?: string

  value: (row: T) => V
  sortable?: boolean
  sortValue?: (row: T) => any
}

const props = defineProps<{
  columns: Column<T>[]
  rows: T[]
  padding?: string
  selectable?: boolean

  rowKey: (row: T) => string | number
  selectedKeys?: Array<string | number>
  defaultSort?: { columnId: string; order: 'asc' | 'desc' }
}>();

defineSlots<{
  [K in string]?: (props: {
    value: any
    row: T
  }) => any
}>();

const emit = defineEmits<{
  (e: 'update:selectedKeys', value: Array<string | number>): void
  (e: 'update:sort', sort: { columnId: string; order: 'asc' | 'desc' } | null): void
  (e: 'row-click', row: T, event: MouseEvent): void,
  (e: 'row-dblclick', row: T, event: MouseEvent): void,
  (e: 'row-context-menu', row: T, event: MouseEvent): void,
}>()

type SortState = { columnId: string; order: 'asc' | 'desc' } | null;
const sortState = ref<SortState>(props.defaultSort ? { ...props.defaultSort } : null);
const lastSelectedKey = ref<string | number | null>(null)

const sortedRows = computed(() => {
  if (!sortState.value) return props.rows

  const col = props.columns.find(c => c.id === sortState.value!.columnId)
  if (!col) return props.rows

  return [...props.rows].sort((a, b) => {
    const col = props.columns.find(c => c.id === sortState.value!.columnId);
    if (!col) return 0;

    const aValue = col.sortValue ? col.sortValue(a) : col.value(a);
    const bValue = col.sortValue ? col.sortValue(b) : col.value(b);

    if (aValue == null && bValue != null) return -1;
    if (aValue != null && bValue == null) return 1;
    if (aValue == null && bValue == null) return 0;

    // @ts-ignore
    if (aValue < bValue) return sortState.value!.order === 'asc' ? -1 : 1;
    // @ts-ignore
    if (aValue > bValue) return sortState.value!.order === 'asc' ? 1 : -1;
    return 0;
  })
})

const isSelected = (row: T) => props.selectedKeys?.includes(props.rowKey(row)) ?? false

const toggleSort = (col: Column<T>) => {
  if (!col.sortable) return

  if (!sortState.value || sortState.value.columnId !== col.id) {
    sortState.value = { columnId: col.id, order: 'asc' }
  } else if (sortState.value.order === 'asc') {
    sortState.value.order = 'desc'
  } else {
    sortState.value.order = 'asc'
  }

  emit('update:sort', sortState.value)
}

const handleSelection = (row: T, index: number, event: MouseEvent) => {
  if (!props.selectable) return;

  const key = props.rowKey(row);
  const selected = props.selectedKeys ?? [];

  // SHIFT
  if (event.shiftKey && lastSelectedKey.value !== null) {
    const rows = sortedRows.value;

    const startIndex = rows.findIndex(
        r => props.rowKey(r) === lastSelectedKey.value
    );

    const endIndex = rows.findIndex(
        r => props.rowKey(r) === key
    );

    if (startIndex !== -1 && endIndex !== -1) {
      const start = Math.min(startIndex, endIndex);
      const end = Math.max(startIndex, endIndex);

      const rangeKeys = rows
          .slice(start, end + 1)
          .map(r => props.rowKey(r));

      emit(
          'update:selectedKeys',
          Array.from(new Set([...selected, ...rangeKeys]))
      );
    }
  }

  // CTRL / CMD
  else if (event.ctrlKey || event.metaKey) {
    emit(
        'update:selectedKeys',
        selected.includes(key)
            ? selected.filter(k => k !== key)
            : [...selected, key]
    );
  }

  // CLICK
  else {
    emit('update:selectedKeys', [key]);
  }

  lastSelectedKey.value = key;
}
</script>

<template>
  <table :style="{ '--cell-padding': padding ?? '15px' }">
    <thead>
    <tr>
      <th
          v-for="col in columns"
          :key="col.id"
          :class="[col.class, { sortable: col.sortable }]"
          :style="{ width: col.width, cursor: col.sortable ? 'pointer' : 'default' }"
          @click="() => toggleSort(col)"
      >
        {{ col.name }}

        <span v-if="col.sortable" class="sort-indicator">
          <span v-if="sortState?.columnId === col.id" class="sort-icon">
            {{ sortState.order === 'asc' ? '▲' : '▼' }}
          </span>
          <span v-else class="sort-placeholder">▲</span>
        </span>
      </th>
    </tr>
    </thead>

    <tbody>
    <tr v-for="(row, i) in sortedRows"
        :key="rowKey(row)"
        :class="{ selected: isSelected(row) }"
        @click="(e) => {
          handleSelection(row, i, e)
          emit('row-click', row, e)
        }"
        @dblclick="(e) => emit('row-dblclick', row, e)"
        @contextmenu="(e) => emit('row-context-menu', row, e)"
    >
      <td v-for="col in columns" :key="col.id" :class="col.class" :style="{ width: col.width }">
        <slot
            :name="`cell-${col.id}`"
            :value="col.value(row)"
            :row="row"
        >
          {{ col.value(row) }}
        </slot>
      </td>
    </tr>
    </tbody>
  </table>
</template>


<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
  user-select: none;
  -webkit-user-select: none;
}

tbody > tr {
  cursor: pointer;

  &:hover {
    background: var(--color-background-tertiary);
  }

  &.selected {
    background: var(--color-background-primary);
  }
}

th {
  font-weight: bold;
  text-align: left;

  .sortable {
    user-select: none;

    span {
      margin-left: 5px;
      font-size: 0.8em;
    }
  }
}

.sort-indicator {
  font-size: 0.8em;
  opacity: 0.8;
  margin-left: 5px;
}

.sort-placeholder {
  opacity: 0.2;
  transform: translateY(-15px);
}

th.active .sort-indicator {
  opacity: 1;
}

td {
  border-top: 1px #4e4e4e solid;
}

th,
td {
  padding: var(--cell-padding, 15px);
}

@media (max-width: 900px) {
  .optional1 {
    display: none;
  }
}

@media (max-width: 750px) {
  .optional2 {
    display: none;
  }
}

@media (max-width: 600px) {
  .optional3 {
    display: none;
  }
}
</style>
