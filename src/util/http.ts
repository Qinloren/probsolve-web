import axios from 'axios'

const instance = axios.create({
  timeout: 100000,
  baseURL: '/',
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
})

instance.interceptors.request.use(
  (config) => {
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
