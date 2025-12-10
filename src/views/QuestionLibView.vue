<script setup lang="ts">

import { onMounted, reactive } from 'vue'
import {
  deriveQuestionLib,
  getUserQuestionLibs,
  importQuestionLib,
  searchQuestionLibs
} from '@/api/questionLib.ts'
import type { QuestionLibType } from '@/types/questions.type.ts'
import { formatTime } from '@/util/format.ts'
import { useUserStore } from '@/stores/user.ts'
import { message, type UploadProps } from 'ant-design-vue'
import router from "@/router";

const data = reactive({
  searchValue: '',
  isShowImportModel: false,
  uploadFiles: [] as UploadProps['fileList'],
  questions: [] as QuestionLibType[],
})

const submitSearch = async () => {
  const response = await searchQuestionLibs(data.searchValue)
  data.questions = response.data.data.content
}

const userStore = useUserStore()
onMounted(async () => {
  const userId = userStore.getInfo()?.id
  if (userId) {
    const response = await getUserQuestionLibs(userId)
    data.questions = response.data.data.content
  }
})

const onClickDeriveQuestionLib = (id: number) => {
  deriveQuestionLib(id)
    .then((response) => {
      if (!response) return
      const link = document.createElement('a')
      link.href = window.URL.createObjectURL(new Blob([response.data]))
      link.target = "_blank";
      link.download = decodeURI(response.headers['content-disposition'].replace("attachment:filename=", ""))
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link);
    })
}

const showImportModel = () => {
  data.isShowImportModel = true;
}

const beforeUpload: UploadProps['beforeUpload'] = (file) => {
  data.uploadFiles = [...(data.uploadFiles || []), file]
  return false
}

const onClickImportQuestionLib = async () => {
  if (data.uploadFiles) {
    const uploadFile = data.uploadFiles[0]
    if (uploadFile && uploadFile.originFileObj) {
      const response = await importQuestionLib(uploadFile.originFileObj, "pb");
      if (response.status !== 200) {
        message.error('系统异常，请联系管理员！')
      }
      if (response.data.code !== 0) {
        message.error(response.data.message)
      }
    }
  }
}

const startPractise = (id: number) => {
  router.push({
    name: 'practise',
    query: {
      id
    }
  })
}

const downloadExampleQuestionLibFile = () => {
  const a = document.createElement("a");
  a.href="/example/libs/default.pb";
  a.download = "example.pb";
  a.style.display = "none"
  document.body.appendChild(a);
  a.click();
  a.remove();
}
</script>

<template>
  <div class="question-lib-container">
    <div class="question-lib-container-inner">
      <div class="question-lib-title">
        <h1 class="question-lib-title-text">我的题库</h1>
        <p class="question-lib-title-desc">管理你创建和导入的专属题库</p>
      </div>
      <div class="question-lib-operations">
        <div class="question-lib-operation-group">
          <button class="question-lib-create-btn">
            <i class="i-mdi:plus"></i>
            新建题库
          </button>
          <button class="question-lib-import-btn" @click="showImportModel">
            <i class="i-mdi:tray-upload"></i>
            导入题库
          </button>
          <button class="question-lib-import-btn" @click="downloadExampleQuestionLibFile">
            <i class="i-mdi:download"></i>
            下载示例题库
          </button>
          <a-modal class="question-lib-import" v-model:open="data.isShowImportModel" title="导入题库" @ok="onClickImportQuestionLib">
            <a-upload-dragger v-model:fileList="data.uploadFiles" name="importFile" accept=".pb" :multiple="false" :beforeUpload="beforeUpload">
              <div class="upload-drag-icon">
                <i class="i-mdi:inbox"></i>
              </div>
              <p>点击或拖拽文件到此区域进行上传</p>
              <p>不支持多文件上传, 仅支持专属格式, 请勿上传其他文件</p>
            </a-upload-dragger>
          </a-modal>
        </div>
        <div class="question-lib-operations-search">
          <a-form @submit="submitSearch">
            <a-input v-model:value="data.searchValue" placeholder="请输入关键字..." class="search-input">
              <template #prefix>
                <i class="i-mdi:search"></i>
              </template>
            </a-input>
          </a-form>
        </div>
      </div>
      <div class="question-lib-list" v-if="data.questions.length > 0">
        <div class="question-lib-item" v-for="(item, index) in data.questions" :key="index">
          <div class="question-lib-header">
            <h3 class="question-lib-header-header-title">{{ item.name }}</h3>
            <div class="question-lib-header-header-action">
            <a-dropdown>
                <div class="i-mdi:more-horiz"></div>
              <template #overlay>
                <a-menu>
                  <a-menu-item v-if="false">
                    <span>编辑题库</span>
                  </a-menu-item>
                  <a-menu-item @click="onClickDeriveQuestionLib(item.id)">
                    <span>导出题库</span>
                  </a-menu-item>
                  <a-menu-item v-if="false">
                    <span>分享题库</span>
                  </a-menu-item>
                  <a-menu-divider v-if="false" />
                  <a-menu-item v-if="false">
                    <span style="color: red;">删除题库</span>
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </div>
          </div>
          <p class="question-lib-signature">
            {{ item.signature }}
          </p>
          <div class="question-lib-info">
            <div class="question-lib-info-item">
              <i class="i-mdi:question-mark-circle"></i>
              <span>{{ item.size }}题</span>
            </div>
            <div class="question-lib-info-item">
              <i class="i-mdi:date-range"></i>
              <span>更新于 {{ formatTime(item.updateTime) }}</span>
            </div>
            <div class="question-lib-info-item">
              <i class="i-mdi:lock"></i>
              <span>{{ item.views === 0 ? '私有' : '公开'}}</span>
            </div>
          </div>
          <div class="question-lib-footer">
            <div class="question-lib-edit">
              <i class="i-mdi:circle-edit-outline"></i>
              <span>编辑题目</span>
            </div>
            <div class="question-lib-start" @click="startPractise(item.id)">开始练习</div>
          </div>
        </div>
      </div>
      <a-empty v-else/>
    </div>
  </div>
</template>

<style lang="scss">
@use "@/assets/scss/views/questionLib";
</style>
