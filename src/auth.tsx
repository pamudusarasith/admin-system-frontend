import React, { createContext, useContext, useEffect, useState } from 'react'
import { jwtDecode } from 'jwt-decode'
import {
  login as apiLogin,
  logout as apiLogout,
  refreshToken as apiRefreshToken,
} from '@/api'

interface User {
  id: number
  username: string
  full_name: string
  authorities: Array<string>
  exp?: number // Token expiration time
}

export interface AuthState {
  isAuthenticated: boolean
  user: User | null
  isLoading: boolean
  error: string | null
  hasAuthority: (authority: string) => boolean
  hasAnyAuthority: (authorities: Array<string>) => boolean
  login: (username: string, password: string) => Promise<void>
  refresh: () => Promise<boolean>
  logout: () => Promise<void>
  clearError: () => void
}

interface TokenPayload {
  sub: string
  full_name: string
  exp: number
  user_id: number
  iat: number
  scope: string
}

const AuthContext = createContext<AuthState | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const parseTokenFromStorage = (): User | null => {
    const token = localStorage.getItem('access_token')
    if (!token) return null

    try {
      const decoded = jwtDecode<TokenPayload>(token)
      const currentTime = Date.now() / 1000

      // Check if token is expired
      if (decoded.exp < currentTime) {
        localStorage.removeItem('access_token')
        return null
      }

      // Parse authorities from scope
      const authorities = decoded.scope ? decoded.scope.split(' ') : []

      return {
        id: decoded.user_id,
        username: decoded.sub,
        full_name: decoded.full_name,
        authorities,
        exp: decoded.exp,
      }
    } catch {
      localStorage.removeItem('access_token')
      return null
    }
  }

  // Update auth state from localStorage
  const updateAuthState = () => {
    const userData = parseTokenFromStorage()

    if (userData) {
      setUser(userData)
      setError(null) // Clear errors on successful auth
    } else {
      setUser(null)
    }
  }

  const login = async (username: string, password: string): Promise<void> => {
    setError(null)
    setIsLoading(true)

    try {
      const { access_token } = await apiLogin(username, password)
      localStorage.setItem('access_token', access_token)
      updateAuthState()
      setIsLoading(false)
    } catch (loginError) {
      const errorMessage =
        loginError instanceof Error
          ? loginError.message
          : 'Authentication failed'
      setError(errorMessage)
      setIsLoading(false)
      throw new Error(errorMessage)
    }
  }

  // Check if user has specific authority
  const hasAuthority = (authority: string): boolean => {
    return user?.authorities.includes(authority) ?? false
  }

  // Check if user has any of the specified authorities
  const hasAnyAuthority = (authorities: Array<string>): boolean => {
    return authorities.some((authority) =>
      user?.authorities.includes(authority),
    )
  }

  // Simplified logout
  const logout = async () => {
    try {
      await apiLogout()
    } catch (logoutError) {
      console.error('Logout API call failed:', logoutError)
      // Don't rethrow - we want to clear local auth even if API fails
    } finally {
      // Always clear local auth state
      localStorage.removeItem('access_token')
      updateAuthState()
    }
  }

  const refresh = async (): Promise<boolean> => {
    try {
      const { access_token } = await apiRefreshToken()
      localStorage.setItem('access_token', access_token)
      updateAuthState()
      return true
    } catch (refreshError) {
      console.error('Token refresh failed:', refreshError)
      localStorage.removeItem('access_token')
      updateAuthState()
      return false
    }
  }

  // Clear error state
  const clearError = () => {
    setError(null)
  }

  // Initialize auth and setup storage listeners
  useEffect(() => {
    const initializeAuth = () => {
      const userData = parseTokenFromStorage()

      // Update all states in one batch
      if (userData) {
        setUser(userData)
        setError(null)
      } else {
        setUser(null)
      }
      // Always set loading to false after checking auth
      setIsLoading(false)
    }

    initializeAuth()

    // Listen for storage changes from other tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'access_token') {
        const userData = parseTokenFromStorage()
        setUser(userData)
        if (userData) {
          setError(null)
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, []) // Remove dependency on updateAuthState

  // Auto-refresh token before expiration
  useEffect(() => {
    // Don't set up refresh if we're still loading or don't have a user
    if (isLoading || !user?.exp) {
      return
    }

    const tokenExp = user.exp * 1000 // Convert to milliseconds
    const currentTime = Date.now()
    const timeUntilExpiry = tokenExp - currentTime

    // Refresh 5 minutes before expiry, but ensure at least 1 minute minimum
    const refreshTime = Math.max(timeUntilExpiry - 5 * 60 * 1000, 60 * 1000)

    if (refreshTime > 0 && timeUntilExpiry > 60 * 1000) {
      const timer = setTimeout(() => {
        refresh().catch((refreshError) => {
          console.error('Auto-refresh failed:', refreshError)
          // Don't logout automatically on refresh failure
          // Let the axios interceptor handle 401s
        })
      }, refreshTime)

      return () => clearTimeout(timer)
    } else if (timeUntilExpiry <= 60 * 1000) {
      // Token expires within 1 minute, try immediate refresh
      refresh().catch((refreshError) => {
        console.error('Immediate refresh failed:', refreshError)
      })
    }
  }, [user?.exp, isLoading])

  const value: AuthState = {
    isAuthenticated: user !== null,
    user,
    isLoading,
    error,
    hasAuthority,
    hasAnyAuthority,
    login,
    refresh,
    logout,
    clearError,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
