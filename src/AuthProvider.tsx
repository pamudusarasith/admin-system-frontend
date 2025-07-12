import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import { jwtDecode } from 'jwt-decode'
import { Navigate } from '@tanstack/react-router'

interface User {
  username: string
  authorities: Array<string>
  exp?: number // Token expiration time
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  hasAuthority: (authority: string) => boolean
  login: (token: string) => boolean
  refresh: () => Promise<boolean>
  logout: () => void
  clearError: () => void
}

interface AuthProviderProps {
  children: React.ReactNode
}

interface ProtectedRouteProps {
  children?: React.ReactNode
  requiredAuthority?: string
  fallbackPath?: string
}

interface TokenPayload {
  sub: string
  scope: string
  exp: number
  iat: number
}

const initialContext: AuthContextType = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  hasAuthority: () => false,
  login: () => false,
  refresh: async () => Promise.resolve(false),
  logout: () => {},
  clearError: () => {},
}

const AuthContext = createContext<AuthContextType>(initialContext)

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
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
        return {
          username: decoded.sub,
          authorities: decoded.scope.split(' ').filter(Boolean),
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
  const login = useCallback(
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

  // Check if user has specific authority
  const hasAuthority = useCallback(
    (authority: string): boolean => {
      return user?.authorities.includes(authority) ?? false
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

  // Refresh token (in a real app, this would call an API endpoint)
  const refresh = useCallback(async (): Promise<boolean> => {
    try {
      const token = localStorage.getItem('access_token')
      if (!token) {
        logout()
        return Promise.resolve(false)
      }

      if (isTokenExpired(token)) {
        // In a real app, you would call a refresh endpoint here
        // For now, we'll just logout
        logout()
        return Promise.resolve(false)
      }

      const userData = parseToken(token)
      if (userData) {
        setUser(userData)
        setIsAuthenticated(true)
        setError(null)
        return Promise.resolve(true)
      } else {
        logout()
        return Promise.resolve(false)
      }
    } catch (refreshError) {
      console.error('Token refresh failed:', refreshError)
      logout()
      return Promise.resolve(false)
    }
  }, [isTokenExpired, parseToken, logout])

  // Clear error state
  const clearError = useCallback(() => {
    setError(null)
  }, [])

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true)
      const token = localStorage.getItem('access_token')

      if (token) {
        await refresh()
      } else {
        setIsAuthenticated(false)
        setUser(null)
      }

      setIsLoading(false)
    }

    void initializeAuth()
  }, [refresh])

  // Auto-refresh token before expiration
  useEffect(() => {
    if (!isAuthenticated || !user?.exp) return

    const tokenExp = user.exp * 1000 // Convert to milliseconds
    const currentTime = Date.now()
    const timeUntilExpiry = tokenExp - currentTime
    const refreshTime = Math.max(timeUntilExpiry - 5 * 60 * 1000, 60 * 1000) // Refresh 5 minutes before expiry, minimum 1 minute

    if (refreshTime > 0) {
      const timer = setTimeout(() => {
        void refresh()
      }, refreshTime)

      return () => clearTimeout(timer)
    }
  }, [isAuthenticated, user?.exp, refresh])

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        error,
        hasAuthority,
        login,
        refresh,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  return useContext(AuthContext)
}

// Loading spinner component
const LoadingSpinner = () => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      flexDirection: 'column',
      gap: '16px',
    }}
  >
    <div
      style={{
        width: '40px',
        height: '40px',
        border: '4px solid #f3f3f3',
        borderTop: '4px solid #3498db',
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

// Hook to check if user has any of the required authorities
export const useHasAnyAuthority = (authorities: Array<string>): boolean => {
  const { hasAuthority } = useAuth()
  return authorities.some((authority) => hasAuthority(authority))
}

// Hook to check if user has all required authorities
export const useHasAllAuthorities = (authorities: Array<string>): boolean => {
  const { hasAuthority } = useAuth()
  return authorities.every((authority) => hasAuthority(authority))
}

// Higher-order component for role-based rendering
export const withAuth = <TProps extends object>(
  Component: React.ComponentType<TProps>,
  requiredAuthority?: string,
) => {
  return (props: TProps) => {
    const { isAuthenticated, hasAuthority, isLoading } = useAuth()

    if (isLoading) {
      return <LoadingSpinner />
    }

    if (!isAuthenticated) {
      return <Navigate to="/login" replace />
    }

    if (requiredAuthority && !hasAuthority(requiredAuthority)) {
      return <Navigate to="/403" replace />
    }

    return <Component {...props} />
  }
}

export const ProtectedRoute = ({
  children,
  requiredAuthority,
  fallbackPath = '/login',
}: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, hasAuthority } = useAuth()

  // Show loading state while checking authentication
  if (isLoading) {
    return <LoadingSpinner />
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to={fallbackPath} replace />
  }

  // Check required authority if specified
  if (requiredAuthority && !hasAuthority(requiredAuthority)) {
    return <Navigate to="/403" replace />
  }

  return <>{children}</>
}
