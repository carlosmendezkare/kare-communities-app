import React from 'react'
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextStyle,
  ViewStyle,
} from 'react-native'

type ButtonProps = {
  title: string
  onPress: () => void
  disabled?: boolean
  loading?: boolean
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'small' | 'medium' | 'large'
  style?: ViewStyle
  textStyle?: TextStyle
}

const Button = ({
  title,
  onPress,
  disabled = false,
  loading = false,
  variant = 'primary',
  size = 'medium',
  style,
  textStyle,
}: ButtonProps) => {
  const isDisabled = disabled || loading

  return (
    <Pressable
      style={[
        styles.base,
        styles[variant],
        styles[size],
        isDisabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={isDisabled}>
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' ? '#FFFFFF' : '#F05437'}
          size="small"
        />
      ) : (
        <Text
          style={[
            styles.baseText,
            styles[`${variant}Text`],
            styles[`${size}Text`],
            textStyle,
          ]}>
          {title}
        </Text>
      )}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  primary: {
    backgroundColor: '#FF6B35',
    shadowColor: '#FF6B35',
  },
  secondary: {
    backgroundColor: '#F2F2F2',
    shadowColor: '#000000',
    shadowOpacity: 0.1,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#FF6B35',
    shadowOpacity: 0,
    elevation: 0,
  },
  small: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    minHeight: 44,
  },
  medium: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    minHeight: 52,
  },
  large: {
    paddingVertical: 20,
    paddingHorizontal: 40,
    minHeight: 60,
  },
  disabled: {
    opacity: 0.6,
    shadowOpacity: 0,
    elevation: 0,
  },
  baseText: {
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  primaryText: {
    color: '#FFFFFF',
  },
  secondaryText: {
    color: '#373737',
  },
  outlineText: {
    color: '#FF6B35',
  },
  smallText: {
    fontSize: 14,
  },
  mediumText: {
    fontSize: 16,
  },
  largeText: {
    fontSize: 18,
  },
})

export default Button
