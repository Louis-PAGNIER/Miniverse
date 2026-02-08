<script setup lang="ts">
import Table, {Column} from "@/components/ui/Table.vue";
import {User} from "@/models/user";
import {downgradeRole, Role, upgradeRole} from "@/models/enums/role";
import IconButton from "@/components/ui/IconButton.vue";
import {faPersonArrowDownToLine, faPersonArrowUpFromLine, faTrash} from "@fortawesome/free-solid-svg-icons";
import {apiDeleteUser, apiListUsers, apiSetRole, apiSetUserRole} from "@/api/user";
import {onMounted, ref} from "vue";
import Chip from "@/components/ui/Chip.vue";
import {useAuthStore} from "@/stores/authStore";

const usersList = ref<User[]>([]);

const authStore = useAuthStore();

const rows: User[] = [
  {id: 'e13a2298-ef09-4e03-bd77-586168d5d358', username: 'Louis le vrai', role: Role.ADMIN},
  {id: '1', username: 'Mathis', role: Role.ADMIN},
  {id: '2', username: 'Louis', role: Role.MODERATOR},
  {id: '3', username: 'Louis1', role: Role.USER},
  {id: '4', username: 'Louis2', role: Role.ADMIN},
  {id: '5', username: 'Louis - Copie', role: Role.ADMIN},
  {id: '6', username: 'Louis - Copie', role: Role.ADMIN},
  {id: '7', username: 'Louis - Copie', role: Role.ADMIN},
  {id: '8', username: 'Louis - Copie', role: Role.ADMIN},
  {id: '9', username: 'Louis - Copie', role: Role.ADMIN},
  {id: '10', username: 'Louis - Copie', role: Role.ADMIN},
  {id: '11', username: 'Louis - Copie', role: Role.ADMIN},
  {id: '12', username: 'Louis - Copie', role: Role.ADMIN},
  {id: '13', username: 'Louis - Copie', role: Role.ADMIN},
  {id: '14', username: 'Louis - Copie', role: Role.ADMIN},
  {id: '15', username: 'Louis - Copie', role: Role.ADMIN},
  {id: '16', username: 'Louis - Copie', role: Role.ADMIN},
  {id: '17', username: 'Louis - Copie', role: Role.ADMIN},
]

const columns: Column<User>[] = [
  {id: "username", name: "Username", value: (p: User) => p.username, sortable: true},
  {id: "role", name: "Role", value: (p: User) => p.role, sortable: true},
  {id: "actions", name: "Actions"},
]

async function refreshUsers() {
  usersList.value = await apiListUsers()
}

/* TODO: Add a confirmation popup */
async function deleteUser(userId: string) {
  await apiDeleteUser(userId);
  await refreshUsers();
}

async function setUserRole(userId: string, role: Role) {
  await apiSetRole(userId, role);
  await refreshUsers();
}

onMounted(async () => {
  await refreshUsers()
  usersList.value = rows;
});

</script>

<template>
  <h2>Users</h2>
  <Table :columns="columns" :rows="usersList" :row-key="user => user.id">
    <template #cell-role="{ value }">
      <Chip>{{ value }}</Chip>
    </template>
    <template #cell-actions="{ value }">
      <div v-if="value.id != authStore.me!.id">
        <IconButton :icon="faPersonArrowDownToLine" severity="danger" @click="setUserRole(value.id, downgradeRole(value.role))" :disabled="value.role == Role.USER"></IconButton>
        <IconButton :icon="faPersonArrowUpFromLine" severity="success" @click="setUserRole(value.id, upgradeRole(value.role))" :disabled="value.role == Role.ADMIN"></IconButton>
        <IconButton :icon="faTrash" severity="danger"></IconButton>
      </div>
      <span v-else>
        <Chip background="var(--color-background-secondary)">You</Chip>
      </span>
    </template>
  </Table>
</template>

<style scoped>

</style>