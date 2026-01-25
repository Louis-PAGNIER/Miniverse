import {apiClient} from "@/api/api";
import {Miniverse} from "@/models/miniverse";
import {MiniverseType} from "@/models/enums/miniverseType";

export async function apiGetMiniverses(): Promise<Miniverse[]> {
  const response = await apiClient.get('/miniverses/');
  return response.data;
}

export async function apiCreateMiniverse(
  name: string,
  description: string,
  type: MiniverseType,
  MCVersion: string,
  subdomain: string,
  liteProxy: boolean,
): Promise<Miniverse> {
  const response = await apiClient.post('/miniverses/', {
    name: name,
    type: type,
    mc_version: MCVersion,
    description: description,
    subdomain: subdomain,
    is_on_lite_proxy: liteProxy,
  });
  return response.data;
}

export async function apiStartMiniverse(miniverseId: string): Promise<void> {
  await apiClient.post(`/miniverses/${miniverseId}/start/`);
}

export async function apiStopMiniverse(miniverseId: string): Promise<void> {
  await apiClient.post(`/miniverses/${miniverseId}/stop/`);
}

export async function apiRestartMiniverse(miniverseId: string): Promise<void> {
  await apiClient.post(`/miniverses/${miniverseId}/restart/`);
}

export async function apiUpdateMiniverseMCVersion(miniverseId: string, mcVersion: string): Promise<void> {
  await apiClient.post(`/miniverses/${miniverseId}/update_mc_version`, {
    mc_version: mcVersion,
  });
}

export async function apiDeleteMiniverse(miniverseId: string): Promise<void> {
  await apiClient.delete(`/miniverses/${miniverseId}/`);
}

export async function apiInstallMod(miniverseId: string, modVersionId: string): Promise<void> {
  await apiClient.post(`/miniverses/${miniverseId}/install/mod/${modVersionId}`);
}

export async function apiAutomaticModInstall(miniverseId: string, modId: string): Promise<void> {
  await apiClient.post(`/miniverses/${miniverseId}/install/mod`, {
    mod_id: modId,
  });
}

export async function apiUninstallMod(modId: string): Promise<void> {
  await apiClient.delete(`/miniverses/mods/${modId}`);
}

export async function apiSetPlayerOperator(miniverseId: string, playerId: string, value: boolean): Promise<void> {
  await apiClient.post(`/miniverses/${miniverseId}/operator?player_id=${playerId}&value=${value}`);
}

export async function apiKickPlayer(miniverseId: string, playerId: string, reason: string): Promise<void> {
  await apiClient.post(`/miniverses/${miniverseId}/kick?player_id=${playerId}&reason=${encodeURIComponent(reason)}`);
}

export async function apiBanPlayer(miniverseId: string, playerId: string, reason: string): Promise<void> {
  await apiClient.post(`/miniverses/${miniverseId}/ban?player_id=${playerId}&reason=${encodeURIComponent(reason)}`);
}

export async function apiUnbanPlayer(miniverseId: string, playerId: string): Promise<void> {
  await apiClient.post(`/miniverses/${miniverseId}/unban?player_id=${playerId}`);
}