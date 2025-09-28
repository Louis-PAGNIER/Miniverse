import {onMounted, onUnmounted, ref} from 'vue'
import {defineStore} from 'pinia'
import {apiGetMiniverses} from "@/api/miniverse"
import {Miniverse, MiniverseAnimator} from "@/models/miniverse";
import {MiniversePlayerList} from "@/models/player";
import {apiGetPlayers} from "@/api/player";
import {WS_BASE} from "@/api/api";

export const useMiniverseStore = defineStore('miniverse', () => {
  const wsSocket = ref<WebSocket | null>(null);
  const wsUrl = `${WS_BASE}/miniverse`;
  const wsStatus = ref<'connecting' | 'open' | 'closed' | 'error'>('closed');

  const miniverses = ref<Miniverse[]>([]);
  const miniverseAnimators = ref<MiniverseAnimator[]>([]);
  const miniversePlayersLists = ref<MiniversePlayerList[]>([]);

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
        i++
      } else {
        miniverses.value.splice(i, 1); // remove if not in new data
        miniverseAnimators.value.splice(i, 1);
        miniversePlayersLists.value.splice(i, 1);
      }
    }

    // Add new ones
    for (const m of newById.values()) {
      const animator = new MiniverseAnimator(m);
      miniverses.value.push(m);
      miniverseAnimators.value.push(animator);
      miniversePlayersLists.value.push({miniverseId: m.id, players: []});
    }
  }

  const fetchPlayers = async () => {
    const newMiniversePlayers = await apiGetPlayers();
    for (const miniversePlayersList of miniversePlayersLists.value) {
      miniversePlayersList.players = newMiniversePlayers[miniversePlayersList.miniverseId] || [];
    }
  }

  const connectWebSocket = () => {
    if (wsSocket.value) {
      return;
      //wsSocket.value.close();
    }
    const token = localStorage.getItem('access_token');
    //document.cookie = `access_token=${token}; path=/; Secure; SameSite=None`;
    wsStatus.value = 'connecting';
    wsSocket.value = new WebSocket(wsUrl);

    wsSocket.value.onopen = () => {
      wsStatus.value = 'open';
      console.log("WebSocket connected");
    };

    wsSocket.value.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('data', data)
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