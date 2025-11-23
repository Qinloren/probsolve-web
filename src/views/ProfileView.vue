<script setup lang="ts">
import { useUserStore } from '@/stores/user.ts'
import { onBeforeUnmount, onMounted, reactive, ref } from 'vue'

import * as echarts from 'echarts'
import type { ECharts } from 'echarts'

const userStore = useUserStore();

const data = reactive({
  chartsOptions: {
    xAxis: {
      data: [
        '周一',
        '周二',
        '周三',
        '周四',
        '周五',
        '周六',
        '周日',
      ]
    },
    yAxis: {},
    legend: {
      orient: 'horizontal',
      left: 'center',
      top: 0,
      data: [
        '答题数',
        '考试数'
      ],
      selected: {
        '答题数': true,
        '考试数': true
      }
    },
    series: [
      {
        name: '答题数',
        data: [10,22,28,43,100],
        type: 'line',
        stack: 'x'
      },
      {
        name: '考试数',
        data: [5,4,3,5,10],
        type: 'line',
        stack: 'x'
      }
    ]
  },
  records: {
    columns: [
      {
        title: '类型',
        dataIndex: 't',
        key: 't'
      },
      {
        title: '题库名称',
        dataIndex: 'ln',
        key: 'ln'
      },
      {
        title: '答题数',
        dataIndex: 'aqs',
        key: 'aqs'
      },
      {
        title: '总题数',
        dataIndex: 'tqs',
        key: 'tqs'
      },
      {
        title: '正确率',
        dataIndex: 'acy',
        key: 'acy'
      },
      {
        title: '时间',
        dataIndex: 'ts',
        key: 'ts'
      },
    ]
  }
})

const chartRef = ref(null);
let chartInstance: ECharts | null = null;

const initCharts = () => {
  chartInstance = echarts.init(chartRef.value, 'light');
  chartInstance.setOption(data.chartsOptions);
}

const disposeChart = () => {
  if (chartInstance) {
    chartInstance.dispose();
    chartInstance = null;
  }
}
onMounted(() => {
  initCharts()
  window.addEventListener('resize', () => {
    chartInstance?.resize();
  })
})
onBeforeUnmount(disposeChart)
</script>

<template>
  <div class="profile-container">
    <div class="profile-container-inner">
      <div class="profile-title">
        <h1 class="profile-title-text">个人中心</h1>
        <p class="profile-title-desc">追踪学习进度，管理学习资源</p>
      </div>
      <div class="profile-content">
        <div class="profile-content-side">
          <div class="profile-content-side-inner">
            <div class="user-card">
              <a-tooltip>
                <template #title>
                  点击修改头像
                </template>
                <div class="user-card-avatar">
                  <img :src="userStore.getInfo()?.avatar ?? '/images/avatar.jpg'" alt="">
                </div>
              </a-tooltip>
              <div class="user-card-info">
                <h3 class="user-card-info-name">{{ userStore.getInfo()?.username }}</h3>
                <p class="user-card-info-desc">{{ userStore.getInfo()?.email }}</p>
              </div>
              <div class="user-card-level">
                <div class="user-card-level-text">
                  <span>等级 {{ userStore.getInfo()?.level }}</span>
                  <span>10%</span>
                </div>
                <div class="user-card-info-process">
                  <a-progress :percent="10" :show-info="false"/>
                </div>
              </div>
            </div>
            <a-divider />
            <ul class="user-profile-menu">
              <li class="user-profile-menu-item">
                <router-link to="/user/profile" class="user-profile-menu-link">
                  <i class="i-mdi:user-box"></i>
                  <span>个人资料</span>
                </router-link>
              </li>
              <li class="user-profile-menu-item">
                <a href="#" class="user-profile-menu-link">
                  <i class="i-mdi:chart-bar"></i>
                  <span>学习数据</span>
                </a>
              </li>
              <li class="user-profile-menu-item">
                <a href="#" class="user-profile-menu-link">
                  <i class="i-mdi:history"></i>
                  <span>练习记录</span>
                </a>
              </li>
              <li class="user-profile-menu-item">
                <a href="#" class="user-profile-menu-link">
                  <i class="i-mdi:alert-circle"></i>
                  <span>错题本</span>
                </a>
              </li>
              <li class="user-profile-menu-item">
                <router-link to="/user/question/lib" class="user-profile-menu-link">
                  <i class="i-mdi:book-open-variant"></i>
                  <span>我的题库</span>
                </router-link>
              </li>
              <li class="user-profile-menu-item">
                <a href="#" class="user-profile-menu-link">
                  <i class="i-mdi:settings"></i>
                  <span>账号设置</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div class="profile-content-main">
          <div class="profile-content-main-item overview-card">
            <div class="overview-card-item total-attempts-card">
              <div class="overview-card-item-inner">
                <div class="overview-card-item-text">
                  <div class="overview-card-item-text-title">总答题数</div>
                  <div class="overview-card-item-text-size">{{ userStore.getInfo()?.totalAttempts }}</div>
                  <div class="overview-card-item-text-title">从未答题</div>
                </div>
                <div class="overview-card-item-icon">
                  <i class="i-mdi:question-mark-circle"></i>
                </div>
              </div>
            </div>
            <div class="overview-card-item total-exams-card">
              <div class="overview-card-item-inner">
                <div class="overview-card-item-text">
                  <div class="overview-card-item-text-title">总考试数</div>
                  <div class="overview-card-item-text-size">{{ userStore.getInfo()?.totalExams }}</div>
                  <div class="overview-card-item-text-title">从未考试</div>
                </div>
                <div class="overview-card-item-icon">
                  <i class="i-mdi:question-mark-circle"></i>
                </div>
              </div>
            </div>
            <div class="overview-card-item correct-rate-card">
              <div class="overview-card-item-inner">
                <div class="overview-card-item-text">
                  <div class="overview-card-item-text-title">正确率</div>
                  <div class="overview-card-item-text-size">{{ userStore.getInfo()?.correctRate }}</div>
                  <div class="overview-card-item-text-title">未统计</div>
                </div>
                <div class="overview-card-item-icon">
                  <i class="i-mdi:question-mark-circle"></i>
                </div>
              </div>
            </div>
          </div>
          <div class="profile-content-main-item tendency-card">
            <div class="tendency-card-header">
              <h3>学习趋势</h3>
              <div class="tendency-card-views-types">
                <button class="active">周</button>
                <button>月</button>
                <button>年</button>
              </div>
            </div>
            <div class="tendency-card-mainer">
              <div class="charts-content" ref="chartRef" style="width:100%;height: 500px;min-height: 300px;"></div>
            </div>
          </div>
          <div class="profile-content-main-item grasp-card" v-if="false"></div>
          <div class="profile-content-main-item record-card" v-if="false">
            <div class="record-card-header">
              <h3>最近学习记录</h3>
              <a class="record-card-view-all">
                <span>查看全部</span>
              </a>
            </div>
            <div class="record-card-mainer">
              <a-table :columns="data.records.columns"/>
            </div>
          </div>
          <div class="profile-content-main-item error-card" v-if="false"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@use '@/assets/scss/views/profile';
</style>
