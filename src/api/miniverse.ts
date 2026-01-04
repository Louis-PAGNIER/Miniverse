import axios from "axios";
import {API_BASE} from "@/api/api";
import {Miniverse} from "@/models/miniverse";
import {MiniverseType} from "@/models/enums/miniverseType";

export async function apiGetMiniverses(): Promise<Miniverse[]> {
    const response = await axios.get(`${API_BASE}/miniverses/`);
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
    const response = await axios.post(`${API_BASE}/miniverses/`, {
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
    await axios.post(`${API_BASE}/miniverses/${miniverseId}/start/`);
}

export async function apiStopMiniverse(miniverseId: string): Promise<void> {
    await axios.post(`${API_BASE}/miniverses/${miniverseId}/stop/`);
}

export async function apiRestartMiniverse(miniverseId: string): Promise<void> {
    await axios.post(`${API_BASE}/miniverses/${miniverseId}/restart/`);
}

export async function apiUpdateMiniverseMCVersion(miniverseId: string, mcVersion: string): Promise<void> {
    await axios.post(`${API_BASE}/miniverses/${miniverseId}/update_mc_version`, {
        mc_version: mcVersion,
    });
}

export async function apiDeleteMiniverse(miniverseId: string): Promise<void> {
    await axios.delete(`${API_BASE}/miniverses/${miniverseId}/`);
}

export async function apiInstallMod(miniverseId: string, modVersionId: string): Promise<void> {
    await axios.post(`${API_BASE}/miniverses/${miniverseId}/install/mod/${modVersionId}`);
}

export async function apiAutomaticModInstall(miniverseId: string, modId: string): Promise<void> {
    await axios.post(`${API_BASE}/miniverses/${miniverseId}/install/mod`, {
        mod_id: modId,
    });
}

export async function apiUninstallMod(modId: string): Promise<void> {
    await axios.delete(`${API_BASE}/miniverses/mods/${modId}`);
}