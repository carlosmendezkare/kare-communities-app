// components/auth/Paginator.tsx

import React from 'react'
import { Animated, StyleSheet, View } from 'react-native'
import type { SlideItemData } from './WelcomeCarousel'

export default function Paginator({
  data,
  currentIndex,
}: {
  data: SlideItemData[]
  currentIndex: number
}) {
  return (
    <View style={styles.container}>
      {data.map((_, i) => {
        const isActive = i === currentIndex
        return (
          <Animated.View
            key={i.toString()}
            style={[
              isActive ? styles.oval : styles.dot,
              { backgroundColor: isActive ? '#FF6B35' : '#D1D5DB' },
            ]}
          />
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    height: 10,
    borderRadius: 5,
    marginHorizontal: 4,
    width: 10,
  },
  oval: {
    height: 10,
    borderRadius: 5,
    marginHorizontal: 4,
    width: 25,
  },
})
