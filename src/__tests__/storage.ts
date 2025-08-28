// Removed AsyncStorage import
import { load, store } from '../helpers/storage';

const TEST_KEY = 'test-key';

describe('Storage', () => {
  it('should `load`', async () => {
  localStorage.setItem(TEST_KEY, '{"test": "test"}');
  const result = await load(TEST_KEY, { send: () => {} });
    expect(result).toEqual({ test: 'test' });
  });

  it('should `load` with null', async () => {
  const result = await load(TEST_KEY, { send: () => {} });
    expect(result).toEqual(null);
  })

  it('should `store`', async () => {
  await store(TEST_KEY, { foo: '123' });
  expect(localStorage.getItem(TEST_KEY)).toEqual('{"foo":"123"}');
  })

})
    