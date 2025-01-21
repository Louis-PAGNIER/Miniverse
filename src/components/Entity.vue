<script setup>
import {NearestFilter, TextureLoader} from "three";
import {onMounted, ref, shallowRef, watch} from "vue";
import EntityPart from "@/components/EntityPart.vue";
import {addArray} from "@/math.js";

const props = defineProps({
  entityTemplate: Object,
  entityTexture: String,
  position: {type: Array, default: () => [0, 0, 0]},
  animation: {
    type: Object,
    required: false,
  }
});

let materials = {};
const groupRef = shallowRef();
const texturesLoaded = ref(false);

const textureLoader = new TextureLoader();

const loadFaceTexture = (x1, y1, x2, y2, flip = false) => {
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

const loadPartTextures = async (part, reference = null) => {
  const loadedPartMaterials = reference ?? {};

  for (let i = 0; i < part.coords.length; i++) {
    const coords = part.coords[i];
    loadedPartMaterials[part.id] = loadedPartMaterials[part.id] || [];
    loadedPartMaterials[part.id].push(
        await loadFaceTexture(
            coords[0],
            coords[1],
            coords[2],
            coords[3],
            i === 3 // Flip only for bottom face
        )
    );
  }

  if (part.children && part.children.length > 0) {
    for (const child of part.children) {
      await loadPartTextures(child, loadedPartMaterials);
    }
  }

  return loadedPartMaterials;
};

const recalculateTextures = async () => {
  texturesLoaded.value = false;
  materials = await loadPartTextures(props.entityTemplate);
  texturesLoaded.value = true;
};

const recalculatePosition = (position) => {
  const pos = addArray(position, props.animation?.offset ?? [0, 0, 0])
  groupRef.value.position.set(pos[0], pos[1], pos[2]);
}

onMounted(() => {
  recalculateTextures();
  recalculatePosition(props.position);
});

watch([() => props.entityTemplate, () => props.entityTexture], () => { recalculateTextures() });
watch(() => props.position, (newPosition) => { recalculatePosition(newPosition) });

</script>

<template>
  <TresGroup ref="groupRef">
    <EntityPart v-if="texturesLoaded" :template="entityTemplate" :materials="materials" :animation="animation"/>
  </TresGroup>
</template>
