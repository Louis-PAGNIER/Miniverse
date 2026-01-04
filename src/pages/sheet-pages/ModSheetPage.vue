<script setup lang="ts">
import {capitalize, computed, inject, onMounted, ref, Ref, watch} from "vue";
import {Miniverse} from "@/models/miniverse";
import {RouteLocationNormalizedLoadedGeneric, Router, useRoute, useRouter} from "vue-router";
import {apiGetModDetails, apiGetModVersionDetails, apiGetModVersions} from "@/api/mods";
import {ModrinthProject, ModrinthProjectVersion} from "@/models/mod";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {
  faBook,
  faCode,
  faCodeCommit, faCube,
  faDownload, faFile,
  faTags, faTrash,
  faTriangleExclamation
} from "@fortawesome/free-solid-svg-icons";
import {faCalendar, faHeart} from "@fortawesome/free-regular-svg-icons";
import {computeVersionRange, formatBigNumber, timeAgo} from "@/composables/format";

import MarkdownIt from "markdown-it";
import MarkdownItAbbr from "markdown-it-abbr";
import MarkdownItAnchor from "markdown-it-anchor";
import MarkdownItFootnote from "markdown-it-footnote";
import MarkdownItHighlightjs from "markdown-it-highlightjs";
import MarkdownItSub from "markdown-it-sub";
import MarkdownItSup from "markdown-it-sup";
import MarkdownItTasklists from "markdown-it-task-lists";
import MarkdownItTOC from "markdown-it-toc-done-right";
import {faDiscord} from "@fortawesome/free-brands-svg-icons";
import BigButton from "@/components/ui/BigButton.vue";
import {apiAutomaticModInstall, apiInstallMod, apiUninstallMod} from "@/api/miniverse";
import Chip from "@/components/ui/Chip.vue";
import Tabs from "@/components/ui/Tabs.vue";
import Tab from "@/components/ui/Tab.vue";
import Table, {Column} from "@/components/ui/Table.vue";
import IconButton from "@/components/ui/IconButton.vue";
import {openNewTab} from "@/composables/browser";

const markdown = new MarkdownIt({html: true})
  .use(MarkdownItAbbr)
  .use(MarkdownItAnchor)
  .use(MarkdownItFootnote)
  .use(MarkdownItHighlightjs)
  .use(MarkdownItSub)
  .use(MarkdownItSup)
  .use(MarkdownItTasklists)
  .use(MarkdownItTOC);

const miniverse = inject<Miniverse>('miniverse')!;

const route: RouteLocationNormalizedLoadedGeneric = useRoute();
const router: Router = useRouter();

const activeTab = ref('presentation');

const modId = computed(() => {
  const mId = route.query['id'] as string;
  if (!mId) router.replace(`/miniverse/${miniverse.id}`)
  return mId;
});

const modDetails: Ref<ModrinthProject | null> = ref(null);
const modAvailableVersions: Ref<ModrinthProjectVersion[]> = ref([]);
const installedVersionDetails: Ref<ModrinthProjectVersion | null> = ref(null);

const installedMod = computed(() => {
  return miniverse.mods.find(m => m.project_id === modId.value)
})

const isModInstalled = computed(() => {
  return !!installedMod.value
})

async function installMod(versionId: string | null = null) {
  if (versionId == null)
    await apiAutomaticModInstall(miniverse.id, modId.value);
  else
    await apiInstallMod(miniverse.id, versionId)
}

async function uninstallMod() {
  if (installedMod.value) {
    await apiUninstallMod(installedMod.value.id);
  }
}

watch(installedMod, async (newValue, oldValue) => {
  if (newValue) {
    installedVersionDetails.value = await apiGetModVersionDetails(newValue.version_id);
  } else {
    installedVersionDetails.value = null;
  }
  modAvailableVersions.value = modAvailableVersions.value;
}, {immediate: true})

onMounted(async () => {
  [modDetails.value, modAvailableVersions.value] = await Promise.all([
      apiGetModDetails(modId.value), apiGetModVersions(modId.value)
  ]);
})

const versionsTableColumns: Column<ModrinthProjectVersion>[] = [
  { id: "version_type", name: "Type", class: "optional3", value: (v: ModrinthProjectVersion) => capitalize(v.version_type) },
  { id: "name", name: "Name", value: (v: ModrinthProjectVersion) => v },
  { id: "game_versions", name: "MC Versions", value: (v: ModrinthProjectVersion) => v.game_versions },
  { id: "loaders", name: "Platforms", value: (v: ModrinthProjectVersion) => v.loaders },
  { id: "date_published", name: "Published", class: "optional2", value: (v: ModrinthProjectVersion) => v.date_published },
  { id: "downloads", name: "Downloads", class: "optional1", value: (v: ModrinthProjectVersion) => v.downloads },
  { id: "actions", name: "Actions", value: (v: ModrinthProjectVersion) => v }
]
</script>

<template>
  <div class="main" v-if="modDetails">
    <div class="header">
      <img class="icon" :src="modDetails.icon_url" />
      <div class="summary">
        <h3 class="title">{{ modDetails.title }}</h3>
        <p class="description">{{ modDetails.description }}</p>
        <div class="stats">
          <div class="stat">
            <FontAwesomeIcon :icon="faDownload"></FontAwesomeIcon> {{ formatBigNumber(modDetails.downloads) }}
          </div>
          <span class="separator">|</span>
          <div class="stat">
            <FontAwesomeIcon :icon="faHeart"></FontAwesomeIcon> {{ formatBigNumber(modDetails.followers) }}
          </div>
          <span class="separator">|</span>
          <div class="stat chip-list">
            <FontAwesomeIcon :icon="faTags"></FontAwesomeIcon>
            <Chip v-for="category of modDetails.categories">
              <span style="display: flex;">{{ category }}</span>
            </Chip>
          </div>
        </div>
      </div>
    </div>

    <br>
    <Tabs v-model="activeTab">
      <template #tabs>
        <Tab name="presentation" label="Presentation"></Tab>
        <Tab name="versions" label="Versions"></Tab>
        <Tab name="gallery" label="Gallery"></Tab>
      </template>

      <template #presentation>
        <div class="panels">
          <div class="left-panel panel" v-html="markdown.render(modDetails.body)"></div>
          <div class="right-panel">
            <BigButton v-if="!isModInstalled" severity="success" @click="installMod">
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
                <FontAwesomeIcon :icon="faFile"></FontAwesomeIcon> Version <Chip>{{ installedMod.version_number }}</Chip>
              </div>
              <div class="element">
                <FontAwesomeIcon :icon="faCube"></FontAwesomeIcon> MC version
                <Chip v-for="version of installedVersionDetails?.game_versions">
                  {{ version }}
                </Chip>
              </div>
            </div>

            <div class="panel" style="max-height: 500px;">
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
                <FontAwesomeIcon :icon="faTriangleExclamation"></FontAwesomeIcon> <a :href="modDetails.issues_url">Report issues</a>
              </div>
              <div class="element">
                <FontAwesomeIcon :icon="faCode"></FontAwesomeIcon> <a :href="modDetails.source_url">View source</a>
              </div>
              <div class="element">
                <FontAwesomeIcon :icon="faBook"></FontAwesomeIcon> <a :href="modDetails.wiki_url">Visit wiki</a>
              </div>
              <div class="element">
                <FontAwesomeIcon :icon="faDiscord"></FontAwesomeIcon> <a :href="modDetails.discord_url">Join Discord</a>
              </div>
            </div>

            <div class="panel">
              <h4>Details</h4>
              <div class="element">
                <FontAwesomeIcon :icon="faCalendar"></FontAwesomeIcon> Published {{ timeAgo(modDetails.published) }}
              </div>
              <div class="element">
                <FontAwesomeIcon :icon="faCodeCommit"></FontAwesomeIcon> Updated {{ timeAgo(modDetails.updated) }}
              </div>
            </div>
          </div>
        </div>
      </template>

      <template #versions>
        <Table :columns="versionsTableColumns" :rows="modAvailableVersions">
          <template #cell-name="{ value }">
            <div class="name-column">
              <span class="version-number">{{ value.version_number }}</span>
              <span class="version-name">{{ value.name }}</span>
            </div>
          </template>

          <template #cell-game_versions="{ value }">
            <Chip>{{ computeVersionRange(value) }}</Chip>
          </template>

          <template #cell-loaders="{ value }">
            <Chip v-for="loader of value">{{ loader }}</Chip>
          </template>

          <template #cell-date_published="{ value }">
            {{ timeAgo(value) }}
          </template>

          <template #cell-downloads="{ value }">
            {{ formatBigNumber(value) }}
          </template>

          <template #cell-actions="{ value }">
            <IconButton :disabled="value.id == installedVersionDetails?.id"
                        :icon="value.id == installedVersionDetails?.id ? 'check' : 'arrow-right-arrow-left'"
                        @click="installMod(value.id)"/>

            <IconButton icon="arrow-up-right-from-square"
                        severity="neutral"
                        @click="openNewTab(`https://modrinth.com/mod/${value.project_id}/version/${value.id}`)"/>
          </template>
        </Table>
      </template>

      <template #gallery>
        <div class="gallery">
          <div class="card" v-for="item of modDetails.gallery">
            <img :src="item.url">
            <div class="footer">
              <span class="title">{{ item.title }}</span>
              <span class="description">{{ item.description }}</span>
              <span class="date">
              <font-awesome-icon :icon="faCalendar"></font-awesome-icon> {{ (new Date(item.created)).toLocaleDateString()}}
            </span>
            </div>
          </div>
        </div>

      </template>
    </Tabs>


  </div>

</template>

<style scoped>
.header {
  display: flex;
  flex-direction: row;
  margin-bottom: 10px;
  gap: 10px;

  .icon {
    width: 100px;
    background: var(--color-background-secondary);
    border-radius: 10px;
    aspect-ratio: 1;
    image-rendering: pixelated;
  }

  .summary {
    max-width: 600px;
    height: 100px;
    text-align: left;
    align-items: start;
    line-height: 1.1em;
    display: flex;
    flex-direction: column;

    .title {
      line-height: 1em;
      margin-bottom: 5px;
    }

    .description {
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;

      overflow: hidden;
      text-overflow: ellipsis;
    }

    .stats {
      display: flex;
      flex-direction: row;
      gap: 10px;
      margin-top: auto;
      text-transform: capitalize;
      align-items: center;

      .separator {
        transform: translateY(-2px) scaleY(1.3);
        color: var(--color-secondary);
      }
    }
  }
}

.chip-list {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

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

.gallery {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 15px;

  .card {
    width: 442px;
    background: var(--color-background-secondary);
    border-radius: 20px;
    overflow: hidden;

    img {
      width: 100%;
      height: 200px;
      object-fit: cover;
    }

    .footer {
      padding: 10px;
      display: flex;
      flex-direction: column;

      .title {
        font-size: 1.1em;
        font-weight: bold;
        margin-bottom: 5px;
      }

      .description {
        color: var(--color-secondary);
        line-height: 1.2em;
        margin-bottom: 10px;
      }
    };
  }
}
</style>