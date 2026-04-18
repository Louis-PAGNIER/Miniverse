<script setup lang="ts">
import {ref, computed, watch, onMounted, onBeforeUnmount} from "vue";
import {Vector3} from "three";
import {useLoop} from "@tresjs/core";
import {useMiniverseStore} from "@/stores/miniverseStore";
import {Vector3Animator} from "@/composables/animations";
import {MiniverseLayoutCalculator, CAMERA_CONFIG, type ViewMode} from "@/composables/useMiniverseGrid";
import MiniverseWrapper from "@/components/3D/MiniverseWrapper.vue";
import {Stars} from "@tresjs/cientos";

const props = defineProps<{ mode: ViewMode }>();
const store = useMiniverseStore();

const cameraRef = ref();
const cameraPos = new Vector3Animator(new Vector3(0, 0, 40));
const calculator = new MiniverseLayoutCalculator();

const windowSize = ref({w: window.innerWidth, h: window.innerHeight});
const wrapperRefs = new Map<string, any>();

const setWrapperRef = (el: any, id: any) => {
  if (el) wrapperRefs.set(id, el);
};

const layoutTargets = computed(() => {
  const _ = windowSize.value;
  return calculator.calculate(store.miniverses, props.mode, store.focusedMiniverseId);
});

watch(() => props.mode, (newMode) => {
  const config = CAMERA_CONFIG[newMode];
  if (config) {
    cameraPos.setGoal(config.pos, config.duration, config.interpolation);
  }
}, {immediate: true});

useLoop().onBeforeRender(({delta}) => {
  cameraPos.update(delta);
  if (cameraRef.value) {
    cameraRef.value.position.copy(cameraPos.value);
  }
});

const handleScroll = (e: WheelEvent) => {
  if (props.mode === 'home') {
    const minY = calculator.getMinY();
    const targetY = Math.max(minY, Math.min(0, cameraPos.endValue.y - e.deltaY * 0.02));
    cameraPos.setGoal(new Vector3(0, targetY, cameraPos.value.z), 0);
  }
};

const handleResize = () => {
  windowSize.value = {w: window.innerWidth, h: window.innerHeight};
};

onMounted(() => {
  document.addEventListener("wheel", handleScroll);
  window.addEventListener("resize", handleResize);
});

onBeforeUnmount(() => {
  document.removeEventListener("wheel", handleScroll);
  document.removeEventListener("resize", handleResize);
});

const onLeave = async (el: any, done: () => void) => {
  const id = el.name;
  const wrapper = wrapperRefs.get(id);

  if (wrapper) {
    try {
      await wrapper.explode();
    } finally {
      wrapperRefs.delete(id);
    }
  }
  done();
};
</script>

<template>
  <TresPerspectiveCamera ref="cameraRef" :position="[0, 0, 40]" :fov="30"/>
  <Stars :size="0.1" :radius="20"/>

  <TresGroup v-if="cameraRef">
    <TransitionGroup
        :css="false"
        @leave="onLeave"
    >
      <MiniverseWrapper
          v-for="miniverse in store.miniverses"
          :key="miniverse.id"
          :name="miniverse.id"
          :ref="(el) => setWrapperRef(el, miniverse.id)"
          :miniverse="miniverse"
          :targetPosition="layoutTargets.get(miniverse.id)?.position || new Vector3()"
          :targetScale="layoutTargets.get(miniverse.id)?.scale || 1.0"
          :isHomeMode="props.mode === 'home'"
      />
    </TransitionGroup>
  </TresGroup>

  <TresAmbientLight :intensity="0.7"/>
  <TresPointLight :position="[-10, 10, 10]" :intensity="150"/>
</template>