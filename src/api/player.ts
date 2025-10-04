import axios from "axios";
import {Player} from "@/models/player";
import {API_BASE} from "@/api/api";

export async function apiGetPlayers(): Promise<Map<string, Player[]>> {
  const response = await axios.get(`${API_BASE}/miniverses/players/`);
  return new Map(Object.entries(response.data));
}
