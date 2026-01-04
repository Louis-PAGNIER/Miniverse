import {Mod, ModrinthProject, ModrinthProjectVersion, ModrinthSearchResults} from "@/models/mod";
import axios from "axios";
import {API_BASE} from "@/api/api";

export async function apiSearchMods(search: string): Promise<ModrinthSearchResults> {
  const response = await axios.get(`${API_BASE}/mods/search`, { params: { query: search } });
  return response.data;
}

export async function apiGetModDetails(modId: string): Promise<ModrinthProject> {
  const response = await axios.get(`${API_BASE}/mods/${modId}/details`);
  return response.data;
}

export async function apiGetModVersionDetails(versionId: string): Promise<ModrinthProjectVersion> {
  const response = await axios.get(`${API_BASE}/mods/${versionId}/details/version`);
  return response.data;
}

export async function apiGetModVersions(modId: string): Promise<ModrinthProjectVersion[]> {
  const response = await axios.get(`${API_BASE}/mods/${modId}/versions`);
  return response.data;
}
