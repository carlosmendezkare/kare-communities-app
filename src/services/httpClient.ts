import {
  isApiError,
  type ApiResponse,
  type StructuredApiError,
} from '@/src/types/apiTypes'
import { fetch, type FetchRequestInit } from 'expo/fetch'
import { Config } from '../config/config'
import { AuthService } from './AuthService'

let tokenRefreshPromise: Promise<boolean> | null = null

const serializeParams = (params: Record<string, any>): string => {
  const queryParts = Object.entries(params)
    .filter(([, value]) => value !== null && value !== undefined)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`,
    )
  return queryParts.join('&')
}

export type HttpClientOptions = {
  body?: any
  params?: Record<string, any>
  isAuth?: boolean
  headers?: Record<string, string>
  signal?: AbortSignal
}

const request = async <T>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  endpoint: string,
  options: HttpClientOptions,
): Promise<T> => {
  const {
    isAuth = true,
    body,
    params,
    headers: customHeaders,
    signal,
  } = options

  let url = `${Config.BASE_URL}${endpoint}`
  if (params && Object.keys(params).length > 0) {
    url = `${url}?${serializeParams(params)}`
  }

  const headers = new Headers({
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...customHeaders,
  })

  if (isAuth) {
    const accessToken = await AuthService.getAccessToken()
    if (accessToken) headers.append('Authorization', `Bearer ${accessToken}`)
  }

  const config: FetchRequestInit = { method, headers, signal }
  if (body) config.body = JSON.stringify(body)

  console.log('config', config)
  console.log('url', url)
  console.log('body', body)
  console.log('Config.IS_DEV', Config.IS_DEV)

  if (Config.IS_DEV) {
    console.log(`[HTTP] --> ${method} ${url}`, { body: body ?? 'No Body' })
  }

  try {
    let response = await fetch(url, config)

    if (response.status === 401 && isAuth) {
      if (!tokenRefreshPromise) {
        tokenRefreshPromise = AuthService.refreshToken().finally(
          () => (tokenRefreshPromise = null),
        )
      }
      const refreshOk = await tokenRefreshPromise
      if (refreshOk) {
        const newAccessToken = await AuthService.getAccessToken()
        if (newAccessToken)
          headers.set('Authorization', `Bearer ${newAccessToken}`)
        response = await fetch(url, { ...config, headers })
      } else {
        throw {
          name: 'ApiError',
          status: 401,
          message: 'Session expired. Please log in again.',
          code: 401,
          details: 'Token refresh failed or was not possible.',
          unAuthorizedRequest: true,
        } as StructuredApiError
      }
    }

    const responseText = await response.text()

    // --- BLOQUE DE MANEJO DE ERRORES REFACTORIZADO ---
    if (!response.ok) {
      if (Config.IS_DEV) {
        console.log(`[HTTP] <-- ${response.status} ${url}`, {
          response: responseText,
        })
      }

      // 1. Crear un error de fallback por si la respuesta no es un JSON válido.
      let apiError: StructuredApiError = {
        name: 'ApiError',
        status: response.status,
        message: `HTTP Error: ${response.status}`,
        code: response.status,
        details: responseText,
        unAuthorizedRequest: response.status === 401,
      }

      // 2. Intentar parsear el texto para obtener un error más detallado.
      try {
        const errorData: ApiResponse<null> = JSON.parse(responseText)
        // 3. Si el parseo tiene éxito y contiene nuestra estructura de error,
        //    se enriquece el objeto de error.
        if (errorData && errorData.error) {
          apiError = {
            ...apiError,
            message: errorData.error.message,
            code: errorData.error.code,
            details: errorData.error.details,
            unAuthorizedRequest: errorData.unAuthorizedRequest,
          }
        }
      } catch (_) {
        // 4. Si el parseo falla (e.g., es HTML), no se hace nada.
        //    El error de fallback ya está listo para ser lanzado.
      }

      // 5. Lanzar el error, ya sea el de fallback o el enriquecido.
      throw apiError
    }
    // --- FIN DEL BLOQUE REFACTORIZADO ---

    const contentType = response.headers.get('content-type')
    if (contentType?.includes('application/json') && responseText) {
      const responseData: ApiResponse<T> = JSON.parse(responseText)
      if (Config.IS_DEV)
        console.log(`[HTTP] <-- ${response.status} ${url}`, {
          response: responseData,
        })

      if (responseData.success === false && responseData.error) {
        throw {
          name: 'ApiError',
          status: response.status,
          message: responseData.error.message,
          code: responseData.error.code,
          details: responseData.error.details,
          unAuthorizedRequest: responseData.unAuthorizedRequest,
        } as StructuredApiError
      }

      return responseData.result
    }

    return responseText as unknown as T
  } catch (error) {
    if (Config.IS_DEV && !isApiError(error)) {
      console.log(`[HTTP] <-- FATAL ${url}`, error)
    }
    throw error
  }
}

export const httpClient = {
  get: <T>(endpoint: string, options: Omit<HttpClientOptions, 'body'> = {}) =>
    request<T>('GET', endpoint, options),
  post: <T>(endpoint: string, options: HttpClientOptions = {}) =>
    request<T>('POST', endpoint, options),
  put: <T>(endpoint: string, options: HttpClientOptions = {}) =>
    request<T>('PUT', endpoint, options),
  delete: <T>(endpoint: string, options: HttpClientOptions = {}) =>
    request<T>('DELETE', endpoint, options),
}
