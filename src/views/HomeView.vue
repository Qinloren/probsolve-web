<script setup lang="ts">

import { reactive } from 'vue'

const data = reactive({
  homeCover: 'https://picsum.photos/id/3/600/400'
})
</script>

<template>
  <div class="home-container">
    <section class="card-box first-card">
      <div>
        <div>
          <h1>高效刷题，<br />轻松掌握知识点</h1>
          <p>海量题库·智能练习·详细解析·模拟考试<br />一站式提升你的知识掌握能力</p>
          <div>
            <button>
              开始练习
              <i class="i-mdi:arrow-right-thick"></i>
            </button>
            <button>
              了解更多
              <i class="i-mdi:information-slab-circle"></i>
            </button>
          </div>
        </div>
        <div>
          <img :src="data.homeCover" alt="COVER">
        </div>
      </div>
    </section>
    <section class="card-box second-card">
      <div>
        <div>
          <h1>为什么选择我们？</h1>
          <p>全方位刷题体验，让学习更高效</p>
        </div>
        <div>
          <div class="select-card">
            <div class="select-card-icon">
              <i class="i-mdi:database"></i>
            </div>
            <h3 class="select-card-title">海量题库</h3>
            <p class="select-card-desc">覆盖各学科知识点，包含基础题、进阶题和真题，支持用户分享题库</p>
          </div>
          <div class="select-card">
            <div class="select-card-icon">
              <i class="i-mdi:clock-outline"></i>
            </div>
            <h3 class="select-card-title">模拟考试</h3>
            <p class="select-card-desc">真实还原考试场景，计时答题，自动判分，帮助你适应考试节奏</p>
          </div>
          <div class="select-card">
            <div class="select-card-icon">
              <i class="i-mdi:chart-bell-curve-cumulative"></i>
            </div>
            <h3 class="select-card-title">学习分析</h3>
            <p class="select-card-desc">记录答题数据，生产学习报告，精准定位薄弱环节，针对性提升</p>
          </div>
        </div>
      </div>
    </section>
<!--    <section class="card-box"></section>-->
  </div>
</template>

<style lang="scss">
@use "@/assets/scss/views/home";
</style>
