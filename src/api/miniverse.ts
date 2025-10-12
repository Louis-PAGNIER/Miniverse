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
    subdomain: string
): Promise<Miniverse> {
    const response = await axios.post(`${API_BASE}/miniverses/`, {
        name: name,
        type: type,
        mc_version: MCVersion,
        description: description,
        subdomain: subdomain,
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