import type { ApiResponse, StructuredApiError } from '@/src/types/apiTypes'
import { fetch, type FetchRequestInit } from 'expo/fetch'
import { Config } from '../config/config'

type AuthResult = {
  accessToken: string
  refreshToken: string
  userId: number
}

type RefreshTokenResult = {
  accessToken: string
}

const createApiError = (
  status: number,
  data: ApiResponse<any>,
): StructuredApiError => {
  const errorPayload = data.error ?? {
    code: 0,
    message: 'An unexpected API error occurred.',
    details: null,
    validationErrors: null,
  }

  return {
    name: 'ApiError',
    status: status,
    message: errorPayload.message,
    code: errorPayload.code,
    details: errorPayload.details,
    unAuthorizedRequest: data.unAuthorizedRequest,
  }
}

const createJsonPostConfig = (body: any): FetchRequestInit => ({
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  body: JSON.stringify(body),
})

const handleApiCall = async <T>(
  url: string,
  config: FetchRequestInit,
): Promise<T> => {
  const response = await fetch(url, config)
  const data: ApiResponse<T> = await response.json()

  if (!response.ok || !data.success) {
    throw createApiError(response.status, data)
  }

  return data.result
}

export const callRefreshTokenApi = (
  refreshToken: string,
): Promise<RefreshTokenResult> => {
  const url = `${Config.BASE_URL}/auth/refresh`
  const config = createJsonPostConfig({ refreshToken })
  return handleApiCall<RefreshTokenResult>(url, config)
}

export const callLoginApi = (credentials: {
  username: string
  password: string
}): Promise<AuthResult> => {
  const url = `${Config.BASE_URL}/api/TokenAuth/AuthenticateCommunity`
  const config = createJsonPostConfig({
    userNameOrEmailAddress: credentials.username,
    password: credentials.password,
  })
  return handleApiCall<AuthResult>(url, config)
}
