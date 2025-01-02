<script setup>
import { DoubleSide, FrontSide, NearestFilter, TextureLoader } from "three";
import { onMounted, ref } from "vue";
import { addArray, mulScalar, negArray } from "../math.js"

const skinTexture = "/src/assets/louisleroisoleil.png";
const imageWidth = 64;
const imageHeight = 32;

// Left, Right, Top, Bottom, Front, Back
const playerSkinTemplate = {
  head: {
    position: [0, 3.5, 0],
    rotationCenter: [0, -0.5, 0],
    size: [1, 1, 1],
    layers: [
      {
        scale: 1,
        coords: [
          [16, 8, 24, 16], [0, 8, 8, 16], [8, 0, 16, 8], [16, 0, 24, 8], [8, 8, 16, 16], [24, 8, 32, 16]
        ],
        transparent: false
      },
      {
        scale: 1.13,
        coords: [
          [48, 8, 56, 16], [32, 8, 40, 16], [40, 0, 48, 8], [48, 0, 56, 8], [40, 8, 48, 16], [56, 8, 64, 16]
        ],
        position: [0, 3.5, 0],
        transparent: true
      },
    ]
  },

  body: {
    position: [0, 2.25, 0],
    rotationCenter: [0, 0, 0],
    size: [1, 1.5, 0.5],
    layers: [
      {
        scale: 1,
        coords: [
          [28, 20, 32, 32], [16, 20, 20, 32], [20, 16, 28, 20], [28, 16, 36, 20], [20, 20, 28, 32], [32, 20, 40, 32]
        ],
        transparent: false
      },
    ]
  },

  left_arm: {
    position: [0.75, 2.25, 0],
    rotationCenter: [0, 0, 0],
    size: [0.5, 1.5, 0.5],
    layers: [
      {
        scale: 1,
        coords: [
          [44, 20, 40, 32], [52, 20, 48, 32], [48, 16, 44, 20], [52, 16, 48, 20], [48, 20, 44, 32], [56, 20, 52, 32]
        ],
        transparent: false
      }
    ]
  },

  right_arm: {
    position: [-0.75, 2.25, 0],
    rotationCenter: [0, 0, 0],
    size: [0.5, 1.5, 0.5],
    layers: [
      {
        scale: 1,
        coords: [
          [48, 20, 52, 32], [40, 20, 44, 32], [44, 16, 48, 20], [48, 16, 52, 20], [44, 20, 48, 32], [52, 20, 56, 32]
        ],
        transparent: false
      }
    ]
  },

  left_leg: {
    position: [0.25, 0.75, 0],
    rotationCenter: [0, 0, 0],
    size: [0.5, 1.5, 0.5],
    layers: [
      {
        scale: 1,
        coords: [
          [4, 20, 0, 32], [12, 20, 8, 32], [8, 16, 4, 20], [12, 16, 8, 20], [8, 20, 4, 32], [16, 20, 12, 32]
        ],
        transparent: false
      }
    ]
  },

  right_leg: {
    position: [-0.25, 0.75, 0],
    rotationCenter: [0, 0, 0],
    size: [0.5, 1.5, 0.5],
    layers: [
      {
        scale: 1,
        coords: [
          [8, 20, 12, 32], [0, 20, 4, 32], [4, 16, 12, 20], [8, 16, 16, 20], [4, 20, 8, 32], [12, 20, 16, 32]
        ],
        transparent: false
      }
    ]
  }
}

const materials = ref({});
const texturesLoaded = ref(false);

onMounted(async () => {
  const textureLoader = new TextureLoader();

  const loadFaceTexture = (x1, y1, x2, y2, flip=false) => {
    return new Promise((resolve) => {
      const w = x2 - x1
      const h = y2 - y1

      const texture = textureLoader.load(skinTexture, () => {
        texture.magFilter = NearestFilter;
        texture.repeat.set(w / imageWidth, h / imageHeight);
        if (!flip)
          texture.offset.set(x1 / imageWidth, 1 - y2 / imageHeight);
        else
          texture.offset.set(x1 / imageWidth, y1 / imageHeight);
        texture.flipY = !flip
        resolve(texture);
      });
    });
  };

  const loadedMaterials = {};
  for (const partName of Object.keys(playerSkinTemplate)) {
    const part = playerSkinTemplate[partName];
    for (let i = 0; i < part.layers.length; i++) {
      const layer = part.layers[i];
      let promises = []
      for (let j = 0; j < 6; j++) {
        let coords = layer.coords[j];
        promises.push(loadFaceTexture(coords[0], coords[1], coords[2], coords[3], j === 3));
      }
      loadedMaterials[partName + "_" + i] = await Promise.all(promises);
    }
  }

  materials.value = loadedMaterials;
  texturesLoaded.value = true;
});
</script>

<template>
  <!-- Debug  -->
  <TresGroup v-if="true">
    <TresMesh :position="[5/2, 0, 0]"><TresBoxGeometry :args="[5, 0.1, 0.1]"/><TresMeshBasicMaterial color="red"/></TresMesh>
    <TresMesh :position="[0, 5/2, 0]"><TresBoxGeometry :args="[0.1, 5, 0.1]"/><TresMeshBasicMaterial color="green"/></TresMesh>
    <TresMesh :position="[0, 0, 5/2]"><TresBoxGeometry :args="[0.1, 0.1, 5]"/><TresMeshBasicMaterial color="blue"/></TresMesh>
  </TresGroup>

  <TresGroup v-if="texturesLoaded">
    <TresGroup v-for="(groupName, groupIndex) in Object.keys(playerSkinTemplate)" :key="groupIndex"
               :position="addArray(playerSkinTemplate[groupName].position, playerSkinTemplate[groupName].rotationCenter)" :rotation="groupName === 'head' ? [45*Math.PI/180, 0, 0] : [0, 0, 0]">
      <TresMesh v-for="(layer, layerIndex) in playerSkinTemplate[groupName].layers" :key="layerIndex"
                :position="negArray(playerSkinTemplate[groupName].rotationCenter)">
        <TresBoxGeometry :args="mulScalar(playerSkinTemplate[groupName].size, layer.scale)"/>
        <TresMeshStandardMaterial
            v-for="(texture, index) in materials[groupName + '_' + layerIndex]"
            :key="index"
            :map="texture"
            :attach="'material-' + index"
            :transparent="layer.transparent"
            :side="layer.transparent ? DoubleSide : FrontSide"
            :alphaTest="layer.transparent ? 0.001 : 0"
        />
      </TresMesh>
    </TresGroup>
  </TresGroup>
</template>