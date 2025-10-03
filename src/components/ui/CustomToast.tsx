import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import type { ToastConfig } from 'react-native-toast-message'

const CustomToast: ToastConfig = {
  success: ({ text1, text2 }) => (
    <View style={[styles.container, styles.successContainer]}>
      <View style={styles.iconContainer}>
        <Ionicons name="checkmark-circle" size={20} color="#10B981" />
      </View>
      <View style={styles.textContainer}>
        <Text style={[styles.title, styles.successTitle]}>{text1}</Text>
        {text2 ? <Text style={styles.subtitle}>{text2}</Text> : null}
      </View>
    </View>
  ),

  error: ({ text1, text2 }) => (
    <View style={[styles.container, styles.errorContainer]}>
      <View style={styles.iconContainer}>
        <Ionicons name="alert-circle" size={20} color="#FF6B35" />
      </View>
      <View style={styles.textContainer}>
        <Text style={[styles.title, styles.errorTitle]}>{text1}</Text>
        {text2 ? <Text style={styles.subtitle}>{text2}</Text> : null}
      </View>
    </View>
  ),

  info: ({ text1, text2 }) => (
    <View style={[styles.container, styles.infoContainer]}>
      <View style={styles.iconContainer}>
        <Ionicons name="information-circle" size={20} color="#FF6B35" />
      </View>
      <View style={styles.textContainer}>
        <Text style={[styles.title, styles.infoTitle]}>{text1}</Text>
        {text2 ? <Text style={styles.subtitle}>{text2}</Text> : null}
      </View>
    </View>
  ),
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginHorizontal: 20,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1,
  },
  successContainer: {
    borderColor: '#10B981',
  },
  errorContainer: {
    borderColor: '#FF6B35',
  },
  infoContainer: {
    borderColor: '#FF6B35',
  },
  iconContainer: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 20,
  },
  successTitle: {
    color: '#10B981',
  },
  errorTitle: {
    color: '#FF6B35',
  },
  infoTitle: {
    color: '#FF6B35',
  },
  subtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
    lineHeight: 18,
  },
})

export default CustomToast