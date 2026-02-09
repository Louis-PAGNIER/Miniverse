import {reactive, ref} from 'vue'
import {defineStore} from 'pinia'
import {apiGetMiniverses} from "@/api/miniverse"
import {Miniverse, MiniverseAnimator} from "@/models/miniverse";
import {MSMPPlayerBan, Player, PlayerAnimator} from "@/models/player";
import {apiGetBans, apiGetPlayers} from "@/api/player";
import {WS_BASE} from "@/api/api";
import {useToastStore} from "@/stores/toastStore";

type MiniverseAnimatorsMap = Map<string, MiniverseAnimator>
type MiniversePlayersMap = Map<string, PlayerAnimator[]>
type MiniverseBannedPlayersMap = Map<string, MSMPPlayerBan[]>

export const useMiniverseStore = defineStore('miniverse', () => {
  const wsSocket = ref<WebSocket | null>(null);
  const wsUrl = `${WS_BASE}/miniverse`;
  const wsStatus = ref<'connecting' | 'open' | 'closed' | 'error'>('closed');

  const miniverses = ref<Miniverse[]>([]);
  const miniverseAnimators = reactive<MiniverseAnimatorsMap>(new Map());

  const miniversePlayersLists = reactive<MiniversePlayersMap>(new Map());
  const miniverseBannedPlayersLists = reactive<MiniverseBannedPlayersMap>(new Map());

  // @ts-ignore
  const reconnectDelay = import.meta.env.DEV ? 1000 : 5000;
  const connectionLostToastId = ref<string | null>(null);

  const getMiniverseById = (id: string): Miniverse | null => {
    return miniverses.value.find((item) => item.id === id) ?? null;
  }

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

  const fetchPlayerBans = async () => {
    const newBans = await apiGetBans();
    for (const [miniverseId, banList] of newBans.entries()) {
      miniverseBannedPlayersLists.set(miniverseId, banList);
    }
  }

  const fetchAll = async () => {
    fetchMiniverses().then(async () => {
      await Promise.all([
        fetchPlayers(),
        fetchPlayerBans()
      ]);
    });
  }

  const connectWebSocket = () => {
    if (wsSocket.value) return;

    wsStatus.value = 'connecting';
    wsSocket.value = new WebSocket(wsUrl);

    wsSocket.value.onopen = async () => {
      wsStatus.value = 'open';
      console.debug("WebSocket connected");

      if (connectionLostToastId.value != null) {
        const toastStore = useToastStore();
        toastStore.removeToast(connectionLostToastId.value);
        connectionLostToastId.value = null;
        await fetchAll();
        toastStore.addToast('Connection restored', 'The server connection has been restored.', 'success');
      }
    };

    wsSocket.value.onmessage = async (event) => {
      try {
        const data = JSON.parse(event.data);
        console.debug('Websocket message', data)
        const miniverseId: string | undefined = data['miniverse_id'];
        if (data.type === 'players') {
          const map = new Map<string, Player[]>();
          map.set(miniverseId!, data['data']);
          updatePlayers(map);
        } else if (data.type === 'player-ban') {
          miniverseBannedPlayersLists.set(miniverseId!, data['data']);
        } else if (['created', 'deleted', 'updated'].includes(data.type)) {
          await fetchMiniverses();
          await fetchPlayers();
        }
      } catch (e) {
        console.error('Error while parsing WS message', e);
      }
      return false;
    };

    wsSocket.value.onclose = () => {
      wsStatus.value = 'closed';
      closeWebSocket();
    };

    wsSocket.value.onerror = (e) => {
      wsStatus.value = 'error';
      console.error("WebSocket error", e);
    };
  }

  const closeWebSocket = () => {
    console.debug("WebSocket disconnected")
    if (connectionLostToastId.value === null) {
      connectionLostToastId.value = useToastStore().addToast('Connection lost', 'Trying to reconnect...', 'danger', null);
    }

    if (wsSocket.value) {
      wsSocket.value.close();
      wsSocket.value = null;
    }

    setTimeout(async () => {
      connectWebSocket();
    }, reconnectDelay);

  };

  return {
    miniverses,
    miniverseAnimators,
    miniversePlayersLists,
    miniverseBannedPlayersLists,
    getMiniverseById,
    fetchMiniverses,
    fetchPlayers,
    fetchPlayerBans,
    fetchAll,
    connectWebSocket,
    closeWebSocket
  };
})