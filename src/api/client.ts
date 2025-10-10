import axios from 'axios'
import axiosRetry from 'axios-retry'
import type { AxiosError } from 'axios'
import { router } from '@/main.tsx'

export interface ErrorInfo {
  message: string
  field?: string
}

export interface Pagination {
  page: number
  pageSize: number
  totalPages: number
}

export interface ApiResponse<T> {
  message?: string
  data?: T
  pagination?: Pagination
  errors?: Array<ErrorInfo>
}

export const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

client.defaults.withCredentials = true

// Track if we're currently refreshing to avoid multiple simultaneous refreshes
let isRefreshing = false

axiosRetry(client, {
  retries: 3,
  retryCondition: (error) => {
    return error.response?.status === 401
  },
  onRetry: async () => {
    if (!isRefreshing) {
      isRefreshing = true
      try {
        const { refreshToken } = await import('./auth')
        const response = await refreshToken()
        const { access_token } = response

        localStorage.setItem('access_token', access_token)
        window.dispatchEvent(new Event('AccessTokenChange'))
      } catch {
        localStorage.removeItem('access_token')
        window.dispatchEvent(new Event('AccessTokenChange'))
      } finally {
        isRefreshing = false
      }
    }
  },
})

client.interceptors.request.use(
  (config) => {
    const access_token = localStorage.getItem('access_token')
    if (access_token) {
      config.headers['Authorization'] = `Bearer ${access_token}`
    }
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  },
)

client.interceptors.response.use(
  (response) => {
    return response
  },
  async (error: AxiosError) => {
    if (error.response?.status === 403) {
      router.navigate({ to: '/403' })
    } else if (error.response?.status === 404) {
      router.navigate({ to: '/404' })
    } else if (error.response?.status === 500) {
      router.navigate({ to: '/500' })
    } else {
      console.error('An unexpected error occurred:', error)
    }
    return Promise.reject(error)
  },
)

export const unauthenticatedClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

unauthenticatedClient.defaults.withCredentials = true
