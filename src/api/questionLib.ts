import http from '@/util/http.ts'
import type { UploadFile } from 'ant-design-vue'

export const searchQuestionLibs = (name: string) => {
  return http.get("/sys/question/category/search", {
    params: {
      name,
      page: 1,
      pageSize: 10
    }
  })
}

/**
 * 获取用户题库
 * @param userId 用户ID
 */
export const getUserQuestionLibs = (userId: number) => {
  return http.get("/sys/question/category/search", {
    params: {
      userId,
      page: 1,
      pageSize: 10
    }
  })
}

/**
 * 导出题库
 * @param id 题库ID
 */
export const deriveQuestionLib = (id: number) => {
  return http.post("/sys/attachment/upload/question/derive", {
    id
  }, {
    responseType: 'blob'
  })
}

/**
 * 导入题库
 * @param file 文件
 * @param type 解析格式
 */
export const importQuestionLib = (file: UploadFile, type: string) => {
  return http.post("/sys/attachment/upload/question", {
    type,
    file
  }, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
