import {onMounted, onUnmounted, reactive, ref} from 'vue'
import {defineStore} from 'pinia'
import {apiGetMiniverses} from "@/api/miniverse"
import {Miniverse, MiniverseAnimator} from "@/models/miniverse";
import {Player, PlayerAnimator} from "@/models/player";
import {apiGetPlayers} from "@/api/player";
import {WS_BASE} from "@/api/api";

type MiniverseAnimatorsMap = Map<string, MiniverseAnimator>
type MiniversePlayersMap = Map<string, PlayerAnimator[]>

export const useMiniverseStore = defineStore('miniverse', () => {
  const wsSocket = ref<WebSocket | null>(null);
  const wsUrl = `${WS_BASE}/miniverse`;
  const wsStatus = ref<'connecting' | 'open' | 'closed' | 'error'>('closed');

  const miniverses = ref<Miniverse[]>([]);
  const miniverseAnimators = reactive<MiniverseAnimatorsMap>(new Map());

  const miniversePlayersLists = reactive<MiniversePlayersMap>(new Map());

  const fetchMiniverses = async () => {
    const newMiniverses = await apiGetMiniverses();
    const newById = new Map(newMiniverses.map(m => [m.id, m]));

    // Update or delete
    let i = 0;
    while (i < miniverses.value.length) {
      const existing = miniverses.value[i];
      const incoming = newById.get(existing.id);
      if (incoming) {
        Object.assign(existing, incoming); // update in-place
        newById.delete(existing.id); // Mark as processed
        if (!incoming.started)
        {
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

  const updatePlayers = (newMiniversePlayersLists: Map<string, Player[]>) => {
    for (const [miniverseId, newPlayers] of newMiniversePlayersLists.entries()) {
      const existingAnimators = miniversePlayersLists.get(miniverseId);

      // If the miniverse is not known, we skip it
      // TODO: Fetch miniverse data & players again
      if (existingAnimators === undefined) continue;

      // We build a new array of animators for reactivity
      const updatedAnimators: PlayerAnimator[] = [];

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

      miniversePlayersLists.set(miniverseId, updatedAnimators);
    }
  };

  const fetchPlayers = async () => {
    const newMiniversePlayersLists = await apiGetPlayers();
    updatePlayers(newMiniversePlayersLists);
  }

  const connectWebSocket = () => {
    // TODO: Repair connection/close logic
    // There is a bug with the websocket being opened/closed multiple times due to app lifecycle
    if (wsSocket.value) {
      return;
      //wsSocket.value.close();
    }
    wsStatus.value = 'connecting';
    wsSocket.value = new WebSocket(wsUrl);

    wsSocket.value.onopen = () => {
      wsStatus.value = 'open';
      console.log("WebSocket connected");
    };

    wsSocket.value.onmessage = async (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('Websocket message', data)
        const miniverseId: string | undefined = data['miniverse-id'];
        if (data.type === 'players')
        {
          const map = new Map<string, Player[]>();
          map.set(miniverseId!, data['data']);
          updatePlayers(map);
          console.log(miniversePlayersLists);
        }
        else if (['created', 'deleted', 'updated'].includes(data.type))
        {
          await fetchMiniverses();
        }
      } catch (e) {
        console.error('Error while parsing WS message', e);
      }
      return false;
    };

    wsSocket.value.onclose = () => {
      wsStatus.value = 'closed';
      console.log("WebSocket disconnected");
    };

    wsSocket.value.onerror = (e) => {
      wsStatus.value = 'error';
      console.error("WebSocket error", e);
    };
  }

  const closeWebSocket = () => {
    console.log("Je suis méchant")
    /*if (wsSocket.value) {
      wsSocket.value.close();
      wsSocket.value = null;
    }*/
  };

  return { miniverses, miniverseAnimators, miniversePlayersLists, fetchMiniverses, fetchPlayers, connectWebSocket, closeWebSocket };
})