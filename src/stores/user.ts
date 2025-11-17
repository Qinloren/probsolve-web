import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { UserType } from '@/types/user.type.ts'

export const useUserStore = defineStore('user', () => {
  const userToken = ref<string>('')
  const userInfo = ref<UserType>()

  const setToken = (token: string) => {
    userToken.value = token
  }

  const setInfo = (info: UserType) => {
    userInfo.value = info
  }

  const getToken = () => {
    return userToken.value
  }

  const getInfo = () => {
    return userInfo.value
  }

  return {
    getToken,
    getInfo,
    setToken,
    setInfo
  }
}, {
  persist: true
})
