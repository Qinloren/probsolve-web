<script setup lang="ts">

</script>

<template>
  <header class="header-container">
    <div class="header-box">
      <div class="logo-box">
        <img src="/images/favicon.png" alt="刷题鸡" />
        <h2>刷题鸡</h2>
      </div>
      <div class="menu-box">
        <ul class="menu">
          <li class="menu-item">首页</li>
          <li class="menu-item">题库</li>
          <li class="menu-item">练习</li>
          <li class="menu-item">模拟考试</li>
        </ul>
      </div>
      <div class="user-box">
        <div class="search-form">
        </div>
        <div class="user-info">
          <div class="user-info-inner">
            <img src="/images/avatar.png" class="user-basic" alt="AVATAR">
            <span class="user-basic">测试用户</span>
            <i class="i-mdi:keyboard-arrow-down user-basic"></i>
            <i class="i-mdi:menu mobile-menu-icon"></i>
          </div>
        </div>
      </div>
    </div>
    <div class="mobile-menu-box"></div>
  </header>
</template>

<style lang="scss">
@use "@/assets/scss/layout/defaultLayout";
</style>
