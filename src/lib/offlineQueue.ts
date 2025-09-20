import AsyncStorage from '@react-native-async-storage/async-storage';

const decode = <T>(value: string | null): T[] => {
  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) {
      return parsed as T[];
    }
  } catch (error) {
    console.warn('Failed to parse offline queue entry', error);
  }

  return [];
};

export const appendOfflineEntry = async <T>(key: string, entry: T) => {
  const existing = decode<T>(await AsyncStorage.getItem(key));
  existing.push(entry);
  await AsyncStorage.setItem(key, JSON.stringify(existing));
};

export const getOfflineEntries = async <T>(key: string): Promise<T[]> => {
  return decode<T>(await AsyncStorage.getItem(key));
};

export const clearOfflineEntries = async (key: string) => {
  await AsyncStorage.removeItem(key);
};
