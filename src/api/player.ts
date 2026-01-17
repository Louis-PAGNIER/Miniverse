import axios from "axios";
import {MSMPPlayerBan, Player} from "@/models/player";
import {API_BASE} from "@/api/api";

export async function apiGetPlayers(): Promise<Map<string, Player[]>> {
  const response = await axios.get(`${API_BASE}/miniverses/players/`);
  return new Map(Object.entries(response.data));
}

export async function apiGetBans(): Promise<Map<string, MSMPPlayerBan[]>> {
  const response = await axios.get(`${API_BASE}/miniverses/players/banned`);
  return new Map(Object.entries(response.data));
}