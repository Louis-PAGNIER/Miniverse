<script setup lang="ts">

import {
  faBook,
  faCode, faCodeCommit,
  faCube,
  faDownload,
  faFile,
  faTrash,
  faTriangleExclamation
} from "@fortawesome/free-solid-svg-icons";
import {faDiscord} from "@fortawesome/free-brands-svg-icons";
import {faCalendar} from "@fortawesome/free-regular-svg-icons";
import BigButton from "@/components/ui/BigButton.vue";
import Chip from "@/components/ui/Chip.vue";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import MarkdownIt from "markdown-it";
import MarkdownItAbbr from "markdown-it-abbr";
import MarkdownItAnchor from "markdown-it-anchor";
import MarkdownItFootnote from "markdown-it-footnote";
import MarkdownItHighlightjs from "markdown-it-highlightjs";
import MarkdownItSub from "markdown-it-sub";
import MarkdownItSup from "markdown-it-sup";
import MarkdownItTasklists from "markdown-it-task-lists";
import MarkdownItTOC from "markdown-it-toc-done-right";
import {apiAutomaticModInstall, apiInstallMod, apiUninstallMod} from "@/api/miniverse";
import {useToastStore} from "@/stores/toastStore";
import {computed, ComputedRef, inject} from "vue";
import {Miniverse} from "@/models/miniverse";
import {timeAgo} from "@/composables/format";

const markdown = new MarkdownIt({html: true})
    .use(MarkdownItAbbr)
    .use(MarkdownItAnchor)
    .use(MarkdownItFootnote)
    .use(MarkdownItHighlightjs)
    .use(MarkdownItSub)
    .use(MarkdownItSup)
    .use(MarkdownItTasklists)
    .use(MarkdownItTOC);

const miniverse = inject<ComputedRef<Miniverse>>('miniverse')!;
const toastStore = useToastStore();

const {
  modId,
  modDetails,
  installedMod,
  installedVersionDetails
} = inject<any>('modContext');

const isModInstalled = computed(() => {
  return !!installedMod.value
})

async function installMod() {
  await apiAutomaticModInstall(miniverse.value.id, modId.value);
  toastStore.addToast('Mod installed', `Mod ${modDetails.value?.title} installed successfully.`, 'success');
}

async function uninstallMod() {
  if (installedMod.value) {
    await apiUninstallMod(installedMod.value.id);
  }
  toastStore.addToast('Mod uninstalled', `Mod ${modDetails.value?.title} removed successfully.`, 'success');
}
</script>

<template>
  <div class="panels">
    <div class="left-panel panel" v-html="markdown.render(modDetails.body)"></div>
    <div class="right-panel">
      <BigButton v-if="!isModInstalled" severity="success" @click="() => installMod()">
        <FontAwesomeIcon :icon="faDownload" style="height: 0.85em"></FontAwesomeIcon>
        Install
      </BigButton>
      <BigButton v-else severity="danger" @click="uninstallMod">
        <FontAwesomeIcon :icon="faTrash" style="height: 0.85em"></FontAwesomeIcon>
        Uninstall
      </BigButton>

      <div v-if="installedMod" class="panel">
        <h4>Installed version</h4>
        <div class="element">
          <FontAwesomeIcon :icon="faFile"></FontAwesomeIcon>
          Version
          <Chip>{{ installedMod.version_number }}</Chip>
        </div>
        <div class="element">
          <FontAwesomeIcon :icon="faCube"></FontAwesomeIcon>
          MC version
          <Chip v-for="version of installedVersionDetails?.game_versions">
            {{ version }}
          </Chip>
        </div>
      </div>

      <div class="panel scrollbar" style="max-height: 500px;">
        <h4>Compatibility</h4>
        <div class="chip-list">
          <Chip v-for="version of modDetails.game_versions.toReversed()">
            {{ version }}
          </Chip>
        </div>
      </div>

      <div class="panel">
        <h4>Links</h4>
        <div class="element">
          <FontAwesomeIcon :icon="faTriangleExclamation"></FontAwesomeIcon>
          <a :href="modDetails.issues_url">Report issues</a>
        </div>
        <div class="element">
          <FontAwesomeIcon :icon="faCode"></FontAwesomeIcon>
          <a :href="modDetails.source_url">View source</a>
        </div>
        <div class="element">
          <FontAwesomeIcon :icon="faBook"></FontAwesomeIcon>
          <a :href="modDetails.wiki_url">Visit wiki</a>
        </div>
        <div class="element">
          <FontAwesomeIcon :icon="faDiscord"></FontAwesomeIcon>
          <a :href="modDetails.discord_url">Join Discord</a>
        </div>
      </div>

      <div class="panel">
        <h4>Details</h4>
        <div class="element">
          <FontAwesomeIcon :icon="faCalendar"></FontAwesomeIcon>
          Published {{ timeAgo(modDetails.published) }}
        </div>
        <div class="element">
          <FontAwesomeIcon :icon="faCodeCommit"></FontAwesomeIcon>
          Updated {{ timeAgo(modDetails.updated) }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

.panels {
  display: flex;
  flex-direction: row;
  gap: 10px;
}

.left-panel, .right-panel {
  display: flex;
  flex-direction: column;
}

.panel {
  background: var(--color-background-secondary);
  border-radius: 10px;
  padding: 15px;
  overflow-y: auto;

  .element {
    align-items: center;
    display: flex;
    gap: 7px;
  }
}

.left-panel {
  width: 100%;

  & :deep(a) {
    color: lightseagreen;
  }

  & :deep(img, iframe) {
    max-width: 100%;
  }
}

.right-panel {
  width: 500px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.name-column {
  display: flex;
  flex-direction: column;
  line-height: 1.1em;

  .version-number {
    font-size: 1.1em;
    font-weight: bold;
  }

  .version-name {
    font-size: 0.8em;
    color: var(--color-secondary);
  }
}
</style>