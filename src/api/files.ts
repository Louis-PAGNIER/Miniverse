import axios from "axios";
import {API_BASE} from "@/api/api";
import {FileInfo} from "@/models/fileInfo";

export async function apiListFiles(miniverseId: string, path: string): Promise<FileInfo[]> {
  return (await axios.get(`${API_BASE}/files/${miniverseId}?path=` + path)).data;
}

export async function apiDeleteFiles(miniverseId: string, paths: string[]): Promise<void> {
  await axios.post(`${API_BASE}/files/${miniverseId}/delete`, {
    paths: paths
  })
}

export async function apiCopyFiles(miniverseId: string, paths: string[], destination: string): Promise<void> {
  await axios.post(`${API_BASE}/files/${miniverseId}/copy?destination=${encodeURIComponent(destination)}`, {
    paths: paths
  })
}

export async function apiDownloadFile(token: string): Promise<void> {
  window.location.href = `${API_BASE}/files/download/${token}`;
}

export async function apiDownloadMiniverseFiles(miniverseId: string, paths: string[]): Promise<void> {
  if (paths.length == 0) return;

  const response = await axios.post(
    `${API_BASE}/files/${miniverseId}/download-token`, {
      paths: paths
    });
  const token = response.data;
  await apiDownloadFile(token);
}

export async function apiUploadFiles(miniverseId: string, destination: string, files: File[]): Promise<void> {
  const formData = new FormData();

  for (const file of files) {
    formData.append("files", file);
  }

  await axios.post(
    `${API_BASE}/files/${miniverseId}/upload?destination=${encodeURIComponent(destination)}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
}

export async function apiExtractArchive(miniverseId: string, archivePath: string): Promise<void> {
  await axios.post(`${API_BASE}/files/${miniverseId}/extract?path=${encodeURIComponent(archivePath)}`);
}

export async function apiCompressFiles(miniverseId: string, paths: string[]): Promise<void> {
  await axios.post(`${API_BASE}/files/${miniverseId}/compress`, {
    paths: paths
  });
}

export async function apiRenameItem(miniverseId: string, path: string, newName: string): Promise<void> {
  await axios.post(`${API_BASE}/files/${miniverseId}/rename`, {
    path: path,
    new_name: newName
  });
}