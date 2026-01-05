<script setup lang="ts">

import Button from "@/components/ui/OverlayButton.vue";
import {faArrowUp, faCopy, faDownload, faFile, faPaste, faTrash} from "@fortawesome/free-solid-svg-icons";
import Input from "@/components/ui/Input.vue";
import {ref} from "vue";
import Table, {Column} from "@/components/ui/Table.vue";
import {formatFileSize} from "@/composables/format";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {faFolder} from "@fortawesome/free-regular-svg-icons";

const browsePath = ref("/var/www/http");

interface FileInfo {
  is_folder: boolean;
  name: string;
  created: number;
  updated: number;
  size?: number;
}

const browserColumns: Column<FileInfo>[] = [
  { id: "is_folder", name: "Type", value: (v: FileInfo) => v.is_folder },
  { id: "name", name: "Name", value: (v: FileInfo) => v.name },
  { id: "size", name: "Size", class: 'optional3', value: (v: FileInfo) => v.size ? formatFileSize(v.size) : '--' },
  { id: "created", name: "Creation", class: 'optional1', value: (v: FileInfo) => v.created },
  { id: "updated", name: "Modification", class: 'optional1', value: (v: FileInfo) => v.updated },
]

const files = [
  {is_folder: true, name: 'mods', created: 0, updated: 0},
  {is_folder: true, name: 'world', created: 0, updated: 0},
  {is_folder: true, name: 'data', created: 0, updated: 0},
  {is_folder: false, name: 'toto.txt', created: 0, updated: 0, size: 5000000},
  {is_folder: false, name: 'world.json', created: 0, updated: 0, size: 80000000},
];
</script>

<template>
  <div class="wrapper">
    <div class="sidebar">

    </div>
    <div class="main">
      <div class="header">
        <Button :icon="faTrash" severity="danger"></Button>
        <Button :icon="faDownload"></Button>
        <Button :icon="faCopy"></Button>
        <Button :icon="faPaste"></Button>
        <Button :icon="faArrowUp"></Button>
        <Input class="input-path" v-model="browsePath" placeholder="/"></Input>
      </div>

      <div class="content">
        <Table :columns="browserColumns" :rows="files">
          <template #cell-is_folder="{ value }">
            <font-awesome-icon :icon="faFolder" v-if="value"></font-awesome-icon>
            <font-awesome-icon :icon="faFile" v-else></font-awesome-icon>
          </template>
        </Table>
      </div>
    </div>
  </div>
</template>

<style scoped>
.wrapper {
  height: 750px;
  width: 100%;
  gap: 12px;
  background: var(--color-background-secondary);
  position: relative;
  display: flex;
  border-radius: 14px;

  .sidebar {
    width: 300px;
    margin: 12px 0 12px 12px;
    background: var(--color-background-primary);
    border: 1px solid var(--color-border);
    border-radius: 10px;
    overflow-y: auto;
  }

  .main {
    width: 100%;
    margin: 12px 12px 12px 0;
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 5px;

    .header {
      width: 100%;
      background: var(--color-background-tertiary);
      border-radius: 10px;
      display: flex;
      align-items: center;
      padding: 8px;
      gap: 5px;
      flex-wrap: wrap;

      & > *:not(.input-path) {
        flex: 0 0 auto;
      }

      .input-path {
        flex: 1 1 150px;
        min-width: 150px;
        height: 31px;
        margin: 0;
      }
    }

    .content {
      height: 100%;
      overflow-y: auto;
    }
  }
}
</style>