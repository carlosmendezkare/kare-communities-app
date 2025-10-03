import { Ionicons } from '@expo/vector-icons'
import { useLocalSearchParams, useRouter } from 'expo-router'
import React, { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'

import BrandLoader from '@/src/components/common/BrandLoader'
import Screen from '@/src/components/common/Screen'
import Button from '@/src/components/ui/Button'
import Input from '@/src/components/ui/Input'
import { useApi } from '@/src/hooks/useApiRequest'
import { showSuccessToast, toastErrorHandler } from '@/src/services/ToastService'

type ResetPasswordResponse = {
  success: boolean
  result?: {
    userId: string
    accessToken: string
    refreshToken: string
    expireInSeconds: number
  }
  error?: {
    message: string
  }
}

type EmailResetPasswordResponse = {
  success: boolean
  error?: {
    message: string
  }
}

export default function NewPasswordScreen() {
  const router = useRouter()
  const params = useLocalSearchParams<{
    email?: string
    userId?: string
    resetCode: string
    isFirstLogin: string
  }>()

  const { request, isLoading, error } = useApi()

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [newPasswordError, setNewPasswordError] = useState('')
  const [confirmPasswordError, setConfirmPasswordError] = useState('')

  const isFirstLogin = params.isFirstLogin === 'true'

  const validatePasswords = (): boolean => {
    let isValid = true

    if (!newPassword.trim()) {
      setNewPasswordError('Password is required')
      isValid = false
    } else if (newPassword.length < 6) {
      setNewPasswordError('Password must be at least 6 characters')
      isValid = false
    } else {
      setNewPasswordError('')
    }

    if (!confirmPassword.trim()) {
      setConfirmPasswordError('Please confirm your password')
      isValid = false
    } else if (newPassword !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match')
      isValid = false
    } else {
      setConfirmPasswordError('')
    }

    return isValid
  }

  const handleFirstTimePassword = async (): Promise<void> => {
    try {
      await request.post<ResetPasswordResponse>('TokenAuth/ResetPassword', {
        body: {
          userId: params.userId,
          resetCode: params.resetCode,
          password: newPassword,
        },
      })

      // TODO: Auto-signin after first time password setup

      showSuccessToast(
        'Password set successfully!',
        'You can now sign in with your new password',
      )

      // Navigate after a short delay to let user see the success toast
      setTimeout(() => {
        router.replace('/(auth)/login')
      }, 1500)
    } catch {
      toastErrorHandler(error?.message, 'Failed to set password')
    }
  }

  const handleResetPassword = async (): Promise<void> => {
    try {
      await request.post<EmailResetPasswordResponse>(
        '/api/services/app/Account/EmailResetPassword',
        {
          body: {
            emailAddress: params.email,
            resetCode: params.resetCode,
            password: newPassword,
          },
        },
      )

      showSuccessToast(
        'Password reset successfully!',
        'You can now sign in with your new password',
      )

      // Navigate after a short delay to let user see the success toast
      setTimeout(() => {
        router.replace('/(auth)/login')
      }, 1500)
    } catch {
      toastErrorHandler(error?.message, 'Failed to reset password')
    }
  }

  const handleContinue = async () => {
    if (!validatePasswords()) return

    if (isFirstLogin) {
      await handleFirstTimePassword()
    } else {
      await handleResetPassword()
    }
  }

  return (
    <Screen keyboardAvoiding>
      <BrandLoader visible={isLoading} />

      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <View style={styles.iconBackground}>
            <Ionicons name="key-outline" size={32} color="#FF6B35" />
          </View>
        </View>

        <Text style={styles.subtitle}>
          {isFirstLogin
            ? 'Welcome! Please set your new password to get started.'
            : 'We are almost done. Please enter your new password to login.'}
        </Text>

        <View style={styles.form}>
          <Input
            label="New Password"
            value={newPassword}
            onChangeText={setNewPassword}
            error={newPasswordError}
            secureTextEntry
            showPasswordToggle
            textContentType="newPassword"
            autoCapitalize="none"
            placeholder="Enter your new password"
            returnKeyType="next"
          />

          <Input
            label="Confirm New Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            error={confirmPasswordError}
            secureTextEntry
            showPasswordToggle
            textContentType="newPassword"
            autoCapitalize="none"
            placeholder="Confirm your new password"
            returnKeyType="done"
          />

          <Button
            title="CONTINUE"
            onPress={handleContinue}
            loading={isLoading}
            style={styles.continueButton}
          />
        </View>

        <View style={styles.passwordRequirements}>
          <Text style={styles.requirementsTitle}>Password Requirements:</Text>
          <Text style={styles.requirementText}>
            • At least 6 characters long
          </Text>
          <Text style={styles.requirementText}>
            • Contains both letters and numbers (recommended)
          </Text>
          <Text style={styles.requirementText}>
            • Avoid common words or patterns
          </Text>
        </View>
      </View>
    </Screen>
  )
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingTop: 60,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconBackground: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFF4F2',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFE4E1',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
    paddingHorizontal: 10,
  },
  form: {
    gap: 20,
    marginBottom: 40,
  },
  continueButton: {
    marginTop: 20,
  },
  passwordRequirements: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  requirementsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  requirementText: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
    lineHeight: 16,
  },
})
