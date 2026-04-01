import {useWebSocket, UseWebSocketReturn} from '@vueuse/core'
import {useToastStore} from "@/stores/toastStore";
import {ref} from "vue";
import {WS_BASE} from "@/api/api";
import {useMiniverseStore} from "@/stores/miniverseStore";
import {apiGetMiniverses} from "@/api/miniverse";
import {SyncEvent} from "@/models/events";
import {MSMPPlayer} from "@/models/player";

let wsInstance: UseWebSocketReturn<any> | null = null

const connectionLostToastId = ref<string | null>(null);
const wsUrl = `${WS_BASE}/miniverse`;

export const handlers = new Map<string, (data: any) => void>();

export const initWebsocketService = (url = wsUrl) => {
  // Évite de créer plusieurs connexions si la fonction est appelée plusieurs fois
  if (wsInstance !== null) return;

  // @ts-ignore
  const reconnectDelay = import.meta.env.DEV ? 1000 : 5000;

  wsInstance = useWebSocket(url, {
    autoReconnect: {
      delay: reconnectDelay,
    },
    onConnected() {
      console.log('[WS Service] Connected')
      if (connectionLostToastId.value != null) {
        const toastStore = useToastStore();
        toastStore.removeToast(connectionLostToastId.value);
        connectionLostToastId.value = null;
        toastStore.addToast('Connection restored', 'The server connection has been restored.', 'success');
      }
    },
    onDisconnected() {
      console.warn('[WS Service] Disconnected')
      if (connectionLostToastId.value === null) {
        connectionLostToastId.value = useToastStore().addToast('Connection lost', 'Trying to reconnect...', 'danger', null);
      }
    },
    onError(_, event) {
      console.error('[WS Service] Error', event)
    },
    onMessage(_, event) {
      try {
        const data = JSON.parse(event.data);
        const eventType = data['type'];

        const handler = handlers.get(eventType);
        if (handler) handler(data);
        else console.error('[WS Service] Error handler not found for ', event);

      } catch (e) {
        console.error('[WS Service] Error while parsing response', e);
      }
    }
  })
}

const handleSync = async (data: SyncEvent) => {
  const store = useMiniverseStore();

  const miniverses = data.data.map(el => el.miniverse);

  store.setMiniverses(miniverses);

  const mapped_players: [string, MSMPPlayer[]][] = data.data.map(el => [
    el.miniverse.id,
    el.players
  ]);
  const playersMap = new Map<string, MSMPPlayer[]>(mapped_players);

  store.setMiniversePlayers(playersMap);

  for (const el of data.data) {
    store.miniverseBannedPlayersLists.set(el.miniverse.id, el.banned_players);
  }
};

const handleMiniverseChanges = async (_: any) => {
  const store = useMiniverseStore();
  store.setMiniverses(await apiGetMiniverses());
};

const handleMiniverseCreated = async (_: any) => {
  const store = useMiniverseStore();
  store.setMiniverses(await apiGetMiniverses(), true);
};

const handleMiniversePlayersChange = async (data: any) => {
  const store = useMiniverseStore();
  store.setMiniversePlayers(new Map<string, MSMPPlayer[]>([[data.miniverse_id, data.data]]));
}

const handleMiniverseBannedPlayersChange = async (data: any) => {
  const store = useMiniverseStore();
  store.miniverseBannedPlayersLists.set(data.miniverse_id, data.data);
}

handlers.set("sync", handleSync);
handlers.set("miniverse:created", handleMiniverseCreated);
handlers.set("miniverse:deleted", handleMiniverseChanges);
handlers.set("miniverse:updated", handleMiniverseChanges);

handlers.set("minecraft:players", handleMiniversePlayersChange);
handlers.set("minecraft:bans", handleMiniverseBannedPlayersChange);
