<script setup lang="ts">
import {computed, inject, onMounted, ref, Ref} from "vue";
import {Miniverse} from "@/models/miniverse";
import {RouteLocationNormalizedLoadedGeneric, Router, useRoute, useRouter} from "vue-router";
import {apiGetModDetails} from "@/api/mods";
import {ModrinthProject} from "@/models/mod";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {
  faBook,
  faCode,
  faCodeCommit,
  faDownload,
  faTags,
  faTriangleExclamation
} from "@fortawesome/free-solid-svg-icons";
import {faCalendar, faHeart} from "@fortawesome/free-regular-svg-icons";
import {formatBigNumber, timeAgo} from "@/composables/format";

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

const modId = computed(() => {
  const mId = route.query['id'] as string;
  if (!mId) router.replace(`/miniverse/${miniverse.id}`)
  return mId;
});

const modDetails: Ref<ModrinthProject | null> = ref(null);

onMounted(async () => {
  modDetails.value = await apiGetModDetails(modId.value);
})
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
          <div class="stat">
            <FontAwesomeIcon :icon="faTags"></FontAwesomeIcon>
            {{ modDetails.categories.join(" ") }}
          </div>
        </div>
      </div>

    </div>
    <div class="panels">
      <div class="left-panel panel" v-html="markdown.render(modDetails.body)"></div>
      <div class="right-panel">
        <div class="panel">
          <h4>Compatibility</h4>
          {{ modDetails.game_versions }}
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

      .separator {
        transform: translateY(-2px) scaleY(1.3);
        color: var(--color-secondary);
      }
    }
  }
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
}

.left-panel {
  width: 100%;

  & :deep(a) {
    color: lightseagreen;
  }
}

.right-panel {
  width: 500px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>