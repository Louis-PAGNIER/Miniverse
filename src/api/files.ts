import {API_BASE, apiClient} from "@/api/api";
import {FileInfo} from "@/models/fileInfo";

export async function apiListFiles(miniverseId: string, path: string): Promise<FileInfo[]> {
  return (await apiClient.get(`/files/${miniverseId}?path=` + path)).data;
}

export async function apiDeleteFiles(miniverseId: string, paths: string[]): Promise<void> {
  await apiClient.post(`/files/${miniverseId}/delete`, {
    paths: paths
  })
}

export async function apiCopyFiles(miniverseId: string, paths: string[], destination: string): Promise<void> {
  await apiClient.post(`/files/${miniverseId}/copy?destination=${encodeURIComponent(destination)}`, {
    paths: paths
  })
}

export async function apiDownloadMiniverseFiles(miniverseId: string, paths: string[]): Promise<void> {
  if (paths.length == 0) return;

  window.location.assign(`${API_BASE}/files/${miniverseId}/download/?paths=${encodeURIComponent(paths.toString())}`);
}

export async function apiUploadFiles(miniverseId: string, destination: string, files: File[]): Promise<void> {
  const formData = new FormData();

  for (const file of files) {
    formData.append("files", file);
  }

  await apiClient.post(
    `/files/${miniverseId}/upload?destination=${encodeURIComponent(destination)}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
}

export async function apiExtractArchive(miniverseId: string, archivePath: string): Promise<void> {
  await apiClient.post(`/files/${miniverseId}/extract?path=${encodeURIComponent(archivePath)}`);
}

export async function apiCompressFiles(miniverseId: string, paths: string[]): Promise<void> {
  await apiClient.post(`/files/${miniverseId}/compress`, {
    paths: paths
  });
}

export async function apiRenameItem(miniverseId: string, path: string, newName: string): Promise<void> {
  await apiClient.post(`/files/${miniverseId}/rename`, {
    path: path,
    new_name: newName
  });
}