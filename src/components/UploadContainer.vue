<script setup lang="ts">
import {useUploadStore} from "@/stores/uploadStore";
import {useMiniverseStore} from "@/stores/miniverseStore";

const miniverseStore = useMiniverseStore();
const store = useUploadStore();

</script>

<template>
  <div class="toast-container">
    <TransitionGroup name="toast-list">
      <div
          v-for="upload in store.uploads"
          :key="upload.id"
          class="toast-item upload-item"
          :class="upload.status"
      >
        <div class="content">
          <span class="title">
            {{
              upload.status === 'error' ? 'Failed' : `Upload to ${miniverseStore.getMiniverseById(upload.miniverseId)?.name}`
            }}
          </span>
          <span class="message">{{ (upload.upload.file as File).name }}</span>
        </div>

        <div class="progress-track">
          <div
              class="progress-fill"
              :style="{ width: (upload.bytesUploaded / (upload.upload.file as File).size * 100) + '%' }"
              :class="{ 'done': upload.status === 'success', 'err': upload.status === 'error' }"
          ></div>
        </div>

        <span class="percentage">{{
            (upload.bytesUploaded / (upload.upload.file as File).size * 100).toFixed(2)
          }}%</span>

        <button @click="store.removeUpload(upload.id)" class="close-btn">&times;</button>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toast-container {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
}

/* Si tu veux que les uploads soient EN DESSOUS des toasts existants,
   ajoute un margin-top ou gère ça dans le parent */

.toast-item {
  display: flex;
  position: relative;
  flex-direction: column;
  padding: 0.8em;
  border-radius: 8px;
  width: 280px;
  background: rgba(30, 30, 30, 0.95); /* Fond sombre style Modrinth */
  backdrop-filter: blur(5px);
  color: white;
  box-shadow: 0 4px 17px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  overflow: hidden; /* Important pour la barre de progression */
}

.content {
  display: flex;
  flex-direction: column;
  margin-bottom: 0.5em;
}

.message, .title {
  width: 100%;
}

.title {
  font-size: 1.25em;
  font-weight: bold;
  margin-bottom: 2px;
}

.percentage {
  position: absolute;
  top: 1.3em;
  right: 3.5em;
  font-size: 0.8em;
  font-weight: bold;
  opacity: 0.6;
}

/* Barre de progression */
.progress-track {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 4px;
  width: 100%;
  background: rgba(255, 255, 255, 0.1);
}

.progress-fill {
  height: 100%;
  background: var(--color-primary, #42b883); /* Ta couleur primaire */
  transition: width 0.2s linear;
}

.progress-fill.done {
  background: #4caf50;
}

.progress-fill.err {
  background: #f44336;
}

.close-btn {
  aspect-ratio: 1;
  position: absolute;
  background: rgba(255, 255, 255, 0.7);
  right: 1em;
  top: 1em;
  border-radius: 500px;
  outline: none;
  border: none;
  transition: 0.1s;

  &:hover {
    scale: 1.1;
  }
}

/* Animations de liste Vue (comme ton code actuel) */
.toast-list-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.toast-list-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

.toast-list-enter-active, .toast-list-leave-active {
  transition: all 0.3s ease;
}

</style>