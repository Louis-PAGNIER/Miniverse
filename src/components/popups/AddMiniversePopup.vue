<script setup lang="ts">
import { ref } from "vue";
import { createMiniverse } from "@/api/api";

defineExpose({ open });

const dialogRef = ref<HTMLDialogElement | null>(null);

const defaultForm = {
  type: "fabric",
  version: "",
  name: "",
  subdomain: "",
  maxPlayers: 10,
  description: "",
};

const form = ref({ ...defaultForm });

function open() {
  form.value = { ...defaultForm }; // reset les champs
  dialogRef.value?.showModal();
}

function close() {
  dialogRef.value?.close();
}

function submit() {
  const values = form.value;
  createMiniverse(values.name, values.description, values.type, values.version, values.maxPlayers, values.subdomain).then((result) => {
    if (result.success) {
      console.log("Miniverse créé avec succès :", result.data);
    } else {
      console.error("Erreur lors de la création du miniverse :", result.error);
      alert("Erreur lors de la création du miniverse : " + result.error.message);
    }
  }).catch((error) => {
    console.error("Erreur API :", error);
    alert("Une erreur est survenue lors de la création du miniverse.");
  })
  close();
}
</script>

<template>
  <dialog ref="dialogRef" class="modal" @click.self="close">
    <form @submit.prevent="submit" class="form-content">
      <h2>Créer un nouveau serveur</h2>

      <label>
        Type :
        <select v-model="form.type">
          <option value="fabric">Fabric</option>
          <option value="forge">Forge</option>
          <option value="neoforge">NeoForge</option>
        </select>
      </label>

      <label>
        Version :
        <input type="text" v-model="form.version" placeholder="Ex: 1.20.1" required />
      </label>

      <label>
        Nom :
        <input type="text" v-model="form.name" required />
      </label>

      <label>
        Sous-domaine :
        <input type="text" v-model="form.subdomain" required />
      </label>

      <label>
        Joueurs max :
        <input type="number" min="1" v-model="form.maxPlayers" required />
      </label>

      <label>
        Description :
        <textarea v-model="form.description" placeholder="(optionnelle)" rows="3"></textarea>
      </label>

      <div class="actions">
        <button type="submit">Créer</button>
      </div>
    </form>
  </dialog>
</template>

<style scoped>
/* Overlay / backdrop personnalisé */
::backdrop {
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(3px);
}

.modal {
  border: none;
  border-radius: 12px;
  padding: 0;
  background-color: #1e1e1e;
  color: #fff;
  max-width: 450px;
  width: 90%;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
  margin: auto;
  top: 50%;
  transform: translateY(-50%);
  position: fixed;
  left: 0;
  right: 0;
}

.form-content {
  display: flex;
  flex-direction: column;
  gap: 1em;
  padding: 2em;
}

label {
  display: flex;
  flex-direction: column;
  font-size: 0.9em;
}

input,
select,
textarea {
  margin-top: 0.3em;
  padding: 0.5em;
  border: 1px solid #555;
  border-radius: 6px;
  background-color: #2a2a2a;
  color: white;
  font-size: 0.95em;
}

input:focus,
select:focus,
textarea:focus {
  outline: none;
  border-color: #888;
}

.actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 1em;
}

button[type="submit"] {
  background-color: #4caf50;
  color: white;
  padding: 0.6em 1.2em;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  font-size: 0.95em;
}
</style>