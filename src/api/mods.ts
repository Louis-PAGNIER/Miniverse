import {ModrinthProject, ModrinthProjectVersion, ModrinthSearchResults} from "@/models/mod";
import {apiClient} from "@/api/api";

export async function apiSearchMods(search: string): Promise<ModrinthSearchResults> {
  const response = await apiClient.get(`/mods/search`, { params: { query: search } });
  return response.data;
}

export async function apiGetModDetails(modId: string): Promise<ModrinthProject> {
  const response = await apiClient.get(`/mods/${modId}/details`);
  return response.data;
}

export async function apiGetModVersionDetails(versionId: string): Promise<ModrinthProjectVersion> {
  const response = await apiClient.get(`/mods/${versionId}/details/version`);
  return response.data;
}

export async function apiGetModVersions(modId: string): Promise<ModrinthProjectVersion[]> {
  const response = await apiClient.get(`/mods/${modId}/versions`);
  return response.data;
}
