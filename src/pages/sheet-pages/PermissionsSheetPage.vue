<script setup lang="ts">
import {computed, onMounted, ref} from "vue";
import {Miniverse} from "@/models/miniverse";
import Table, {Column} from "@/components/ui/Table.vue";
import {User} from "@/models/user";
import {faPersonArrowDownToLine, faPersonArrowUpFromLine, faPlus, faTrash} from "@fortawesome/free-solid-svg-icons";
import {downgradeRole, Role, upgradeRole} from "@/models/enums/role";
import IconButton from "@/components/ui/IconButton.vue";
import Chip from "@/components/ui/Chip.vue";
import {useAuthStore} from "@/stores/authStore";
import MessagePopup from "@/components/popups/MessagePopup.vue";
import {apiListMiniverseUsersRole, apiSetUserRole} from "@/api/miniverse";
import OverlayButton from "@/components/ui/OverlayButton.vue";
import InputPopup from "@/components/popups/InputPopup.vue";
import {useMiniverseStore} from "@/stores/miniverseStore";

const authStore = useAuthStore();

const miniverseStore = useMiniverseStore();
const miniverse = miniverseStore.focusedMiniverse as Miniverse;

const miniverseUsers = ref<User[]>([]);
const miniverseRoles = computed<Map<string, Role>>(() => {
  const m = new Map<string, Role>();
  console.log(miniverse)
  for (let userRole of miniverse.users_roles)
    m.set(userRole.user_id, userRole.role)
  return m;
})

const userToRemove = ref<User | null>(null);
const isDeleteDialogOpen = computed({
  get: () => userToRemove.value !== null,
  set: (value) => {
    if (!value) userToRemove.value = null;
  }
});

const showAddPopup = ref<boolean>(false);

function confirmRemoveUserFromMiniverse(user: User) {
  userToRemove.value = user;
}

async function removeUserFromMiniverse(userId: string) {
  await apiSetUserRole(miniverse.id, userId, Role.NONE);
  await refreshMiniverseUsers();
}

async function setMiniverseUserRole(userId: string, role: Role) {
  await apiSetUserRole(miniverse.id, userId, role);
  await refreshMiniverseUsers();
}

async function addUser(username: string) {
  await apiSetUserRole(miniverse.id, username, Role.USER);
  await refreshMiniverseUsers();
}

async function refreshMiniverseUsers() {
  miniverseUsers.value = await apiListMiniverseUsersRole(miniverse.id);
}

const addedUsersColumns: Column<User>[] = [
  {id: "username", name: "Username", value: (p: User) => p.username, sortable: true},
  {id: "role", name: "Role", value: (p: User) => miniverseRoles.value.get(p.id), sortable: true},
  {id: "actions", name: "Actions"},
]

onMounted(async () => {
  await refreshMiniverseUsers();
})

</script>

<template>
  <div class="permission-title">
    <h2>Permissions</h2>
    <OverlayButton class="plus-icon" :icon="faPlus" @click="showAddPopup = true"></OverlayButton>
  </div>
  <Table :columns="addedUsersColumns" :rows="miniverseUsers" :row-key="user => user.id">
    <template #cell-actions="{ value }">
      <div v-if="value.id != authStore.me!.id">
        <IconButton :icon="faPersonArrowDownToLine" severity="danger"
                    @click="setMiniverseUserRole(value.id, downgradeRole(miniverseRoles.get(value.id)!))"
                    :disabled="miniverseRoles.get(value.id) == Role.USER"></IconButton>
        <IconButton :icon="faPersonArrowUpFromLine" severity="success"
                    @click="setMiniverseUserRole(value.id, upgradeRole(miniverseRoles.get(value.id)!))"
                    :disabled="miniverseRoles.get(value.id) == Role.ADMIN"></IconButton>
        <IconButton :icon="faTrash" severity="danger" @click="confirmRemoveUserFromMiniverse(value)"></IconButton>
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
      primary-button-text="Remove"
      @ok="removeUserFromMiniverse(userToRemove!.id)">
    Do you want to delete {{ userToRemove!.username }} account ?
  </MessagePopup>

  <InputPopup v-model="showAddPopup" placeholder="Username..." title="Add user to miniverse"
              @ok="value => addUser(value)"></InputPopup>
</template>

<style scoped>
.permission-title {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  .plus-icon {
    aspect-ratio: 1;
  }
}
</style>