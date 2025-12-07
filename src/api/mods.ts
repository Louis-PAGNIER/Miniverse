import {Mod, ModrinthSearchResults} from "@/models/mod";
import axios from "axios";
import {API_BASE} from "@/api/api";

export async function apiSearchMods(search: string): Promise<ModrinthSearchResults> {
  const response = await axios.get(`${API_BASE}/mods/search`, { params: { query: search } });
  return response.data;
}