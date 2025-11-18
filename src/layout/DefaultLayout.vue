<script setup lang="ts">
import { reactive, ref } from 'vue'

const data = reactive({
  expandedUserInfoMenu: false,
  isUserInfoMenuAnimating: false,
  isMouseInUserArea: false
})
const userInfoMenuBox = ref();
const headerContainer = ref();

const onMouseEnterUserBox = () => {
  if (data.isUserInfoMenuAnimating || data.expandedUserInfoMenu) return
  data.isMouseInUserArea = true;
  data.isUserInfoMenuAnimating = true;

  userInfoMenuBox.value.style.height = 'auto';
  const { height } = userInfoMenuBox.value.getBoundingClientRect();
  userInfoMenuBox.value.style.height = '0';
  void userInfoMenuBox.value.offsetHeight;
  requestAnimationFrame(() => {
    userInfoMenuBox.value.style.height = height + 'px';
    setTimeout(() => {
      data.isUserInfoMenuAnimating = false;
    }, 300);
  })
}

const onMouseLeaveUserBox = () => {
  if (data.isUserInfoMenuAnimating || data.expandedUserInfoMenu) return
  data.isMouseInUserArea = false;
  setTimeout(() => {
    if (!data.isMouseInUserArea) {
      data.isUserInfoMenuAnimating = true;
      requestAnimationFrame(() => {
        userInfoMenuBox.value.style.height = '0';
        setTimeout(() => {
          data.isUserInfoMenuAnimating = false;
        }, 300);
      })
    }
  }, 50);
}

const onMouseEnterMenu = () => {
  if (data.expandedUserInfoMenu) return;
  data.isMouseInUserArea = true;
}

const onMouseLeaveMenu = () => {
  if (data.expandedUserInfoMenu) return;
  data.isMouseInUserArea = false;

  // 鼠标离开菜单后关闭
  if (!data.isUserInfoMenuAnimating) {
    data.isUserInfoMenuAnimating = true;
    requestAnimationFrame(() => {
      userInfoMenuBox.value.style.height = '0';
      setTimeout(() => {
        data.isUserInfoMenuAnimating = false;
      }, 300);
    })
  }
}

const toggleUserInfoMenu = () => {
  data.expandedUserInfoMenu = !data.expandedUserInfoMenu;
  userInfoMenuBox.value.style.height = 'auto';
  headerContainer.value.style.height = 'auto';
  const headerContainerRect = headerContainer.value.getBoundingClientRect();
  const userInfoMenuBoxRect = userInfoMenuBox.value.getBoundingClientRect();
  const height = Math.max(userInfoMenuBoxRect.height, headerContainerRect.height);
  if (data.expandedUserInfoMenu) {
    headerContainer.value.style.height = '64px';
    userInfoMenuBox.value.style.height = '0';
    requestAnimationFrame(() => {
      headerContainer.value.style.height = height + 'px';
      userInfoMenuBox.value.style.height = userInfoMenuBoxRect.height + 'px';
    })
  } else {
    headerContainer.value.style.height = height + 'px';
    userInfoMenuBox.value.style.height = userInfoMenuBoxRect.height + 'px';
    requestAnimationFrame(() => {
      headerContainer.value.style.height = '64px';
      userInfoMenuBox.value.style.height = '0';
    })
  }
}
</script>

<template>
  <header class="header-container" ref="headerContainer">
    <div class="header-box expanded-user-info-menu">
      <div class="header-box-inner">
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
        <div class="user-box" @mouseenter="onMouseEnterUserBox" @mouseleave="onMouseLeaveUserBox">
          <div class="search-form">
          </div>
          <div class="user-info">
            <div class="user-info-inner">
              <img src="/images/avatar.png" class="user-basic" alt="AVATAR">
              <span class="user-basic">测试用户</span>
              <i class="i-mdi:keyboard-arrow-down user-arrow user-basic"></i>
              <i class="i-mdi:menu mobile-menu-icon" @click="toggleUserInfoMenu"></i>
            </div>
          </div>
        </div>
      </div>
      <div class="user-info-menu-box" ref="userInfoMenuBox"
           @mouseenter="onMouseEnterMenu"
           @mouseleave="onMouseLeaveMenu">
        <ul class="user-info-menu">
          <li class="user-info-menu-item">
            <a href="/user/profile" class="user-info-menu-item-link">
              <i class="i-mdi:user"></i>
              <span>个人中心</span>
            </a>
          </li>
          <li class="user-info-menu-item">
            <a href="/user/my-questions" class="user-info-menu-item-link">
              <i class="i-mdi:book-open"></i>
              <span>我的题库</span>
            </a>
          </li>
          <li class="user-info-menu-item">
            <a href="/user/error-book" class="user-info-menu-item-link">
              <i class="i-mdi:alert-circle"></i>
              <span>错题本</span>
            </a>
          </li>
          <li class="user-info-menu-item">
            <a href="/user/" class="user-info-menu-item-link">
              <i class="i-mdi:history"></i>
              <span>练习记录</span>
            </a>
          </li>
          <li class="segmentation user-info-menu-item"></li>
          <li class="user-info-menu-item">
            <a href="/user/logout" class="user-info-menu-item-link">
              <i class="i-mdi:logout"></i>
              <span>退出登录</span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </header>
  <main>
    <router-view></router-view>
  </main>
</template>

<style lang="scss">
@use "@/assets/scss/layout/defaultLayout";
</style>
