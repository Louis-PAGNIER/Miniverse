import {MSMPPlayerBan, Player} from "@/models/player";
import {apiClient} from "@/api/api";

export async function apiGetPlayers(): Promise<Map<string, Player[]>> {
  const response = await apiClient.get(`/miniverses/players/`);
  return new Map(Object.entries(response.data));
}

export async function apiGetBans(): Promise<Map<string, MSMPPlayerBan[]>> {
  const response = await apiClient.get(`/miniverses/players/banned`);
  return new Map(Object.entries(response.data));
}