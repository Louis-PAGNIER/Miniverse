<script setup lang="ts">
import Button from "@/components/ui/OverlayButton.vue";
import {faArchive, faArrowUp, faCopy, faDownload, faPaste, faTrash} from "@fortawesome/free-solid-svg-icons";
import Input from "@/components/ui/Input.vue";
import {onMounted, onUnmounted, Ref, ref, watch} from "vue";
import Table, {Column} from "@/components/ui/Table.vue";
import {formatFileSize, timeAgo} from "@/composables/format";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {faFile, faFileCode, faFileLines, faFileZipper, faFolder} from "@fortawesome/free-regular-svg-icons";
import {faJava, faPython} from "@fortawesome/free-brands-svg-icons";
import {FileInfo} from "@/models/fileInfo";
import {
  apiCopyFiles,
  apiDeleteFiles,
  apiDownloadMiniverseFiles,
  apiExtractArchive,
  apiListFiles,
  apiUploadFiles
} from "@/api/files";
import {Miniverse} from "@/models/miniverse";
import {useRoute, useRouter} from "vue-router";

const props = defineProps<{
  miniverse: Miniverse
}>();

const route = useRoute();
const router = useRouter();

const browsingPath: Ref<string> = ref("");
const files: Ref<FileInfo[]> = ref([]);
const selectedPaths: Ref<Array<string>> = ref([]);
const copiedPaths: Ref<Array<string>> = ref([]);
const dropZoneVisibility: Ref<boolean> = ref(false);

function getIconFromFileInfo(info: FileInfo) {
  if (info.is_folder)
    return faFolder;

  const parts = info.name.split(".");
  if (parts.length < 2)
    return faFile;

  const extension = parts[parts.length - 1];

  switch (extension) {
    case 'zip':
    case 'tar':
    case 'gz':
    case 'rar':
      return faFileZipper;
    case 'jar':
    case 'java':
      return faJava;
    case 'py':
    case 'pyc':
      return faPython;
    case 'txt':
      return faFileLines;
    case 'json':
      return faFileCode;
  }

  return faFile;
}

function normalizePath(path?: string): string {
  if (!path || path.trim() === "") return "/";
  return path.startsWith("/") ? path : "/" + path;
}

async function refreshFiles() {
  files.value = await apiListFiles(props.miniverse.id, browsingPath.value);
}

async function navigateFileBrowserTo(path: string) {
  const normalized = normalizePath(path);

  await router.push({
    path: route.path,
    query: {
      ...route.query,
      path: normalized !== "/" ? normalized : undefined, // URL propre
    },
  });
}

async function navigateFileBrowserToParent() {
  if (browsingPath.value === "/") return;

  const parent =
      browsingPath.value.substring(0, browsingPath.value.lastIndexOf("/")) || "/";

  await navigateFileBrowserTo(parent);
}

async function downloadSelection() {
  if (selectedPaths.value.length > 0) {
    await apiDownloadMiniverseFiles(props.miniverse.id, selectedPaths.value);
  }
}

async function deleteSelection() {
  if (selectedPaths.value.length > 0) {
    await apiDeleteFiles(props.miniverse.id, selectedPaths.value);
    await refreshFiles();
  }
}

function copySelection() {
  if (selectedPaths.value.length > 0) {
    copiedPaths.value = selectedPaths.value.slice();
  }
}

async function pasteFiles() {
  if (copiedPaths.value.length > 0) {
    await apiCopyFiles(props.miniverse.id, copiedPaths.value, browsingPath.value);
    await refreshFiles();
  }
}

async function extractSelection() {
  const selection = selectedPaths.value.slice();
  for (const path of selection) {
    await apiExtractArchive(props.miniverse.id, path);
    await refreshFiles();
  }
}

async function onRowDoubleClick(file: FileInfo) {
  await navigateFileBrowserTo(file.path);
}

async function onPathBarValidate() {
  await navigateFileBrowserTo(browsingPath.value);
  await refreshFiles();
}

async function onDrop(event: DragEvent) {
  dropZoneVisibility.value = false;
  event.preventDefault();

  if (!event.dataTransfer) return;

  const files = Array.from(event.dataTransfer.files);
  console.log(files);

  await apiUploadFiles(props.miniverse.id, browsingPath.value, files);
  await refreshFiles();
}

const browserColumns: Column<FileInfo>[] = [
  {
    id: "type",
    name: "",
    value: (v: FileInfo) => getIconFromFileInfo(v),
    width: '15px',
    sortable: true,
    sortValue: (v: FileInfo) => ((v.is_folder ? '0_' : ('1_' + v.name.split('.').pop())) + v.name) || '2_'
  },

  { id: "name", name: "Name", value: (v: FileInfo) => v.name, sortable: true },

  { id: "size", name: "Size", class: 'optional3', value: (v: FileInfo) => v.size ? formatFileSize(v.size) : '--',
    sortable: true, sortValue: (v: FileInfo) => v.size ?? 0 },

  { id: "created", name: "Creation", class: 'optional1',
    sortable: true,
    value: (v: FileInfo) => timeAgo(v.created),
    sortValue: (v: FileInfo) => v.created },

  { id: "updated", name: "Modification", class: 'optional1',
    sortable: true,
    value: (v: FileInfo) => timeAgo(v.updated),
    sortValue: (v: FileInfo) => v.updated },
]

watch(
    () => route.query.path,
    async (newPath) => {
      const normalized = normalizePath(newPath as string | undefined);

      if (browsingPath.value !== normalized) {
        browsingPath.value = normalized;
        await refreshFiles();
      }
    },
    { immediate: true }
);

function preventBrowserDragAndDrop(e: DragEvent) {
  e.preventDefault();
}

onMounted(() => {
  window.addEventListener("dragover", preventBrowserDragAndDrop, false);
  window.addEventListener("drop", preventBrowserDragAndDrop, false);
});

onUnmounted(() => {
  window.removeEventListener("dragover", preventBrowserDragAndDrop, false);
  window.removeEventListener("drop", preventBrowserDragAndDrop, false);
});
</script>

<template>
  <div class="wrapper"
       @drop="(e) => {e.preventDefault()}">
    <div class="main">
      <div class="header">
        <Button :icon="faTrash" severity="danger" @click="deleteSelection"></Button>
        <Button :icon="faDownload" @click="downloadSelection"></Button>
        <Button :icon="faArchive" @click="extractSelection"></Button>
        <Button :icon="faCopy" @click="copySelection"></Button>
        <Button :icon="faPaste" @click="pasteFiles"></Button>
        <Button :icon="faArrowUp" @click="navigateFileBrowserToParent"></Button>
        <Input class="input-path" v-model="browsingPath" placeholder="/" @keyup.enter="onPathBarValidate"></Input>
      </div>

      <div class="dropzone"
           @dragleave="dropZoneVisibility = false"
           @drop="onDrop"
           :style="{visibility: dropZoneVisibility ? 'visible' : 'hidden'}">
        Drop files to upload
      </div>

      <div class="content"
           @dragenter="dropZoneVisibility = true"
      >
        <Table
            v-model:selectedKeys="selectedPaths"
            :columns="browserColumns"
            :rows="files"
            :row-key="row => row.path"
            :default-sort="{columnId: 'type', order: 'asc'}"
            padding="4px"
            selectable
            @row-dblclick="onRowDoubleClick">
          <template #cell-type="{ value }">
            <font-awesome-icon :icon="value"></font-awesome-icon>
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

  .main {
    width: 100%;
    margin: 12px;
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

    .dropzone {
      position: absolute;
      visibility: visible;
      background: var(--color-background-primary);
      outline: 8px dashed var(--color-secondary);
      opacity: 0.9;
      border-radius: 10px;
      height: 100%;
      width: 100%;
      z-index: 2;
      display: flex;
      font-size: 2em;
      justify-content: center;
      align-items: center;
    }

    .content {
      height: 100%;
      overflow-y: auto;
      overflow-x: hidden;
    }
  }
}
</style>