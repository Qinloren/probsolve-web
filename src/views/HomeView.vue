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
    <section class="card-box"></section>
    <section class="card-box"></section>
    <section class="card-box"></section>
    <section class="card-box"></section>
    <section class="card-box"></section>
  </div>
</template>

<style lang="scss">
@use "@/assets/scss/views/home";
</style>
