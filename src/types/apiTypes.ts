/**
 * The shape of the 'error' object that comes from the backend.
 */
type ApiErrorPayload = {
  code: number
  message: string
  details: string | null
}

/**
 * The generic shape for all API responses
 */
export type ApiResponse<T> = {
  result: T
  success: boolean
  error: ApiErrorPayload | null
  unAuthorizedRequest: boolean
}

/**
 * The shape of the error object that we will throw and catch in the app
 */
export type StructuredApiError = {
  name: 'ApiError'
  status: number
  message: string
  code: number
  details: string | null
  unAuthorizedRequest: boolean
}

/**
 * Type guard to check if an error captured is our structured API error.
 * @param error The captured error (of type `unknown`).
 * @returns `true` if the object matches the shape of `StructuredApiError`.
 */
export const isApiError = (error: unknown): error is StructuredApiError => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'name' in error &&
    error.name === 'ApiError'
  )
}
