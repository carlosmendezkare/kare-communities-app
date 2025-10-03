import { Config } from '../config/config'
import { callLoginApi, callRefreshTokenApi } from '../helpers/authHelper'
import { isApiError } from '../types/apiTypes'
import { StorageService } from './StorageService'



const CREDENTIALS_KEY = 'AUTH_CREDENTIALS'

export type AuthCredentials = {
  userId: string
  accessToken: string
  refreshToken: string
  expiryDate: string
}

export type LoginCredentials = {
  username: string
  password: string
}

const getSession = (): Promise<AuthCredentials | null> => {
  return StorageService.get<AuthCredentials>(CREDENTIALS_KEY)
}

const setSession = async (data: {
  userId: string | number
  accessToken: string
  refreshToken: string
}): Promise<void> => {
  const expiryDate = new Date()
  expiryDate.setSeconds(expiryDate.getSeconds() + Config.TOKEN_DURATION_SECONDS)

  const credentials: AuthCredentials = {
    userId: String(data.userId),
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
    expiryDate: expiryDate.toISOString(),
  }
  await StorageService.set(CREDENTIALS_KEY, credentials)
}

const clearSession = (): Promise<void> => {
  return StorageService.remove(CREDENTIALS_KEY)
}

const refreshToken = async (): Promise<boolean> => {
  const credentials = await getSession()
  if (!credentials) return false

  try {
    const response = await callRefreshTokenApi(credentials.refreshToken)
    await setSession({
      ...credentials,
      accessToken: response.accessToken,
    })
    return true
  } catch (error) {
    if (isApiError(error) && error.unAuthorizedRequest) {
      await clearSession()
    }
    return false
  }
}

const login = async (credentials: LoginCredentials): Promise<void> => {
  const result = await callLoginApi(credentials)
  await setSession(result)
}

const getAccessToken = async (): Promise<string | null> => {
  const session = await getSession()
  return session?.accessToken ?? null
}

export const AuthService = {
  getSession,
  setSession,
  clearSession,
  getAccessToken,
  refreshToken,
  login,
}
