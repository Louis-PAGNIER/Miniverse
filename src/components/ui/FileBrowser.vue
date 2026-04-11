<script setup lang="ts">
import {faArchive, faArrowUp, faCopy, faDownload, faPaste, faTrash} from "@fortawesome/free-solid-svg-icons";
import Input from "@/components/ui/Input.vue";
import {computed, onMounted, onUnmounted, Ref, ref, watch} from "vue";
import Table, {Column} from "@/components/ui/Table.vue";
import {formatFileSize, timeAgo, timeLocal} from "@/composables/format";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {faFile, faFileCode, faFileLines, faFileZipper, faFolder} from "@fortawesome/free-regular-svg-icons";
import {faJava, faPython} from "@fortawesome/free-brands-svg-icons";
import {FileInfo} from "@/models/fileInfo";
import {
  apiCompressFiles,
  apiCopyFiles,
  apiDeleteFiles,
  apiDownloadMiniverseFiles,
  apiExtractArchive,
  apiGetFileContent,
  apiListFiles,
  apiRenameItem, apiSetFileContent,
  apiUploadFiles
} from "@/api/files";
import {Miniverse} from "@/models/miniverse";
import {useRoute, useRouter} from "vue-router";
import ContextMenu, {ContextMenuItem} from "@/components/ui/ContextMenu.vue";
import InputPopup from "@/components/popups/InputPopup.vue";
import FileEditor from "@/components/ui/FileEditor.vue";
import ActionButton from "@/components/ui/ActionButton.vue";
import {showHTTPError} from "@/api/api";
import {useToastStore} from "@/stores/toastStore";

const props = defineProps<{
  miniverse: Miniverse
}>();

const route = useRoute();
const router = useRouter();
const toastStore = useToastStore();

const browsingPath: Ref<string> = ref("");
const files: Ref<FileInfo[]> = ref([]);
const selectedPaths: Ref<Array<string>> = ref([]);
const copiedPaths: Ref<Array<string>> = ref([]);
const dropZoneVisibility: Ref<boolean> = ref(false);
const showRenamePopup: Ref<boolean> = ref(false);
const fileContent: Ref<string | null> = ref(null);
const isCurrentPathAFile: Ref<boolean> = ref(false);
const isFileToLarge: Ref<boolean> = ref(false);

const contextMenuRef = ref<InstanceType<typeof ContextMenu>>()

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

async function loadFileContent(path: string) {
  try {
    fileContent.value = await apiGetFileContent(props.miniverse.id, path);
    isFileToLarge.value = false
  } catch (e: any) {
    if (e.status === 480) {
      fileContent.value = null;
      isFileToLarge.value = true
    } else {
      showHTTPError(e);
    }
    console.log(e)
  }
  isCurrentPathAFile.value = true;
}

async function refreshFiles() {
  const fetchedFiles = await apiListFiles(props.miniverse.id, browsingPath.value);
  if (fetchedFiles !== null) {
    files.value = fetchedFiles
    isCurrentPathAFile.value = false;
    fileContent.value = null;
  } else {
    await loadFileContent(browsingPath.value);
  }
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

async function compressSelection() {
  console.log("Compress")
  await apiCompressFiles(props.miniverse.id, selectedPaths.value);
  await refreshFiles();
}

async function renameSelectedElement(newName: string) {
  if (selectedPaths.value.length !== 1) return;
  const path = selectedPaths.value[0];

  await apiRenameItem(props.miniverse.id, path, newName);
  await refreshFiles();
}

async function onRowDoubleClick(file: FileInfo, event: MouseEvent) {
  await navigateFileBrowserTo(file.path);
}

async function onRowContextMenu(file: FileInfo, event: MouseEvent) {
  contextMenuRef.value?.open(event);
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

  apiUploadFiles(props.miniverse.id, browsingPath.value, files, refreshFiles);
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

  {id: "name", name: "Name", value: (v: FileInfo) => v.name, sortable: true},

  {
    id: "size", name: "Size", class: 'optional3', value: (v: FileInfo) => v.size ? formatFileSize(v.size) : '--',
    sortable: true, sortValue: (v: FileInfo) => v.size ?? 0,
    tooltip: (v: FileInfo) => v.is_folder ? undefined : (v.size ?? 0).toString() + " bytes"
  },

  {
    id: "created", name: "Creation", class: 'optional1',
    sortable: true,
    value: (v: FileInfo) => timeAgo(v.created),
    sortValue: (v: FileInfo) => v.created,
    tooltip: (v: FileInfo) => timeLocal(v.created)
  },

  {
    id: "updated", name: "Modification", class: 'optional1',
    sortable: true,
    value: (v: FileInfo) => timeAgo(v.updated),
    sortValue: (v: FileInfo) => v.updated,
    tooltip: (v: FileInfo) => timeLocal(v.updated)
  },
]

const canPaste = computed(() => copiedPaths.value.length > 0);
const canUncompress = computed(() => selectedPaths.value.every(p => p.toLowerCase().endsWith(".zip")));
const canRename = computed(() => selectedPaths.value.length === 1);
const browsingElementName = computed(() => {
  const name = browsingPath.value.split("/");
  return name.length > 0 ? name[name.length - 1] : "";
})

async function handleFileSave(content: string) {
  const fileName = browsingElementName.value;
  await apiSetFileContent(props.miniverse.id, browsingPath.value, content);
  toastStore.addToast("Saved successfully", `${fileName} has been written successfully.`, 'success');
}

const nameOfFirstFile = computed(() => {
  if (selectedPaths.value.length === 0) return "";
  const path = selectedPaths.value[0];
  const name = path.split("/");
  return name.length > 0 ? name[name.length - 1] : "";
})

const contextMenuItems: ContextMenuItem[] = [
  {
    label: 'Rename',
    action: () => {
      showRenamePopup.value = true
    },
    visible: () => canRename.value
  },
  {
    label: 'Copy',
    action: copySelection
  },
  {
    label: 'Paste',
    action: pasteFiles,
    disabled: () => !canPaste.value
  },
  {
    label: 'Compress',
    action: compressSelection
  },
  {
    label: 'Uncompress',
    action: extractSelection,
    visible: () => canUncompress.value
  },
  {
    label: 'Download',
    action: downloadSelection
  },
  {
    label: 'Delete',
    action: deleteSelection
  }
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
    {immediate: true}
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
        <ActionButton size="small" :icon="faTrash" severity="danger" @click="deleteSelection"></ActionButton>
        <ActionButton size="small" :icon="faDownload" @click="downloadSelection"></ActionButton>
        <ActionButton size="small" :icon="faArchive" @click="extractSelection"></ActionButton>
        <ActionButton size="small" :icon="faCopy" @click="copySelection"></ActionButton>
        <ActionButton size="small" :icon="faPaste" @click="pasteFiles"></ActionButton>
        <ActionButton size="small" :icon="faArrowUp" @click="navigateFileBrowserToParent"></ActionButton>
        <Input class="input-path" v-model="browsingPath" placeholder="/" @keyup.enter="onPathBarValidate"></Input>
      </div>

      <div class="dropzone"
           v-if="!isCurrentPathAFile"
           @dragleave="dropZoneVisibility = false"
           @drop="onDrop"
           :style="{visibility: dropZoneVisibility ? 'visible' : 'hidden'}">
        Drop files to upload
      </div>

      <div class="content scrollbar"
           @dragenter="dropZoneVisibility = true"
      >
        <div v-if="isCurrentPathAFile" class="file-editor-container">
          <FileEditor v-if="!isFileToLarge"
                      :filename=browsingElementName
                      v-model="fileContent"
                      :on-save="handleFileSave">
          </FileEditor>
          <div v-else class="file-to-large-disclaimer">
            {{ browsingElementName }} file is too large.
          </div>
        </div>

        <Table
            v-else
            v-model:selectedKeys="selectedPaths"
            :columns="browserColumns"
            :rows="files"
            :row-key="row => row.path"
            :default-sort="{columnId: 'type', order: 'asc'}"
            padding="4px"
            selectable
            @row-dblclick="onRowDoubleClick"
            @row-context-menu="onRowContextMenu">
          <template #cell-type="{ value }">
            <font-awesome-icon :icon="value"></font-awesome-icon>
          </template>
        </Table>

        <ContextMenu ref="contextMenuRef" :items="contextMenuItems"/>
      </div>
    </div>

    <InputPopup v-model="showRenamePopup"
                title="Rename file"
                :default-value="nameOfFirstFile"
                placeholder="File name..."
                @ok="value => renameSelectedElement(value)">
    </InputPopup>
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

      .file-editor-container {
        width: 100%;
        height: 100%;
      }
    }
  }
}

.file-to-large-disclaimer {
  background: #0d1117;
  width: 100%;
  height: 100%;
  border-radius: 10px;
  padding: 10px;
  font-size: 1.75em;
  color: var(--color-danger-secondary);
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>