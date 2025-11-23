<script setup lang="ts">
import { RouterView } from "vue-router";
import zh_CN from "ant-design-vue/es/locale/zh_CN";
</script>

<template>
  <a-config-provider :locale="zh_CN">
    <router-view v-slot="{ Component }">
      <transition name="slide" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </a-config-provider>
</template>

<style lang="scss">
@use '@/assets/scss/base';
</style>
