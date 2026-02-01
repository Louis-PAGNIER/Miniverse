<script setup lang="ts">

import {faCalendar} from "@fortawesome/free-regular-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {inject} from "vue";

const {
  modDetails,
} = inject<any>('modContext');
</script>

<template>
  <div class="gallery">
    <div class="card" v-for="item of modDetails.gallery">
      <img :src="item.url">
      <div class="footer">
        <span class="title">{{ item.title }}</span>
        <span class="description">{{ item.description }}</span>
        <span class="date">
              <font-awesome-icon :icon="faCalendar"></font-awesome-icon> {{ (new Date(item.created)).toLocaleDateString()}}
            </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.gallery {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 15px;

  .card {
    width: 442px;
    background: var(--color-background-secondary);
    border-radius: 20px;
    overflow: hidden;

    img {
      width: 100%;
      height: 200px;
      object-fit: cover;
    }

    .footer {
      padding: 10px;
      display: flex;
      flex-direction: column;

      .title {
        font-size: 1.1em;
        font-weight: bold;
        margin-bottom: 5px;
      }

      .description {
        color: var(--color-secondary);
        line-height: 1.2em;
        margin-bottom: 10px;
      }
    };
  }
}
</style>