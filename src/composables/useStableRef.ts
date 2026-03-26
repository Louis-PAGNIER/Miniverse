import {ref, watch} from 'vue';

export function useStableRef<T = any>() {
  const internalRef = ref<T | null>(null);
  let stableValue: T | null = null;

  watch(internalRef, (val) => {
    if (val !== null) {
      stableValue = val;
    }
  });

  const getStable = () => stableValue;

  return {
    ref: internalRef,
    getStable
  };
}