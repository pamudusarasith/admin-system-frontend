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

// Track if we're currently refreshing to avoid multiple simultaneous refreshes
let isRefreshing = false
let failedQueue: Array<{
  resolve: (value?: unknown) => void
  reject: (error?: unknown) => void
}> = []

const processQueue = (error: unknown, token?: string) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error)
    } else {
      resolve(token)
    }
  })

  failedQueue = []
}

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
  async (error) => {
    const originalRequest = error.config

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then(() => {
            originalRequest.headers['Authorization'] =
              `Bearer ${localStorage.getItem('access_token')}`
            return client(originalRequest)
          })
          .catch((err) => {
            return Promise.reject(err)
          })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        // Import refresh token function dynamically to avoid circular dependency
        const { refreshToken } = await import('./auth')
        const response = await refreshToken()
        const { access_token } = response

        localStorage.setItem('access_token', access_token)
        originalRequest.headers['Authorization'] = `Bearer ${access_token}`

        processQueue(null, access_token)
        return client(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError, undefined)
        localStorage.removeItem('access_token')
        // Use navigate without router context for safety
        window.location.href = '/login'
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    // Handle other errors
    if (error.response && error.response.status === 403) {
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
