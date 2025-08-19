import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import { jwtDecode } from 'jwt-decode'
import { login as apiLogin } from '@/api'

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
  loginWithToken: (access_token: string) => boolean
  logout: () => void
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
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Check if token is expired
  const isTokenExpired = useCallback((token: string): boolean => {
    try {
      const decoded = jwtDecode<TokenPayload>(token)
      const currentTime = Date.now() / 1000
      return decoded.exp < currentTime
    } catch {
      return true
    }
  }, [])

  // Validate and parse token
  const parseToken = useCallback(
    (token: string): User | null => {
      try {
        if (isTokenExpired(token)) {
          return null
        }

        const decoded = jwtDecode<TokenPayload>(token)

        // Extract authorities from token
        let authorities: Array<string> = []

        // Parse scope field which contains space-separated authorities
        if (decoded.scope) {
          const scopeItems = decoded.scope.split(' ')

          // In your JWT, everything in scope appears to be authorities
          // You can categorize them or use them all as authorities
          authorities = scopeItems

          // If you want to extract roles from scope (e.g., items that start with 'role:')
          // roles = scopeItems.filter(s => s.startsWith('role:')).map(s => s.replace('role:', ''))
        }

        return {
          id: decoded.user_id,
          username: decoded.sub,
          full_name: decoded.full_name,
          authorities,
          exp: decoded.exp,
        }
      } catch (tokenError) {
        console.error('Invalid token:', tokenError)
        return null
      }
    },
    [isTokenExpired],
  )

  // Login with token
  const loginWithToken = useCallback(
    (token: string): boolean => {
      const userData = parseToken(token)
      if (userData) {
        localStorage.setItem('access_token', token)
        setUser(userData)
        setIsAuthenticated(true)
        setError(null)
        return true
      } else {
        setError('Invalid or expired token')
        return false
      }
    },
    [parseToken],
  )

  // Login with username and password
  const login = useCallback(
    async (username: string, password: string): Promise<void> => {
      setError(null)
      setIsLoading(true)

      try {
        // Use the existing API login function
        const data = await apiLogin(username, password)
        const { access_token } = data

        if (loginWithToken(access_token)) {
          // Success handled by loginWithToken
        } else {
          throw new Error('Invalid token received')
        }
      } catch (loginError) {
        const errorMessage =
          loginError instanceof Error
            ? loginError.message
            : 'Authentication failed'
        setError(errorMessage)
        throw new Error(errorMessage)
      } finally {
        setIsLoading(false)
      }
    },
    [loginWithToken],
  )

  // Check if user has specific authority
  const hasAuthority = useCallback(
    (authority: string): boolean => {
      return user?.authorities.includes(authority) ?? false
    },
    [user],
  )

  // Check if user has any of the specified authorities
  const hasAnyAuthority = useCallback(
    (authorities: Array<string>): boolean => {
      return authorities.some((authority) =>
        user?.authorities.includes(authority),
      )
    },
    [user],
  )

  // Logout user
  const logout = useCallback(() => {
    localStorage.removeItem('access_token')
    setIsAuthenticated(false)
    setUser(null)
    setError(null)
  }, [])

  // Clear error state
  const clearError = useCallback(() => {
    setError(null)
  }, [])

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = () => {
      setIsLoading(true)
      const token = localStorage.getItem('access_token')

      if (token && !isTokenExpired(token)) {
        const userData = parseToken(token)
        if (userData) {
          setUser(userData)
          setIsAuthenticated(true)
        } else {
          localStorage.removeItem('access_token')
        }
      } else if (token) {
        localStorage.removeItem('access_token')
      }

      setIsLoading(false)
    }

    initializeAuth()
  }, [isTokenExpired, parseToken])

  // Auto-refresh token before expiration
  useEffect(() => {
    if (!isAuthenticated || !user?.exp) return

    const tokenExp = user.exp * 1000 // Convert to milliseconds
    const currentTime = Date.now()
    const timeUntilExpiry = tokenExp - currentTime
    const refreshTime = Math.max(timeUntilExpiry - 5 * 60 * 1000, 60 * 1000) // Refresh 5 minutes before expiry, minimum 1 minute

    if (refreshTime > 0) {
      const timer = setTimeout(() => {
        // In a real app, you would call a refresh endpoint here
        // For now, we'll just logout when token expires
        logout()
      }, refreshTime)

      return () => clearTimeout(timer)
    } else {
      // Token is about to expire or has expired
      logout()
    }
  }, [isAuthenticated, user?.exp, logout])

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <div
          style={{
            width: '40px',
            height: '40px',
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #1976d2',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }}
        />
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
        <span>Loading...</span>
      </div>
    )
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        isLoading,
        error,
        hasAuthority,
        hasAnyAuthority,
        login,
        loginWithToken,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
