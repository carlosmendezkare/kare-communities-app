import gifAssets from '@/assets/gif'
import { Image } from 'expo-image'
import React from 'react'
import { Modal, StyleSheet, View } from 'react-native'

type BrandLoaderProps = {
  visible: boolean
}

/**
 * Custom brand loader overlay with animated GIF
 * Shows loading.gif in a modal overlay during API requests
 */
export default function BrandLoader({ visible }: BrandLoaderProps) {
  if (!visible) return null

  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Image
            source={gifAssets.loading}
            style={styles.loadingGif}
            contentFit="contain"
          />
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 80,
    minHeight: 80,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  loadingGif: {
    width: 60,
    height: 60,
  },
})
