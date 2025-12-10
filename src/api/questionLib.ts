import http from '@/util/http.ts'
import type { UploadFile } from 'ant-design-vue'

/**
 * 获取所有题库，
 */
export const getQuestionLibs = (size: number = 10) => {
  return http.get("/sys/question/category/search", {
    params: {
      page: 1,
      pageSize: size
    }
  })
}

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

/**
 * 获取题库题目
 * @param categoryId 题库ID
 * @param difficulty 难度
 * @param type 题目类型
 * @param size 数量
 */
export const filterQuestions = (
  categoryId: number,
  difficulty?: number | null,
  type?: number | null,
  size?: number | null,
) => {
  return http.get('/sys/question/category/relation/searchByQuestion', {
    params: {
      categoryId,
      difficulty: difficulty ?? null,
      type: type ?? null,
      size: size ?? null,
    }
  })
}


/**
 * 验证题目
 * @param questionId 题目ID
 * @param answer 答案
 */
export const validateQuestion = (questionId: number, answer: number | string | string[] | Array<number>) => {
  return http.post("/sys/question/validate", {
    questionId,
    answer
  })
}
