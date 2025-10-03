import images from '@/assets/images'
import React, { useEffect, useRef, useState } from 'react'
import { FlatList, StyleSheet, View } from 'react-native'
import CarouselItem from './CarouselItem'
import Paginator from './Paginator'
const slideData: SlideItemData[] = [
  {
    id: '1',
    image: images.slide1,
    title: 'Stop Paying Outrageous Overtime or Agency Fees',
    description:
      'You choose how much you want to pay Heroes to fill your open shifts',
  },
  {
    id: '2',
    image: images.slide2,
    title: 'Choose Heroes',
    description:
      'You choose who comes to help save the day to fill your open shifts',
  },
  {
    id: '3',
    image: images.slide3,
    title: 'Hire For Free',
    description: 'If you like our Heroes, you can hire them. For free!',
  },
]

export type SlideItemData = {
  id: string
  image: any // o ImageSourcePropType de react-native
  title: string
  description: string
}


export const WelcomeCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const flatListRef = useRef<FlatList<SlideItemData>>(null)

  // Auto-scroll logic using useEffect to be robust and safe.
  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % slideData.length
      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      })
      setCurrentIndex(nextIndex)
    }, 5000)

    return () => clearInterval(interval)
  }, [currentIndex])

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: any[] }) => {
      if (viewableItems.length > 0) {
        setCurrentIndex(viewableItems[0].index)
      }
    },
  ).current

  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 50 }).current

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={slideData}
        renderItem={({ item }) => <CarouselItem item={item} />}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        bounces={false}
        keyExtractor={item => item.id}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        style={styles.flatList}
      />
      <Paginator data={slideData} currentIndex={currentIndex} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flatList: {
    flexGrow: 0,
  },
})
