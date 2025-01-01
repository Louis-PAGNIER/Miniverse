<script setup>
import { NearestFilter, TextureLoader } from "three";
import { onMounted, ref } from "vue";

const skinTexture = "/src/assets/louisleroisoleil.png";
const imageWidth = 64;
const imageHeight = 32;

// Right, Left, Top, Bottom, Front, Back

const parts = [
  {
    name: "head",
    size: [1, 1, 1],
    coords: [
      [16, 8], [0, 8], [8, 0], [16, 0], [8, 8], [24, 8],
    ],
    dims: [
      [8, 8], [8, 8], [8, 8], [8, 8], [8, 8], [8, 8]
    ],
    position: [0, 2*1.5 + 1/2, 0],
    transparent: false,
  },
  {
    name: "hat",
    size: [1.13, 1.13, 1.13],
    coords: [
      [48, 8], [32, 8], [40, 0], [48, 0], [40, 8], [56, 8],
    ],
    dims: [
      [8, 8], [8, 8], [8, 8], [8, 8], [8, 8], [8, 8]
    ],
    position: [0, 2*1.5 + 1/2, 0],
    transparent: true,
  },
  {
    name: "body",
    size: [1, 1.5, 0.5],
    coords: [
      [28, 20], [16, 20], [20, 16], [28, 16], [20, 20], [32, 20]
    ],
    dims: [
      [4, 12], [4, 12], [8, 4], [8, 4], [8, 12], [8, 12]
    ],
    position: [0, 1.5/2+1.5, 0],
    transparent: false,
  },
  {
    name: "right-leg",
    size: [0.5, 1.5, 0.5],
    coords: [
      [8, 20], [0, 20], [4, 16], [8, 16], [4, 20], [12, 20]
    ],
    dims: [
      [4, 12], [4, 12], [8, 4], [8, 4], [4, 12], [4, 12]
    ],
    position: [1/4, 1.5/2, 0],
    transparent: false,
  }
];

const materials = ref({});
const texturesLoaded = ref(false);

onMounted(async () => {
  const textureLoader = new TextureLoader();

  const loadFaceTexture = (x, y, w, h, flip=false) => {
    return new Promise((resolve) => {
      const texture = textureLoader.load(skinTexture, () => {
        texture.magFilter = NearestFilter;
        texture.repeat.set(w / imageWidth, h / imageHeight);
        if (!flip)
          texture.offset.set(x / imageWidth, 1 - (y + h) / imageHeight);
        else
          texture.offset.set(x / imageWidth, y / imageHeight);
        texture.flipY = !flip
        resolve(texture);
      });
    });
  };

  const loadedMaterials = {};
  for (const part of parts) {
    let promises = []
    for (let j = 0; j < 6; j++) {
      let coords = part.coords[j];
      let dims = part.dims[j];
      promises.push(loadFaceTexture(coords[0], coords[1], dims[0], dims[1], j==3));
    }
    loadedMaterials[part.name] = await Promise.all(promises);
  }

  materials.value = loadedMaterials;
  texturesLoaded.value = true;
});
</script>

<template>
  <TresGroup v-if="texturesLoaded">
    <template v-for="(part, partIndex) in parts" :key="partIndex">
      <TresMesh :position="part.position">
        <TresBoxGeometry :args="part.size" />
        <TresMeshStandardMaterial
            v-for="(texture, index) in materials[part.name]"
            :key="index"
            :map="texture"
            :attach="'material-' + index"
            :transparent="part.transparent"
        />
      </TresMesh>
    </template>
  </TresGroup>
</template>