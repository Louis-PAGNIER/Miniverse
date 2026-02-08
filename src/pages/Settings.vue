<script setup lang="ts">
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {
  faChartSimple,
  faGears,
  faInfoCircle,
  faUser,
  faUsers
} from "@fortawesome/free-solid-svg-icons";
import {useAuthStore} from "@/stores/authStore";

const authStore = useAuthStore();
</script>

<template>
  <div class="wrapper">
    <div class="main">
      <div class="left-panel">
        <router-link to="/settings/" class="nav-item" v-if="authStore.isModerator">
          <font-awesome-icon :icon="faGears"></font-awesome-icon>
          Main settings
        </router-link>

        <router-link to="/settings/account" class="nav-item">
          <font-awesome-icon :icon="faUser"></font-awesome-icon>
          Account
        </router-link>

        <router-link to="/settings/users" class="nav-item" v-if="authStore.isAdmin">
          <font-awesome-icon :icon="faUsers"></font-awesome-icon>
          Users
        </router-link>

        <router-link to="/settings/statistics" class="nav-item" v-if="authStore.isAdmin">
          <font-awesome-icon :icon="faChartSimple"></font-awesome-icon>
          Statistics
        </router-link>

        <router-link to="/settings/information" class="nav-item">
          <font-awesome-icon :icon="faInfoCircle"></font-awesome-icon>
          Information
        </router-link>
      </div>

      <div class="right-panel scrollbar">
        <router-view />
      </div>

    </div>
  </div>
</template>

<style scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  position: absolute;
  left: 20px;
  right: 20px;
  top: 10vh;
  bottom: 20px;

  .title {
    font-size: 3em;
    text-align: center;
  }

  .main {
    background: var(--color-background-primary);
    border: 1px solid gray;
    border-radius: 10px;
    width: 100%;
    height: 100%;
    overflow: hidden;
    display: flex;

    .left-panel {
      width: 300px;
      border-right: 1px solid gray;
      height: 100%;
      display: flex;
      flex-direction: column;

      .nav-item {
        height: 80px;
        padding: 1em;
        font-size: 1.5em;
        width: 100%;
        display: flex;
        align-items: center;
        gap: 0.5em;
        border-bottom: 1px solid gray;
        cursor: pointer;
        text-decoration: none;

        &.router-link-exact-active {
          background: var(--color-background-secondary);
          border-left: 4px solid var(--color-primary);
        }

        &:hover {
          background: var(--color-background-secondary);
        }

        &:active {
          background: var(--color-background-tertiary);
        }
      }
    }

    .right-panel {
      width: 100%;
      padding: 1em;
      position: relative;
      overflow-y: scroll;
    }
  }
}

</style>