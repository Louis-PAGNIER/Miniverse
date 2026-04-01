import {defineStore} from "pinia";
import {computed, reactive, ref} from "vue";
import {Miniverse, MiniverseAnimator} from "@/models/miniverse";
import {MSMPPlayer, MSMPPlayerBan, PlayerAnimator} from "@/models/player";
import {apiGetMiniverses} from "@/api/miniverse";
import {handlers} from "@/services/websocket";

type MiniverseBannedPlayersMap = Map<string, MSMPPlayerBan[]>

export const useMiniverseStore = defineStore('miniverse', () => {

  const miniverses = ref<Miniverse[]>([]);
  const playersMap = ref<Map<string, MSMPPlayer[]>>(new Map());
  const focusedMiniverseId = ref<string | null>(null);

  const focusedMiniverse = computed(() =>
    miniverses.value.find(m => m.id === focusedMiniverseId.value) || null
  );

  const miniverseBannedPlayersLists = reactive<MiniverseBannedPlayersMap>(new Map());

  const getMiniverseById = (id: string): Miniverse | null => {
    return miniverses.value.find((item) => item.id === id) ?? null;
  }

  const setMiniverses = (newList: Miniverse[], markAsNew = false) => {
    if (markAsNew) {
      const currentIds = new Set(miniverses.value.map(m => m.id));
      miniverses.value = newList.map(m => ({
        ...m,
        isNew: !currentIds.has(m.id)
      }));
    } else {
      miniverses.value = newList;
    }
  };

  function setFocus(id: string | null) {
    focusedMiniverseId.value = id;
  }

  const setMiniversePlayers = (newMap: Map<string, MSMPPlayer[]>) => {
    playersMap.value = new Map(newMap);
  };

  return {
    miniverses,
    focusedMiniverse,
    focusedMiniverseId,
    playersMap,
    miniverseBannedPlayersLists,
    getMiniverseById,
    setMiniverses,
    setFocus,
    setMiniversePlayers
  };
});