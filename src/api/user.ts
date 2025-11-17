import http from '@/util/http.ts'

/**
 * 用户登录
 * @param username 用户名
 * @param email 邮箱地址
 * @param password 密码
 * @param persistent 是否持久化
 */
export const userLogin = (
  username: string | null,
  email: string | null,
  password: string,
  persistent: boolean
) => {
  if (username === email) {
    return Promise.reject('用户名与邮箱不能同时为空')
  }

  return http.post('/sys/user/login', {
    username,
    email,
    password,
    persistent
  })
}
