<script setup lang="ts">
import {onMounted, ref, watch} from "vue";
import {useLoop} from "@tresjs/core";
import {Vector3} from "three";
import {MiniverseUI} from "@/models/miniverse";
import {InterpolationType, NumberAnimator, Vector3Animator} from "@/composables/animations";
import MiniverseView from "@/components/3D/MiniverseView.vue";
import {router} from "@/router";
import {Html} from "@tresjs/cientos";
import {useStableRef} from "@/composables/useStableRef";

const props = defineProps<{
  miniverse: MiniverseUI,
  targetPosition: Vector3,
  targetScale: number,
  isHomeMode: boolean
}>();

const groupRef = ref();
const {ref: viewRef, getStable: getView} = useStableRef();

const positionAnimator = new Vector3Animator(props.targetPosition.clone());
const scaleAnimator = new NumberAnimator(props.targetScale);

watch(() => props.targetPosition, (newPos) => {
  positionAnimator.setGoal(newPos, 1000, InterpolationType.EASE_IN_OUT);
}, {immediate: true});

watch(() => props.targetScale, (newScale) => {
  scaleAnimator.setGoal(newScale, 1000, InterpolationType.EASE_IN_OUT);
}, {immediate: true});

useLoop().onBeforeRender(({delta}) => {
  positionAnimator.update(delta);
  scaleAnimator.update(delta);

  if (groupRef.value) {
    groupRef.value.position.copy(positionAnimator.value);
    groupRef.value.scale.setScalar(scaleAnimator.value);
  }
});

onMounted(() => {
  if (props.miniverse.isNew) {
    assemble();
    props.miniverse.isNew = false;
  }
});

const handleClick = () => {
  if (props.isHomeMode) {
    router.push(`/miniverse/${props.miniverse.id}`);
  }
};

const handlePointerEnter = () => {
  if (props.isHomeMode) {
    document.body.style.cursor = "pointer";
    scaleAnimator.setGoal(props.targetScale * 1.15, 150, InterpolationType.EASE_OUT);
  }
};

const handlePointerLeave = () => {
  if (props.isHomeMode) {
    document.body.style.cursor = "default";
    scaleAnimator.setGoal(props.targetScale, 150, InterpolationType.EASE_OUT);
  }
};

const assemble = async () => {
  await viewRef.value.assemble();
};

const explode = async () => {
  await getView().explode();
};

defineExpose({
  explode
});
</script>

<template>
  <TresGroup ref="groupRef">
    <MiniverseView
        ref="viewRef"
        :miniverse="miniverse"
        @click="handleClick"
        @pointer-enter="handlePointerEnter"
        @pointer-leave="handlePointerLeave"
    />
    <Html
        v-if="isHomeMode"
        transform
        :distance-factor="4"
        :position="[0, -5.5, 0]"
        :scale="[1.5, 1.5, 1.5]"
        :pointer-events="'none'"
    >
    <div class="miniverse-name-wrapper" :class="{ 'is-started': miniverse.started }">
      <h1 class="miniverse-name">
        {{ miniverse.name }}
      </h1>
    </div>
    </Html>
  </TresGroup>
</template>

<style scoped>
.miniverse-name-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 45px;
  border-radius: 100px;
  background: rgba(20, 20, 20, 0.85);
  backdrop-filter: blur(5px);
  min-width: 280px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.5s ease;
}

.miniverse-name {
  margin: 0;
  font-size: 2.2rem;
  font-weight: 700;
  letter-spacing: 3px;
  color: rgba(255, 255, 255, 0.4);
  transition: all 0.5s ease;
}

.is-started {
  background: rgba(10, 10, 15, 0.9);
  border: none;
  box-shadow: 0 0 30px rgba(168, 85, 247, 0.2);
}

.is-started .miniverse-name {
  color: white;
  font-weight: 900;
  text-shadow: 0 0 15px rgba(255, 255, 255, 0.5);
}

.is-started::before {
  content: '';
  position: absolute;
  z-index: -1;
  width: 150%;
  height: 500%;
  background: conic-gradient(
      from 0deg,
      transparent 0deg,
      #8244bd 90deg,
      #0f9368 270deg,
      transparent 360deg
  );
  animation: rotate-bg 8s linear infinite;
}

.is-started::after {
  content: '';
  position: absolute;
  inset: 2px;
  background: rgba(10, 10, 15, 0.95);
  border-radius: 100px;
  z-index: -1;
}

.is-started {
  animation: pulse-glow 3s ease-in-out infinite;
}

@keyframes rotate-bg {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes pulse-glow {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 0 20px rgba(168, 85, 247, 0.2);
  }
  50% {
    transform: scale(1.02);
    box-shadow: 0 0 30px rgba(51, 225, 145, 0.25);
  }
}
</style>