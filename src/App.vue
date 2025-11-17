<script setup lang="ts">
import { RouterView } from "vue-router";
</script>

<template>
  <a-config-provider>
    <router-view v-slot="{ Component }">
      <transition name="fade">
        <component :is="Component" />
      </transition>
    </router-view>
  </a-config-provider>
</template>

<style>
</style>
