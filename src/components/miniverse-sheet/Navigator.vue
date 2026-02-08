<script setup lang="ts">
import {computed, ref, watch} from "vue";
import {useRoute, useRouter} from "vue-router";

interface RouteNode {
  name: string;
  children?: Record<string, RouteNode>;
}

const props = defineProps<{
  basePath: string;
  routes: Record<string, RouteNode>;
}>();

const router = useRouter();
const route = useRoute();

const currentPath = ref("");

watch(
    () => route.path,
    (path) => {
      currentPath.value = path.replace(props.basePath, "").replace(/^\/+/, "");
    },
    { immediate: true }
);

function navigateTo(segments: string[]) {
  router.push({
    path: `${props.basePath}/${segments.join("/")}`,
  });
}

const breadcrumbs = computed(() => {
  const parts = currentPath.value.split("/").filter(Boolean);
  const crumbs: { name: string; segments: string[] }[] = [];
  let current = props.routes;
  let acc: string[] = [];

  for (const part of parts) {
    const node = current[part];
    if (!node) break;

    acc = [...acc, part];
    crumbs.push({ name: node.name, segments: acc });
  }

  return [{ name: props.routes.home.name, segments: [] }, ...crumbs];
});
</script>

<template>
  <div class="navigator-container">
    <div class="navigator">
      <span
        v-for="(crumb, i) in breadcrumbs"
        :key="crumb.segments.join('/')"
        class="path"
        @click="navigateTo(crumb.segments)"
      >
        {{ crumb.name }}
        <span v-if="i < breadcrumbs.length - 1"> ⟩ </span>
      </span>
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
