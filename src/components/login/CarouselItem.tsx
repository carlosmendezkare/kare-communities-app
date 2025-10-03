import { Image } from 'expo-image'
import React from 'react'

import { StyleSheet, Text, useWindowDimensions, View } from 'react-native'
import type { SlideItemData } from './WelcomeCarousel'

export default function CarouselItem({ item }: { item: SlideItemData }) {
  const { width } = useWindowDimensions()

  return (
    <View style={[styles.container, { width }]}>
      <Image
        source={item.image}
        style={[styles.image, { width: width, height: 250 }]}
        contentFit="contain"
      />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 20,
  },
  image: {
    marginBottom: 20,
  },
  textContainer: {
    // paddingHorizontal: 28,
    alignItems: 'center',
    maxWidth: '80%',
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 26,
  },
  description: {
    fontSize: 16,
    fontWeight: '400',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
  },
})
