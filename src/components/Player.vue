<script setup lang="ts">
import Entity from "@/components/Entity.vue";
import playerTemplate from "@/assets/minecraftTemplates/PlayerTemplate.json";
import oldPlayerTemplate from "@/assets/minecraftTemplates/OldPlayerTemplate.json";
import veryOldTemplate from "@/assets/minecraftTemplates/VeryOldPlayerTemplate.json";
import {ref, computed, watch} from "vue";
import {Vector3} from "three";

const MINESKIN_BASE_URL = "https://mineskin.eu/skin";
type SkinData = { width: number; height: number; ctx: CanvasRenderingContext2D; };

const props = defineProps<{
  username: string,
  position?: Vector3,
  animation?: any,
}>();

const skinData: Ref<SkinData> = ref(null);
const skinUrl = computed(() => `${MINESKIN_BASE_URL}/${props.username}`);

async function loadSkinImage(url): Promise<SkinData | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      resolve({ width: img.width, height: img.height, ctx });
    };
    img.onerror = () => resolve(null);
    img.src = url;
  });
}

// Check for very old skin having black hat instead of transparent pixels
function areRectanglesBlack(ctx): boolean {
  const rectangles = [[48, 8, 56, 16], [32, 8, 40, 16], [40, 0, 48, 8], [48, 0, 56, 8], [40, 8, 48, 16], [56, 8, 64, 16]];

  for (const [x1, y1, x2, y2] of rectangles) {
    const width = x2 - x1;
    const height = y2 - y1;
    const imageData = ctx.getImageData(x1, y1, width, height);
    const pixels = imageData.data;
    for (let i = 0; i < pixels.length; i += 4) {
      const [r, g, b, a] = [pixels[i], pixels[i + 1], pixels[i + 2], pixels[i + 3]];
      if (r !== 0 || g !== 0 || b !== 0 || a !== 255) {
        return false;
      }
    }
  }
  return true;
}

watch(
    () => skinUrl.value,
    async (newUrl) => {
      const skinImage = await loadSkinImage(newUrl);
      if (skinImage) {
        if (skinImage.height === 64) {
          entityTemplate.value = playerTemplate;
        } else if (areRectanglesBlack(skinImage.ctx)) {
          entityTemplate.value = veryOldTemplate;
        } else {
          entityTemplate.value = oldPlayerTemplate;
        }

        skinData.value = skinImage;
      }
    },
    { immediate: true }
);

const entityTemplate = ref(playerTemplate);
</script>

<template>
  <TresGroup>
    <Entity
        v-if="skinData"
        :entityTemplate="entityTemplate"
        :entityTexture="skinUrl"
        :position="position"
        :animation="animation"
    />
  </TresGroup>
</template>
