import { notificationAsync, NotificationFeedbackType } from 'expo-haptics'
import Toast from 'react-native-toast-message'

export const showSuccessToast = (message: string, subtitle?: string): void => {
  notificationAsync(NotificationFeedbackType.Success).catch(
    () => {},
  )

  Toast.show({
    type: 'success',
    text1: message,
    text2: subtitle,
    position: 'bottom',
    bottomOffset: 100,
  })
}

export const showErrorToast = (message: string, subtitle?: string): void => {
  notificationAsync(NotificationFeedbackType.Error).catch(
    () => {},
  )

  Toast.show({
    type: 'error',
    text1: message,
    text2: subtitle,
    position: 'bottom',
    bottomOffset: 100,
  })
}

export const showInfoToast = (message: string, subtitle?: string): void => {
  notificationAsync(NotificationFeedbackType.Success).catch(
    () => {},
  )

  Toast.show({
    type: 'info',
    text1: message,
    text2: subtitle,
    position: 'bottom',
    bottomOffset: 100,
  })
}

export const toastErrorHandler = (
  errorLike: unknown,
  defaultMessage: string = 'Something went wrong. Please try again.',
): void => {
  let message: string | undefined
  if (typeof errorLike === 'string') {
    message = errorLike
  } else if (errorLike && typeof errorLike === 'object') {
    const anyErr = errorLike as any
    message = anyErr?.message ?? anyErr?.error ?? anyErr?.toString?.()
  }

  const finalMessage =
    typeof message === 'string' && message.trim().length > 0
      ? message
      : defaultMessage
  showErrorToast(finalMessage)
}

export const toast = {
  success: showSuccessToast,
  error: showErrorToast,
  info: showInfoToast,
}
