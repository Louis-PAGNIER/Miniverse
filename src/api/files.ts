import {API_BASE, apiClient} from "@/api/api";
import {FileInfo} from "@/models/fileInfo";
import * as tus from 'tus-js-client'
import {useUploadStore} from "@/stores/uploadStore";

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

  window.location.assign(`${API_BASE}/files/${miniverseId}/download?paths=${encodeURIComponent(paths.toString())}`);
}

export function apiUploadFiles(miniverseId: string, destination: string, files: File[], callback: () => Promise<void>): void {
  const uploadStore = useUploadStore();

  // Create a new tus upload for each files
  for (let file of files) {
    let id: string | null = null

    const upload = new tus.Upload(file, {
      // Endpoint is the upload creation URL from your tus server
      endpoint: '/api/files/tus',
      chunkSize: 100 * 1024 * 1024, // 1M
      // Retry delays will enable tus-js-client to automatically retry on errors
      retryDelays: [0, 1000, 3000, 5000, 10000, 20000, 60000],
      // Attach additional metadata about the file for the server
      metadata: {
        filename: file.name,
        filetype: file.type,
        miniverseId: miniverseId,
        destination: destination,
      },
      // It forces the browser to send your 'sessionid' or 'csrftoken' cookies
      // along with the upload request to the server.
      onBeforeRequest: function (req) {
        const xhr = req.getUnderlyingObject();
        xhr.withCredentials = true;
      },

      // Callback for reporting upload progress
      onProgress: function (bytesUploaded: number, _: number) {
        uploadStore.updateProgress(id!, bytesUploaded)
      },
      // Callback for once the upload is completed
      onSuccess: async function () {
        uploadStore.completeUpload(id!)
        console.debug(`Upload succeed ${file.name} to ${upload.url}`)
        await callback()
      },

      // Callback for errors which cannot be fixed using retries
      onError: function (error) {
        uploadStore.errorUpload(id!)
        console.error('Failed because:', error)
      },
    });

    id = uploadStore.startUpload(upload, miniverseId);

    // Check if there are any previous uploads to continue.
    upload.findPreviousUploads().then(function (previousUploads: any[]) {
      // Found previous uploads so we select the first one.
      if (previousUploads.length) {
        upload.resumeFromPreviousUpload(previousUploads[0])
      }

      // Start the upload
      upload.start()
    })
  }
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