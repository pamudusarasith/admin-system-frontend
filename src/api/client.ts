import axios from 'axios'
import { router } from '@/main.tsx'

export const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

client.defaults.withCredentials = true

client.interceptors.request.use(
  (config) => {
    const access_token = localStorage.getItem('access_token')
    if (access_token) {
      config.headers['Authorization'] = `Bearer ${access_token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

client.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('access_token')
      router.navigate({ to: '/401' })
    } else if (error.response && error.response.status === 403) {
      localStorage.removeItem('access_token')
      router.navigate({ to: '/403' })
    } else if (error.response && error.response.status === 404) {
      router.navigate({ to: '/404' })
    } else if (error.response && error.response.status === 500) {
      router.navigate({ to: '/500' })
    } else {
      console.error('An unexpected error occurred:', error)
    }
    return Promise.reject(error)
  },
)
