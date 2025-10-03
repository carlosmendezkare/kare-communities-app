import { Stack } from 'expo-router'

/**
 * Authentication layout - manages navigation between auth screens
 */
export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: '#FFFFFF',
        },
        headerTitleStyle: {
          fontSize: 18,
          fontWeight: '600',
          color: '#1F2937',
        },
        headerTitleAlign: 'center',
        headerTintColor: '#1F2937',
        headerBackTitle: '',
      }}>
      <Stack.Screen name="welcome" options={{ headerShown: false }} />
      <Stack.Screen
        name="login"
        options={{
          title: 'Welcome to KARE',
          headerBackTitle: 'Back',
          animation: 'slide_from_bottom',
        }}
      />
      <Stack.Screen
        name="forgot-password"
        options={{
          title: 'Forgot Password',
        }}
      />
      <Stack.Screen
        name="verification-code"
        options={{
          title: 'Verification Code',
        }}
      />
      <Stack.Screen
        name="new-password"
        options={{
          title: 'New Password',
        }}
      />
    </Stack>
  )
}
