import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const isWeb = Platform.OS === 'web';

const canUseLocalStorage = (): boolean => {
  if (!isWeb || typeof window === 'undefined') {
    return false;
  }

  try {
    return typeof window.localStorage !== 'undefined';
  } catch (error) {
    return false;
  }
};

const writeToLocalStorage = (key: string, value: string) => {
  if (canUseLocalStorage()) {
    window.localStorage.setItem(key, value);
    return true;
  }

  return false;
};

const readFromLocalStorage = (key: string): string | null => {
  if (canUseLocalStorage()) {
    return window.localStorage.getItem(key);
  }

  return null;
};

export const store = async <State>(key: string, state: State) => {
  try {
    const serialized = JSON.stringify(state);
    if (!writeToLocalStorage(key, serialized)) {
      await AsyncStorage.setItem(key, serialized);
    }
  } catch (error) {
    console.error(error);
  }
};

export const load = async <ReturnValue>(key: string, feedback?: any): Promise<ReturnValue | null> => {
  try {
    const fromLocalStorage = readFromLocalStorage(key);
    const data = fromLocalStorage !== null ? fromLocalStorage : await AsyncStorage.getItem(key);

    if (!data) {
      return null;
    }

    return JSON.parse(data) as ReturnValue;
  } catch (error: any) {
    console.error(error);
    if (feedback && typeof feedback.send === 'function') {
      feedback.send({
        type: 'issue',
        message: JSON.stringify({
          title: 'Error loading logs',
          description: error?.message,
          trace: error?.stack,
        }),
        email: 'team@pixood.app',
        source: 'error',
        onCancel: () => {},
        onOk: () => {},
      });
    }
    return null;
  }
};
