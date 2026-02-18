// Removed AsyncStorage import
import AsyncStorage from '@react-native-async-storage/async-storage';
import { act, renderHook } from '@testing-library/react-hooks'
import { CalendarFiltersProvider, useCalendarFilters } from '../hooks/useCalendarFilters'
import { LogsProvider, LogsState } from '../hooks/useLogs'
import { SettingsProvider } from '../hooks/useSettings'
import { SETTINGS_STORAGE_KEY } from '@/constants/Config'
import { _generateItem } from './utils'

const wrapper = ({ children }) => (
    <SettingsProvider>
        <LogsProvider>
            <CalendarFiltersProvider>
                {children}
            </CalendarFiltersProvider>
        </LogsProvider>
    </SettingsProvider>
)

const _renderHook = () => {
    return renderHook(() => useCalendarFilters(), { wrapper })
}

const testItems: LogsState['items'] = [
    _generateItem({
        dateTime: '2022-01-01T12:00:00Z',
        rating: [3],
        notes: 'test message 🐶',
        tags: []
    }),
    _generateItem({
        dateTime: '2022-01-02T12:00:00Z',
        rating: [4],
        notes: '🦄🐶',
        tags: [{
            tagId: 't1',
        }, {
            tagId: 't4',
        }]
    }),
    _generateItem({
        dateTime: '2022-01-02T13:00:00Z',
        rating: [2],
        notes: '🕹',
        tags: [{
            tagId: 't1',
        }, {
            tagId: 't3',
        }]
    })
]

xdescribe('useCalendarFilters()', () => {

    afterEach(async () => {
        const keys = await AsyncStorage.getAllKeys()
        await AsyncStorage.multiRemove(keys)
    })

    test('should `set`', async () => {
        const hook = _renderHook()
        await hook.waitForNextUpdate()

        const { set } = hook.result.current

        await act(() => {
            set({
                text: 'test',
                ratings: [3],
                tagIds: ['1'],
            })
        })

        expect(hook.result.current.data.text).toBe('test')
        expect(hook.result.current.data.ratings).toEqual([3])
        expect(hook.result.current.data.tagIds).toEqual(['1'])
        expect(hook.result.current.data.filterCount).toBe(3)
        expect(hook.result.current.data.isFiltering).toBe(true)
    })

    test('should `reset`', async () => {
        const hook = _renderHook()
        await hook.waitForNextUpdate()

        const { set, reset } = hook.result.current

        await act(() => {
            set({
                text: 'test',
                ratings: [3],
                tagIds: ['1'],
            })
        })

        await act(() => {
            reset()
        })

        expect(hook.result.current.data.text).toBe('')
        expect(hook.result.current.data.ratings).toEqual([])
        expect(hook.result.current.data.tagIds).toEqual([])
        expect(hook.result.current.data.filterCount).toBe(0)
        expect(hook.result.current.data.isFiltering).toBe(false)
    })

    test('should `open`', async () => {
        const hook = _renderHook()
        await hook.waitForNextUpdate()

        const { open } = hook.result.current

        await act(() => {
            open()
        })

        expect(hook.result.current.isOpen).toBe(true)
    })

    test('should `close`', async () => {
        const hook = _renderHook()
        await hook.waitForNextUpdate()

        const { open, close } = hook.result.current

        await act(() => {
            open()
        })

        await act(() => {
            close()
        })

        expect(hook.result.current.isOpen).toBe(false)
    })

    test('should filter for `ratings`', async () => {
        AsyncStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify({ items: testItems }))

        const hook = _renderHook()
        await hook.waitForNextUpdate()

        const { set } = hook.result.current

        await act(() => {
            set({
                text: '',
                ratings: [5],
                tagIds: [],
            })
        })

        expect(hook.result.current.data.filteredItems).toEqual([
            testItems[1]
        ])
    })

    test('should filter for `tags`', async () => {
        AsyncStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify({ items: testItems }))

        const hook = _renderHook()
        await hook.waitForNextUpdate()

        const { set } = hook.result.current

        await act(() => {
            set({
                text: '',
                ratings: [],
                tagIds: ['t3'],
            })
        })

        expect(hook.result.current.data.filteredItems).toEqual([
            testItems[2]
        ])

        await act(() => {
            set({
                text: '',
                ratings: [],
                tagIds: ['t1'],
            })
        })

        expect(hook.result.current.data.filteredItems).toEqual([
            testItems[1],
            testItems[2]
        ])
    })

    test('should filter for `text`', async () => {
        AsyncStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify({ items: testItems }))

        const hook = _renderHook()
        await hook.waitForNextUpdate()

        const { set } = hook.result.current

        await act(() => {
            set({
                text: '🐶',
                ratings: [],
                tagIds: [],
            })
        })

        expect(hook.result.current.data.filteredItems).toEqual([
            testItems[0],
            testItems[1]
        ])

        await act(() => {
            set({
                text: '🦄',
                ratings: [],
                tagIds: [],
            })
        })

        expect(hook.result.current.data.filteredItems).toEqual([
            testItems[1]
        ])
    })

    test('should filter for `text` and `ratings`', async () => {
        AsyncStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify({ items: testItems }))

        const hook = _renderHook()
        await hook.waitForNextUpdate()

        const { set } = hook.result.current

        await act(() => {
            set({
                text: '🐶',
                ratings: [5],
                tagIds: [],
            })
        })

        expect(hook.result.current.data.filteredItems).toEqual([
            testItems[1]
        ])
    })

    test('should filter for `text` and `tags`', async () => {
        AsyncStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify({ items: testItems }))

        const hook = _renderHook()
        await hook.waitForNextUpdate()

        const { set } = hook.result.current

        await act(() => {
            set({
                text: '🐶',
                ratings: [],
                tagIds: ['t1'],
            })
        })

        expect(hook.result.current.data.filteredItems).toEqual([
            testItems[1]
        ])
    })

})