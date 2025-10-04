<script setup lang="ts">
import {NearestFilter, TextureLoader, Vector3, Vector4} from "three";
import {computed, onMounted, Ref, ref, watch} from "vue";
import EntityPart from "@/components/EntityPart.vue";
import {ModelTemplate} from "@/models/modelTemplate";

const props = defineProps<{
  entityTemplate: ModelTemplate,
  entityTexture: string,
  position?: Vector3,
  animation?: any
}>();

let materials: any = {};
const texturesLoaded: Ref<boolean> = ref(false);

const textureLoader: TextureLoader = new TextureLoader();
const entityPosition = computed(() => {
  const pos = props.position?.clone() ?? new Vector3(0, 0, 0);
  if (props.animation?.offset) {
    pos.add(props.animation.offset);
  }
  return pos;
});

const loadFaceTexture = (coords: Vector4, flip: boolean = false) => {
  const {x1, y1, x2, y2} = {x1: coords.x, y1: coords.y, x2: coords.z, y2: coords.w};
  return new Promise((resolve) => {
    const w = x2 - x1;
    const h = y2 - y1;

    const texture = textureLoader.load(props.entityTexture, () => {
      texture.magFilter = NearestFilter;
      texture.minFilter = NearestFilter;
      texture.repeat.set(w / texture.image.width, h / texture.image.height);
      if (!flip) {
        texture.offset.set(x1 / texture.image.width, 1 - y2 / texture.image.height);
      } else {
        texture.offset.set(x1 / texture.image.width, y1 / texture.image.height);
      }
      texture.flipY = !flip;
      resolve(texture);
    });
  });
};

const loadPartTextures = async (part: ModelTemplate, reference: any | null = null) => {
  const loadedPartMaterials: any = reference ?? {};

  for (let i = 0; i < part.coords.length; i++) {
    loadedPartMaterials[part.id] = loadedPartMaterials[part.id] || [];
    loadedPartMaterials[part.id].push(
        await loadFaceTexture(part.coords[i],i === 3) // Flip only for bottom face
    );
  }

  if (part.children && part.children.length > 0) {
    for (const child of part.children) {
      await loadPartTextures(child, loadedPartMaterials);
    }
  }

  return loadedPartMaterials;
};

const updateTextures = async () => {
  texturesLoaded.value = false;
  materials = await loadPartTextures(props.entityTemplate);
  texturesLoaded.value = true;
};

onMounted(() => {
  updateTextures();
});

watch([() => props.entityTemplate, () => props.entityTexture], () => { updateTextures() });

</script>

<template>
  <TresGroup :position="entityPosition">
    <EntityPart v-if="texturesLoaded" :template="entityTemplate" :materials="materials" :animation="animation"/>
  </TresGroup>
</template>
