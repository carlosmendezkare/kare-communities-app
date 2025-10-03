import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'

import BrandLoader from '@/src/components/common/BrandLoader'
import Screen from '@/src/components/common/Screen'
import Button from '@/src/components/ui/Button'
import Input from '@/src/components/ui/Input'
import { useApi } from '@/src/hooks/useApiRequest'
import { showSuccessToast, toastErrorHandler } from '@/src/services/ToastService'

type ForgotPasswordResponse = {
  success: boolean
  error?: string
}

export default function ForgotPasswordScreen() {
  const router = useRouter()
  const { request, isLoading, error } = useApi<ForgotPasswordResponse>()

  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email.trim())
  }

  const validateForm = (): boolean => {
    if (!email.trim()) {
      setEmailError('Email is required')
      return false
    }

    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address')
      return false
    }

    setEmailError('')
    return true
  }

  const handleSendCode = async () => {
    if (!validateForm()) return

    try {
      await request.post<ForgotPasswordResponse>(
        '/api/services/app/Account/SendPasswordResetCode',
        {
          body: {
            emailAddress: email.trim(),
            phoneNumber: null,
          },
        },
      )

      showSuccessToast(
        'Verification code sent!',
        `We sent a reset code to ${email.trim()}`,
      )

      router.push({
        pathname: '/(auth)/verification-code',
        params: { email: email.trim() },
      })
    } catch {
      toastErrorHandler(error?.message, 'Failed to send code')
    }
  }

  return (
    <Screen keyboardAvoiding>
      <BrandLoader visible={isLoading} />

      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <View style={styles.iconBackground}>
            <Ionicons name="mail-outline" size={32} color="#FF6B35" />
          </View>
        </View>

        <Text style={styles.subtitle}>
          Don&apos;t worry. Resetting your password is easy, just tell us the
          email address you registered with KARE.
        </Text>

        <View style={styles.form}>
          <Input
            label="Email Address"
            value={email}
            onChangeText={setEmail}
            error={emailError}
            keyboardType="email-address"
            autoCapitalize="none"
            textContentType="username"
            leftIcon="mail-outline"
            placeholder="Enter your email address"
            returnKeyType="done"
          />

          <Button
            title="CONTINUE"
            onPress={handleSendCode}
            loading={isLoading}
            style={styles.continueButton}
          />
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
  },
  continueButton: {
    marginTop: 20,
  },
})
