<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useUserStore } from '@/stores/user.ts'
import router from '@/router'

const data = reactive({
  expandedUserInfoMenu: false,
  isUserInfoMenuAnimating: false,
  isMouseInUserArea: false
})
const userStore = useUserStore()
const userInfoMenuBox = ref();
const headerContainer = ref();

const onMouseEnterUserBox = () => {
  if (!userStore.isLogin()) return
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
  if (!userStore.isLogin()) return
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

const hardCloseUserInfoMenu = () => {
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
  if (!userStore.isLogin()) return
  if (data.expandedUserInfoMenu) return;
  data.isMouseInUserArea = true;
}

const onMouseLeaveMenu = () => {
  if (!userStore.isLogin()) return
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
  if (!userStore.isLogin()) return
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

const onLogout = () => {
  userStore.logout();
  hardCloseUserInfoMenu();
  router.push({
    name: 'user-login'
  })
}
</script>

<template>
  <div class="root-container">
    <header class="header-container" ref="headerContainer">
      <div class="header-box expanded-user-info-menu">
        <div class="header-box-inner">
          <div class="logo-box">
            <img src="/images/favicon.png" alt="刷题鸡" />
            <h2>刷题鸡</h2>
          </div>
          <div class="menu-box">
            <ul class="menu">
              <li class="menu-item">
                <router-link to="/">首页</router-link>
              </li>
              <li class="menu-item">
                <router-link to="/">题库</router-link>
              </li>
              <li class="menu-item">
                <router-link to="/">练习</router-link>
              </li>
              <li class="menu-item">
                <router-link to="/">模拟考试</router-link>
              </li>
            </ul>
          </div>
          <div class="user-box" @mouseenter="onMouseEnterUserBox" @mouseleave="onMouseLeaveUserBox">
            <div class="search-form">
            </div>
            <div class="user-info">
              <div class="user-info-inner" v-if="userStore.isLogin()">
                <img :src="userStore.getInfo()?.avatar ?? '/images/avatar.png'" class="user-basic" alt="AVATAR">
                <span class="user-basic">{{ userStore.getInfo()?.username }}</span>
                <i class="i-mdi:keyboard-arrow-down user-arrow user-basic"></i>
                <i class="i-mdi:menu mobile-menu-icon" @click="toggleUserInfoMenu"></i>
              </div>
              <div class="user-login-btn-group" v-else>
                <router-link to="/user/login">登录</router-link> |
                <router-link to="/user/register">注册</router-link>
              </div>
            </div>
          </div>
        </div>
        <div class="user-info-menu-box" ref="userInfoMenuBox"
             @mouseenter="onMouseEnterMenu"
             @mouseleave="onMouseLeaveMenu">
          <ul class="user-info-menu">
            <li class="user-info-menu-item">
              <router-link to="/user/profile" class="user-info-menu-item-link">
                <i class="i-mdi:user"></i>
                <span>个人中心</span>
              </router-link>
            </li>
            <li class="user-info-menu-item">
              <router-link to="/user/question/lib" class="user-info-menu-item-link">
                <i class="i-mdi:book-open"></i>
                <span>我的题库</span>
              </router-link>
            </li>
            <li class="user-info-menu-item">
              <router-link to="/" class="user-info-menu-item-link">
                <i class="i-mdi:alert-circle"></i>
                <span>错题本</span>
              </router-link>
            </li>
            <li class="user-info-menu-item">
              <router-link to="/" class="user-info-menu-item-link">
                <i class="i-mdi:history"></i>
                <span>练习记录</span>
              </router-link>
            </li>
            <li class="segmentation user-info-menu-item"></li>
            <li class="user-info-menu-item">
              <a href="#" class="user-info-menu-item-link" @click.stop.prevent="onLogout">
                <i class="i-mdi:logout"></i>
                <span>退出登录</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </header>
    <main class="main-container">
      <router-view v-slot="{ Component }">
        <transition name="slide" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
  </div>
</template>

<style lang="scss">
@use "@/assets/scss/layout/defaultLayout";
</style>
