import { useAuth } from '@/src/contexts/AuthContext'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'

import BrandLoader from '@/src/components/common/BrandLoader'
import Screen from '@/src/components/common/Screen'
import Button from '@/src/components/ui/Button'
import Input from '@/src/components/ui/Input'
import { toastErrorHandler } from '@/src/services/ToastService'

export default function LoginScreen() {
  const router = useRouter()
  const { signIn, isLoading } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email.trim())
  }

  const validateForm = (): boolean => {
    let isValid = true

    if (!email.trim()) {
      setEmailError('Email is required')
      isValid = false
    } else if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address')
      isValid = false
    } else {
      setEmailError('')
    }

    if (!password.trim()) {
      setPasswordError('Password is required')
      isValid = false
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters')
      isValid = false
    } else {
      setPasswordError('')
    }

    return isValid
  }

  const handleLogin = async () => {
    if (!validateForm()) return

    try {
      await signIn({ username: email.trim(), password })
    } catch (err: any) {
      toastErrorHandler(
        err.message || 'Something went wrong. Please try again.',
      )
    }
  }

  return (
    <Screen keyboardAvoiding>
      <BrandLoader visible={isLoading} />

      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Image
            style={styles.logo}
            contentFit="contain"
            source={require('../../assets/images/brand/logo.png')}
          />
        </View>

        <Text style={styles.subtitle}>Sign in to access your account</Text>

        <View style={styles.form}>
          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            error={emailError}
            keyboardType="email-address"
            autoCapitalize="none"
            textContentType="emailAddress"
            leftIcon="mail-outline"
            returnKeyType="next"
            placeholder="Enter your email"
          />

          <Input
            label="Password"
            value={password}
            onChangeText={setPassword}
            error={passwordError}
            secureTextEntry
            showPasswordToggle
            textContentType="password"
            autoCapitalize="none"
            returnKeyType="done"
          />

          <Pressable
            style={styles.forgotPasswordContainer}
            onPress={() => router.push('/(auth)/forgot-password')}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </Pressable>

          <Button
            title="SIGN IN"
            onPress={handleLogin}
            loading={isLoading}
            style={styles.loginButton}
          />
        </View>
      </View>
    </Screen>
  )
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingTop: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 200,
    height: 96,
  },
  subtitle: {
    fontSize: 18,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 48,
    fontWeight: '400',
    lineHeight: 24,
  },
  form: {
    gap: 6,
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: 32,
    padding: 8,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#FF6B35',
    fontWeight: '500',
  },
  loginButton: {
    marginTop: 10,
  },
  errorText: {
    fontSize: 14,
    color: '#EF4444',
    textAlign: 'center',
    marginTop: 16,
    paddingHorizontal: 20,
  },
})
