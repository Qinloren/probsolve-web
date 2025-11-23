import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { UserType } from '@/types/user.type.ts'
import { userVerify } from '@/api/user.ts'

export const useUserStore = defineStore('user', () => {
  const userToken = ref<string>()
  const userInfo = ref<UserType>()
  const logined = ref<boolean>()

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

  const setLoginStatus = (status: boolean) => {
    logined.value = status
  }

  const isLogin = () => {
    return logined.value === undefined ? false : logined.value
  }

  const checkLoginToken = async () => {
    const response = await userVerify()
    if (response.data.code !== 0 && !response.data.data) {
      logout();
      return false;
    }
    return true;
  }

  const logout = () => {
    userToken.value = '';
    userInfo.value = {} as UserType;
    logined.value = false;
  }

  return {
    logined,
    userInfo,
    userToken,
    getToken,
    getInfo,
    setToken,
    setInfo,
    setLoginStatus,
    isLogin,
    logout,
    checkLoginToken
  }
}, {
  persist: true
})
