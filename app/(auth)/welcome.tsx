import Screen from '@/src/components/common/Screen'
import { WelcomeCarousel } from '@/src/components/login/WelcomeCarousel'
import Button from '@/src/components/ui/Button'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

export default function WelcomeScreen() {
  const router = useRouter()

  return (
    <Screen contentContainerStyle={{ paddingHorizontal: 0 }}>
      <View style={styles.header}>
        <Image
          style={styles.logo}
          contentFit="contain"
          source={require('../../assets/images/brand/logo.png')}
        />
        <Text style={styles.headerText}>For Communities / Facilities Only</Text>
      </View>

      <View style={styles.carouselContainer}>
        <WelcomeCarousel />
      </View>

      <View style={styles.footer}>
        <Button
          title="SIGN IN"
          onPress={() => router.push('/(auth)/login')}
          style={styles.button}
        />
        <Text style={styles.footerText}>
          This app is for communities and facilities that need help filling
          shifts. If you are a nurse, caregiver or other senior care worker,
          please download the KARE Heroes app instead.
        </Text>
      </View>
    </Screen>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 48,
  },
  logo: {
    width: 200,
    height: 96,
  },
  headerText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    fontWeight: '400',
  },
  carouselContainer: {
    flex: 1,
  },
  footer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  button: {
    width: '100%',
    marginBottom: 16,
  },
  footerText: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 16,
  },
})
