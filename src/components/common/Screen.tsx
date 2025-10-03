import React from 'react'
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native'

type ScreenProps = {
  children: React.ReactNode
  style?: ViewStyle
  contentContainerStyle?: ViewStyle
  scrollable?: boolean
  keyboardAvoiding?: boolean
}

const Screen = ({
  children,
  style,
  contentContainerStyle,
  scrollable = true,
  keyboardAvoiding = false,
}: ScreenProps) => {
  const content = scrollable ? (
    <ScrollView
      style={[styles.scrollView, style]}
      contentContainerStyle={[styles.contentContainer, contentContainerStyle]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}>
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.container, style]}>{children}</View>
  )

  return keyboardAvoiding ? (
    <KeyboardAvoidingView
      style={styles.keyboardAvoidingView}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      {content}
    </KeyboardAvoidingView>
  ) : (
    content
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  contentContainer: {
    flexGrow: 1,
    padding: 20,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
})

export default Screen
