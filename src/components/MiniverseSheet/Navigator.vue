<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

interface RouteNode {
  name: string;
  component: any;
  children?: Record<string, RouteNode>;
}

const props = defineProps<{
  basePath: string; // exemple: /miniverse/1234
  routes: Record<string, RouteNode>;
}>();

const router = useRouter();
const route = useRoute();

const currentPath = ref("");

watch(
    () => route.fullPath,
    (path) => {
      const clean = path.replace(props.basePath, "").replace(/^\/+/, "");
      currentPath.value = clean;
    },
    { immediate: true }
);

function navigateTo(subPath: string) {
  const newPath = `${props.basePath}/${subPath}`;
  router.push(newPath);
}

function resolveRouteNode(path: string): RouteNode | null {
  const parts = path.split("/").filter(Boolean);
  let node: RouteNode | null = null;
  let current = props.routes;

  for (const part of parts) {
    node = current[part];
    if (!node) break;
    current = node.children || {};
  }

  return node || props.routes.home; // fallback
}

const currentNode = computed(() => resolveRouteNode(currentPath.value));

const breadcrumbs = computed(() => {
  const parts = currentPath.value.split("/").filter(Boolean);
  const crumbs: { name: string; path: string }[] = [];
  let current = props.routes;
  let currentPathAcc = "";

  for (const part of parts) {
    const node = current[part];
    if (!node) break;
    currentPathAcc += (currentPathAcc ? "/" : "") + part;
    crumbs.push({ name: node.name, path: currentPathAcc });
    current = node.children || {};
  }

  const homeCrumb = { name: props.routes.home.name, path: "" };
  return [homeCrumb, ...crumbs];
});
</script>

<template>
  <div class="navigator-container">
    <div class="navigator">
      <span
          v-for="(crumb, i) in breadcrumbs"
          :key="crumb.path"
          class="path"
          @click="navigateTo(crumb.path)"
      >
        {{ crumb.name }}
        <span v-if="i < breadcrumbs.length - 1"> ⟩ </span>
      </span>
    </div>

    <div class="page-content">
      <component :is="currentNode?.component" />
    </div>
  </div>
</template>

<style scoped>
.navigator {
  color: var(--color-secondary);
  font-weight: 600;
  cursor: default;
  padding-bottom: 10px;

  .path {
    cursor: pointer;
    transition: color 0.2s;
  }

  .path:hover {
    color: var(--color-primary);
  }
}
</style>
