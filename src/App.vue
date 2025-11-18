<script setup lang="ts">
import { RouterView } from "vue-router";
import { ConfigProvider } from "ant-design-vue";
</script>

<template>
  <config-provider>
    <router-view v-slot="{ Component }">
      <transition name="fade">
        <component :is="Component" />
      </transition>
    </router-view>
  </config-provider>
</template>

<style>
</style>
