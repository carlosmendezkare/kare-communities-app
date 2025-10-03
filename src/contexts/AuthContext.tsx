import {
  AuthService,
  type AuthCredentials,
  type LoginCredentials,
} from '@/src/services/AuthService'
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

type AuthContextData = {
  authData: AuthCredentials | null
  signIn: (credentials: LoginCredentials) => Promise<void>
  signOut: () => Promise<void>
  initialLoading: boolean
  isLoading: boolean
}

const AuthContext = createContext<AuthContextData | null>(null)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [authData, setAuthData] = useState<AuthCredentials | null>(null)
  const [initialLoading, setInitialLoading] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const checkSession = async () => {
      try {
        const session = await AuthService.getSession()
        if (session) {
          setAuthData(session)
        }
      } catch (error) {
        console.error(
          '[AuthContext] Failed to check session on startup:',
          error,
        )
        setAuthData(null)
      } finally {
        setInitialLoading(false)
      }
    }

    checkSession()
  }, [])

  const signIn = useCallback(async (credentials: LoginCredentials) => {
    setIsLoading(true)
    try {
      await AuthService.login(credentials)
      const newSession = await AuthService.getSession()
      setAuthData(newSession)
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [])

  const signOut = useCallback(async () => {
    await AuthService.clearSession()
    setAuthData(null)
  }, [])

  const value = useMemo(
    () => ({
      authData,
      initialLoading,
      isLoading,
      signIn,
      signOut,
    }),
    [authData, initialLoading, isLoading, signIn, signOut],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const value = useContext(AuthContext)
  if (!value) {
    throw new Error('useAuth must be wrapped in a <AuthProvider>')
  }
  return value
}
