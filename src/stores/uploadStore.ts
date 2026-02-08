import {defineStore} from 'pinia';
import {ref} from 'vue';
import {Upload} from "tus-js-client";

export interface UploadItem {
  id: string;
  miniverseId: string;
  bytesUploaded: number;
  upload: Upload;
  status: 'uploading' | 'success' | 'error';
}

export const useUploadStore = defineStore('upload', () => {
  const uploads = ref<UploadItem[]>([]);

  // Créer une entrée pour un nouvel upload
  function startUpload(upload: Upload, miniverseId: string) {
    const id = window.crypto.randomUUID();

    uploads.value.unshift({ // .unshift pour mettre le plus récent en haut
      id,
      miniverseId: miniverseId,
      bytesUploaded: 0,
      upload: upload,
      status: 'uploading'
    });

    return id;
  }

  // Mettre à jour la progression
  function updateProgress(id: string, bytesUploaded: number) {
    const item = uploads.value.find(u => u.id === id);
    if (item) item.bytesUploaded = bytesUploaded;
  }

  // Marquer comme terminé (et retirer après un délai si tu veux)
  function completeUpload(id: string) {
    const item = uploads.value.find(u => u.id === id);
    if (item) {
      item.bytesUploaded = (item.upload.file as File).size;
      item.status = 'success';

      setTimeout(() => removeUpload(id), 3000);
    }
  }

  function errorUpload(id: string) {
    const item = uploads.value.find(u => u.id === id);
    if (item) {
      item.status = 'error';

      setTimeout(() => removeUpload(id), 3000);
    }
  }

  function removeUpload(id: string) {
    const item = uploads.value.find(u => u.id === id);
    if (item) {
      if (item.status === 'uploading') {
        item.upload.abort(true) // remove file from server
      }

      uploads.value = uploads.value.filter(u => u.id !== id);
    }
  }

  return {uploads, startUpload, updateProgress, completeUpload, errorUpload, removeUpload};
});