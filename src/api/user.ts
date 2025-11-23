import http from '@/util/http.ts'

/**
 * 用户登录
 * @param username 用户名
 * @param email 邮箱地址
 * @param password 密码
 * @param remember 是否持久化
 */
export const userLogin = (
  username: string | null,
  email: string | null,
  password: string,
  remember: boolean
) => {
  if (username === email) {
    return Promise.reject('用户名与邮箱不能同时为空')
  }

  return http.post('/sys/user/login', {
    username,
    email,
    password,
    persistent: remember
  })
}

/**
 * 用户注册
 * @param username 用户名
 * @param email 邮箱地址
 * @param avatar 头像
 * @param password
 */
export const userRegister = (
  username: string | null,
  email: string | null,
  avatar: string | null,
  password: string
) => {
  return http.post('/sys/user/register', {
    username,
    email,
    avatar,
    password
  })
}

/**
 * 验证用户登录状态是否过期
 */
export const userVerify = () => {
  return http.get('/sys/user/validate')
}
