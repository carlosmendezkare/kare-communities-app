// hooks/useApi.ts

import { useCallback, useMemo, useState } from 'react'
import { httpClient, HttpClientOptions } from '../services/httpClient'
import { isApiError, StructuredApiError } from '../types/apiTypes'

type HttpGetOptions = Omit<HttpClientOptions, 'body'>

/**
 * Un hook semántico y robusto para realizar llamadas a la API desde componentes.
 * Gestiona el estado de la UI (isLoading, error, data) y expone un objeto `request`
 * que contiene los métodos para interactuar con la red de forma clara y segura.
 * @template TData El tipo de dato esperado que este hook gestionará.
 */
export const useApi = <TData>() => {
  const [data, setData] = useState<TData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<StructuredApiError | null>(null)

  const executeRequest = useCallback(
    async <TResult>(
      requestFn: () => Promise<TResult>,
      options: { setDataOnSuccess: boolean },
    ): Promise<TResult> => {
      setIsLoading(true)
      setError(null)
      try {
        const result = await requestFn()
        if (options.setDataOnSuccess) {
          setData(result as unknown as TData)
        }
        return result
      } catch (err) {
        if (isApiError(err)) {
          setError(err)
        } else {
          setError({
            name: 'ApiError',
            status: 0,
            message: (err as Error).message || 'An unknown error occurred.',
            code: 0,
            details: String(err),
            unAuthorizedRequest: false,
          })
        }
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [],
  )

  /**
   * Limpia cualquier error existente en el estado del hook.
   */
  const clearError = useCallback(() => setError(null), [])

  // --- API PÚBLICA DEL HOOK CON OBJETO 'request' ANIDADO ---
  const request = useMemo(
    () => ({
      /**
       * Realiza una petición GET para buscar y establecer el estado 'data' principal del hook.
       */
      get: (endpoint: string, options?: HttpGetOptions) =>
        executeRequest(() => httpClient.get<TData>(endpoint, options), {
          setDataOnSuccess: true,
        }),

      /**
       * Realiza una petición POST, idealmente para crear un nuevo recurso.
       * No modifica el estado 'data' del hook por defecto.
       * @template TResult El tipo de dato esperado en la respuesta del POST.
       */
      post: <TResult = any>(endpoint: string, options?: HttpClientOptions) =>
        executeRequest<TResult>(
          () => httpClient.post<TResult>(endpoint, options),
          { setDataOnSuccess: false },
        ),

      /**
       * Realiza una petición PUT, idealmente para actualizar un recurso existente.
       * No modifica el estado 'data' del hook por defecto.
       * @template TResult El tipo de dato esperado en la respuesta del PUT.
       */
      put: <TResult = any>(endpoint: string, options?: HttpClientOptions) =>
        executeRequest<TResult>(
          () => httpClient.put<TResult>(endpoint, options),
          { setDataOnSuccess: false },
        ),

      /**
       * Realiza una petición DELETE, idealmente para eliminar un recurso.
       * No modifica el estado 'data' del hook por defecto.
       * @template TResult El tipo de dato esperado en la respuesta del DELETE.
       */
      delete: <TResult = any>(endpoint: string, options?: HttpClientOptions) =>
        executeRequest<TResult>(
          () => httpClient.delete<TResult>(endpoint, options),
          { setDataOnSuccess: false },
        ),
    }),
    [executeRequest],
  )

  return useMemo(
    () => ({
      data,
      isLoading,
      error,
      request, // Se exporta el objeto que contiene los métodos
      clearError,
    }),
    [data, isLoading, error, request, clearError],
  )
}
