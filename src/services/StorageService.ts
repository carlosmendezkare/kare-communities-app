// services/StorageService.ts
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Config } from '../config/config'

const set = async <T>(key: string, value: T): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(value)
    await AsyncStorage.setItem(key, jsonValue)
  } catch (e) {
    console.warn(`[StorageService] Error setting key "${key}":`, e)
    if (Config.IS_DEV) throw e
  }
}

const get = async <T>(key: string): Promise<T | null> => {
  console.log('get', key)
  try {
    const jsonValue = await AsyncStorage.getItem(key)
    return jsonValue != null ? (JSON.parse(jsonValue) as T) : null
  } catch (e) {
    console.warn(`[StorageService] Error getting key "${key}":`, e)
    if (Config.IS_DEV) throw e
    return null
  }
}

const remove = async (key: string): Promise<void> => {
  console.log('remove', key)
  try {
    await AsyncStorage.removeItem(key)
  } catch (e) {
    console.warn(`[StorageService] Error removing key "${key}":`, e)
    if (Config.IS_DEV) throw e
  }
}

export const StorageService = {
  set,
  get,
  remove,
}
