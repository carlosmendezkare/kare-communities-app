import { Ionicons } from '@expo/vector-icons'
import { useLocalSearchParams, useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'

import BrandLoader from '@/src/components/common/BrandLoader'
import Screen from '@/src/components/common/Screen'
import Button from '@/src/components/ui/Button'
import Input from '@/src/components/ui/Input'
import { useApi } from '@/src/hooks/useApiRequest'
import {
  showErrorToast,
  showSuccessToast,
  toastErrorHandler,
} from '@/src/services/ToastService'

type VerificationResponse = {
  success: boolean
  error?: string
}

type ResendCodeResponse = {
  success: boolean
  error?: string
}

export default function VerificationCodeScreen() {
  const router = useRouter()
  const params = useLocalSearchParams<{ email: string }>()
  const { request, isLoading, error } = useApi<VerificationResponse>()

  const [verificationCode, setVerificationCode] = useState('')
  const [codeError, setCodeError] = useState('')
  const [countdown, setCountdown] = useState(0)
  const [resendLoading, setResendLoading] = useState(false)

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const validateCode = (): boolean => {
    const code = verificationCode.trim().toUpperCase()

    if (!code) {
      setCodeError('Verification code is required')
      return false
    }

    if (code.length !== 10) {
      setCodeError('Verification code must be 10 characters')
      return false
    }

    setCodeError('')
    return true
  }

  const handleVerifyCode = async () => {
    if (!validateCode()) return

    try {
      const code = verificationCode.trim().toUpperCase()
      const email = params.email

      if (!email) {
        showErrorToast('Email not found', 'Please try again')
        router.back()
        return
      }

      await request.post<VerificationResponse>(
        `/api/services/app/Account/VerifyResetCode?emailAddress=${email}&resetCode=${code}`,
        {},
      )

      router.push({
        pathname: '/(auth)/new-password',
        params: {
          email,
          resetCode: code,
          isFirstLogin: 'false',
        },
      })
    } catch {
      toastErrorHandler(error?.message, 'Invalid verification code')
    }
  }

  const handleResendCode = async () => {
    const email = params.email

    if (!email) {
      showErrorToast('Email not found', 'Please try again')
      return
    }

    setResendLoading(true)

    try {
      await request.post<ResendCodeResponse>(
        '/api/services/app/Account/SendPasswordResetCode',
        {
          body: {
            emailAddress: email,
            phoneNumber: null,
          },
        },
      )

      setCountdown(30)
      showSuccessToast('Code resent!', 'Check your email for the new code')
    } catch {
      toastErrorHandler(error?.message || 'Failed to resend code')
    } finally {
      setResendLoading(false)
    }
  }

  const canResend = countdown === 0 && !isLoading && !resendLoading

  return (
    <Screen keyboardAvoiding>
      <BrandLoader visible={isLoading || resendLoading} />

      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <View style={styles.iconBackground}>
            <Ionicons
              name="shield-checkmark-outline"
              size={32}
              color="#FF6B35"
            />
          </View>
        </View>

        <Text style={styles.subtitle}>
          We sent you an email with verification code. Please check your email
          and enter the code below.
        </Text>

        <View style={styles.form}>
          <Input
            label="Verification Code"
            value={verificationCode}
            onChangeText={setVerificationCode}
            error={codeError}
            placeholder="Enter 10-character code"
            autoCapitalize="characters"
            maxLength={10}
            textContentType="none"
            leftIcon="key-outline"
            returnKeyType="done"
            keyboardType="default"
          />

          <Button
            title="CONTINUE"
            onPress={handleVerifyCode}
            loading={isLoading}
            style={styles.continueButton}
          />
        </View>

        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>Didn&apos;t get it? </Text>
          <Pressable
            onPress={handleResendCode}
            disabled={!canResend}
            style={[
              styles.resendButton,
              !canResend && styles.resendButtonDisabled,
            ]}>
            <Text
              style={[
                styles.resendButtonText,
                !canResend && styles.resendButtonTextDisabled,
              ]}>
              {countdown > 0 ? `Resend (${countdown}s)` : 'Resend'}
            </Text>
          </Pressable>
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
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resendText: {
    fontSize: 14,
    color: '#6B7280',
  },
  resendButton: {
    padding: 4,
  },
  resendButtonDisabled: {
    opacity: 0.5,
  },
  resendButtonText: {
    fontSize: 14,
    color: '#F05437',
    fontWeight: '600',
  },
  resendButtonTextDisabled: {
    color: '#9CA3AF',
  },
})
