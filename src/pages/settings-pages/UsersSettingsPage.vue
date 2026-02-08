<script setup lang="ts">
import Table, {Column} from "@/components/ui/Table.vue";
import {User} from "@/models/user";
import {downgradeRole, Role, upgradeRole} from "@/models/enums/role";
import IconButton from "@/components/ui/IconButton.vue";
import {
  faCheck,
  faPersonArrowDownToLine,
  faPersonArrowUpFromLine,
  faTrash, faXmark
} from "@fortawesome/free-solid-svg-icons";
import {
  apiAcceptUserRequest,
  apiDeleteUser,
  apiListInactiveUsers,
  apiListUsers,
  apiRejectUserRequest,
  apiSetRole
} from "@/api/user";
import {computed, onMounted, ref} from "vue";
import Chip from "@/components/ui/Chip.vue";
import {useAuthStore} from "@/stores/authStore";
import MessagePopup from "@/components/popups/MessagePopup.vue";

const usersList = ref<User[]>([]);
const inactiveUsersList = ref<User[]>([]);

const userToDelete = ref<User | null>(null);

const isDeleteDialogOpen = computed({
  get: () => userToDelete.value !== null,
  set: (value) => {
    if (!value) userToDelete.value = null;
  }
});

const authStore = useAuthStore();

const inactiveUsersColumns: Column<User>[] = [
  {id: "username", name: "Username", value: (p: User) => p.username, sortable: true},
  {id: "actions", name: "Actions"},
];

const allUsersColumns: Column<User>[] = [
  {id: "username", name: "Username", value: (p: User) => p.username, sortable: true},
  {id: "role", name: "Role", value: (p: User) => p.role, sortable: true},
  {id: "actions", name: "Actions"},
]

async function refreshUsers() {
  usersList.value = await apiListUsers()
}

function confirmDeleteUser(user: User) {
  userToDelete.value = user;
}

async function deleteUser(userId: string) {
  await apiDeleteUser(userId);
  await refreshUsers();
}

async function setUserRole(userId: string, role: Role) {
  await apiSetRole(userId, role);
  await refreshUsers();
}

async function refreshInactiveUsers() {
  inactiveUsersList.value = await apiListInactiveUsers();
}

async function acceptUserRequest(userId: string) {
  await apiAcceptUserRequest(userId);
  await Promise.all([refreshUsers(), refreshInactiveUsers()]);
}

async function rejectUserRequest(userId: string) {
  await apiRejectUserRequest(userId);
  await refreshInactiveUsers();
}

onMounted(async () => {
  await Promise.all([refreshUsers(), refreshInactiveUsers()]);
});

</script>

<template>
  <template v-if="inactiveUsersList.length > 0">
    <h2>Pending user requests</h2>
    <Table :columns="inactiveUsersColumns" :rows="inactiveUsersList" :row-key="user => user.id">
      <template #cell-actions="{ value }">
        <IconButton :icon="faCheck" severity="success" @click="acceptUserRequest(value.id)"></IconButton>
        <IconButton :icon="faXmark" severity="danger" @click="rejectUserRequest(value.id)"></IconButton>
      </template>
    </Table>
  </template>


  <h2>All users</h2>
  <Table :columns="allUsersColumns" :rows="usersList" :row-key="user => user.id">
    <template #cell-role="{ value }">
      <Chip>{{ value }}</Chip>
    </template>
    <template #cell-actions="{ value }">
      <div v-if="value.id != authStore.me!.id">
        <IconButton :icon="faPersonArrowDownToLine" severity="danger" @click="setUserRole(value.id, downgradeRole(value.role))" :disabled="value.role == Role.USER"></IconButton>
        <IconButton :icon="faPersonArrowUpFromLine" severity="success" @click="setUserRole(value.id, upgradeRole(value.role))" :disabled="value.role == Role.ADMIN"></IconButton>
        <IconButton :icon="faTrash" severity="danger" @click="confirmDeleteUser(value)"></IconButton>
      </div>
      <span v-else>
        <Chip background="var(--color-background-secondary)">You</Chip>
      </span>
    </template>
  </Table>
  <MessagePopup
      v-model="isDeleteDialogOpen"
      title="Delete user"
      severity="danger"
      primary-button-text="Delete"
      @ok="deleteUser(userToDelete!.id)">
    Do you want to delete {{ userToDelete!.username }} account ?
  </MessagePopup>
</template>

<style scoped>

</style>