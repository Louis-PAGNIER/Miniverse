<script setup lang="ts" generic="T extends Record<string, any>">
export interface Column<T, V = unknown> {
  id: string
  name: string
  class?: string

  value: (row: T) => V
}

defineProps<{
  columns: Column<T>[]
  rows: T[]
}>();

defineSlots<{
  [K in string]?: (props: {
    value: any
    row: T
  }) => any
}>();
</script>

<template>
  <table>
    <thead>
    <tr>
      <th v-for="col in columns" :key="col.id" :class="col.class">
        {{ col.name }}
      </th>
    </tr>
    </thead>

    <tbody>
    <tr v-for="(row, i) in rows" :key="i">
      <td v-for="col in columns" :key="col.id" :class="col.class">
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
}

th {
  font-weight: bold;
  text-align: left;
}

td {
  border-top: 1px #4e4e4e solid;
}

th,
td {
  padding: 15px;
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
