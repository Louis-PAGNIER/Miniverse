<script setup>
import { NearestFilter, TextureLoader } from "three";
import { onMounted, ref } from "vue";
import EntityPart from "@/components/EntityPart.vue";

const props = defineProps({
  entityTemplate: Object,
  entityTexture: String,
  imageWidth: { type: Number, default: 64 },
  imageHeight: { type: Number, default: 32 },
  position: { type: Array, default: () => [0, 0, 0]},
  animation: {
    type: Object,
    required: false,
  }
});

let materials = {};
const texturesLoaded = ref(false);

onMounted(async () => {
  const textureLoader = new TextureLoader();

  const loadFaceTexture = (x1, y1, x2, y2, flip = false) => {
    return new Promise((resolve) => {
      const w = x2 - x1;
      const h = y2 - y1;

      const texture = textureLoader.load(props.entityTexture, () => {
        texture.magFilter = NearestFilter;
        texture.repeat.set(w / props.imageWidth, h / props.imageHeight);
        if (!flip) {
          texture.offset.set(x1 / props.imageWidth, 1 - y2 / props.imageHeight);
        } else {
          texture.offset.set(x1 / props.imageWidth, y1 / props.imageHeight);
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

  materials = await loadPartTextures(props.entityTemplate);
  texturesLoaded.value = true;
});
</script>

<template>
  <TresGroup :position="position" v-if="texturesLoaded">
    <EntityPart :template="entityTemplate" :materials="materials" :animation="animation"/>
  </TresGroup>
</template>