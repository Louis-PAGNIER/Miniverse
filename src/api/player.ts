import axios from "axios";
import {Player} from "@/models/player";
import {API_BASE} from "@/api/api";

export async function apiGetPlayers() {
  const response = await axios.get(`${API_BASE}/miniverses/players/`);
  const miniversesPlayers: { [key: string]: Player[] } = response.data;
  return miniversesPlayers;
}
