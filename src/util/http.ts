import axios from 'axios'
import { useUserStore } from '@/stores/user.ts'

const instance = axios.create({
  timeout: 100000,
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
})

instance.interceptors.request.use(
  (config) => {
    const userStore = useUserStore();
    if (userStore.getToken()) {
      config.headers.Authorization = userStore.getToken();
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

instance.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default instance;
