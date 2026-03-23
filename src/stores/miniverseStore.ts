import {defineStore} from "pinia";
import {reactive, ref} from "vue";
import {Miniverse, MiniverseAnimator} from "@/models/miniverse";
import {MSMPPlayer, MSMPPlayerBan, PlayerAnimator} from "@/models/player";

type MiniverseAnimatorsMap = Map<string, MiniverseAnimator>
type MiniversePlayersMap = Map<string, PlayerAnimator[]>
type MiniverseBannedPlayersMap = Map<string, MSMPPlayerBan[]>

export const useMiniverseStore = defineStore('miniverse', () => {

  const miniverses = ref<Miniverse[]>([]);
  const miniverseAnimators = reactive<MiniverseAnimatorsMap>(new Map());

  const miniversePlayersLists = reactive<MiniversePlayersMap>(new Map());
  const miniverseBannedPlayersLists = reactive<MiniverseBannedPlayersMap>(new Map());

  const getMiniverseById = (id: string): Miniverse | null => {
    return miniverses.value.find((item) => item.id === id) ?? null;
  }

  const setMiniverses = (newMiniverses: Miniverse[]) => {
    const newById = new Map(newMiniverses.map(m => [m.id, m]));

    // Update or delete
    let i = 0;
    while (i < miniverses.value.length) {
      const existing = miniverses.value[i];
      const incoming = newById.get(existing.id);
      if (incoming) {
        Object.assign(existing, incoming); // update in-place
        newById.delete(existing.id); // Mark as processed
        if (!incoming.started) {
          miniversePlayersLists.set(existing.id, []); // Clear players if miniverse is stopped
        }
        i++
      } else {
        miniverses.value.splice(i, 1); // remove if not in new data
        miniverseAnimators.delete(existing.id);
        miniversePlayersLists.delete(existing.id);
      }
    }

    // Add new ones
    for (const m of newById.values()) {
      const animator = new MiniverseAnimator(m);
      miniverses.value.push(m);
      miniverseAnimators.set(m.id, animator);
      miniversePlayersLists.set(m.id, []);
    }

    miniverses.value = [...miniverses.value]
  }

  const setMiniversePlayers = (newMiniversePlayersLists: Map<string, MSMPPlayer[]>) => {
    for (const [miniverseId, newPlayers] of newMiniversePlayersLists.entries()) {
      const existingAnimators = miniversePlayersLists.get(miniverseId);

      // If the miniverse is not known, we skip it
      // TODO: Fetch miniverse data & players again
      if (existingAnimators === undefined) continue;

      // We build a new array of animators for reactivity
      const updatedAnimators: PlayerAnimator[] = [];

      if (newPlayers) {
        for (const newPlayer of newPlayers) {
          const existingAnimator = existingAnimators.find(
            pa => pa.player.id === newPlayer.id
          );

          if (existingAnimator) {
            // We keep the existing animator but update the player data
            existingAnimator.player = reactive(newPlayer);
            updatedAnimators.push(existingAnimator);
          } else {
            // If the player is new, we create a new animator
            updatedAnimators.push(new PlayerAnimator(newPlayer));
          }
        }
      }

      miniversePlayersLists.set(miniverseId, updatedAnimators);
    }
  };

  return {
    miniverses,
    miniverseAnimators,
    miniversePlayersLists,
    miniverseBannedPlayersLists,
    getMiniverseById,
    setMiniverses,
    setMiniversePlayers
  };
});