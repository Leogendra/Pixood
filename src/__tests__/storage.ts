import AsyncStorage from '@react-native-async-storage/async-storage';
import { load, store } from '../helpers/storage';

const TEST_KEY = 'test-key';

describe('Storage', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it('should `load`', async () => {
    await AsyncStorage.setItem(TEST_KEY, '{"test": "test"}');
    const result = await load(TEST_KEY, { send: () => {} });
    expect(result).toEqual({ test: 'test' });
  });

  it('should `load` with null', async () => {
    const result = await load(TEST_KEY, { send: () => {} });
    expect(result).toEqual(null);
  })

  it('should `store`', async () => {
    await store(TEST_KEY, { foo: '123' });
    expect(await AsyncStorage.getItem(TEST_KEY)).toEqual('{"foo":"123"}');
  })

})
    