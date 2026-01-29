import { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from "react";
import { TAGS_STORAGE_KEY, DEFAULT_TAGS } from '@/constants/Config';
import { useLogState, useLogUpdater } from './useLogs';
import { load, store } from '@/helpers/storage';
import { useSettings } from './useSettings';
import { t } from '@/helpers/translation';
import { v4 as uuidv4 } from "uuid";
import {
    TagCategoriesState,
    TagCategoriesAction,
    TagCategory,
    CategorizedTag,
    TagCategoriesUpdater,
} from '@/types/tagCategories';



const TagCategoriesStateContext = createContext({} as TagCategoriesState);
const TagCategoriesUpdaterContext = createContext({} as TagCategoriesUpdater);


const tagCategoriesReducer = (state: TagCategoriesState, action: TagCategoriesAction): TagCategoriesState => {
    switch (action.type) {
        case 'LOAD_DATA':
            return {
                ...action.payload,
                loaded: true,
            };

        case 'CREATE_CATEGORY':
            return {
                ...state,
                categories: [...state.categories, action.payload],
            };

        case 'UPDATE_CATEGORY':
            return {
                ...state,
                categories: state.categories.map(cat =>
                    cat.id === action.payload.id ? action.payload : cat
                ),
            };

        case 'DELETE_CATEGORY':
            return {
                ...state,
                categories: state.categories.filter(cat => cat.id !== action.payload),
                tags: state.tags.filter(tag => tag.categoryId !== action.payload),
            };

        case 'CREATE_TAG':
            return {
                ...state,
                tags: [...state.tags, action.payload],
            };

        case 'UPDATE_TAG':
            return {
                ...state,
                tags: state.tags.map(tag =>
                    tag.id === action.payload.id ? action.payload : tag
                ),
            };

        case 'DELETE_TAG':
            return {
                ...state,
                tags: state.tags.filter(tag => tag.id !== action.payload),
            };

        case 'RESET':
            return {
                loaded: true,
                categories: [],
                tags: [],
                version: 1,
            };

        default:
            return state;
    }
};


const getInitialState = (): TagCategoriesState => {
    return {
        loaded: false,
        categories: [],
        tags: [],
        version: 1,
    };
};


// Provider Component
export function TagCategoriesProvider({ children }: { children: React.ReactNode }) {
    const { settings } = useSettings();
    const logsUpdater = useLogUpdater();
    const logsState = useLogState();

    const [state, dispatch] = useReducer(tagCategoriesReducer, getInitialState());

    // Updater functions
    const createCategory = useCallback(async (name: string, icon?: string): Promise<TagCategory> => {
        const now = new Date().toISOString();
        const newCategory: TagCategory = {
            id: uuidv4(),
            name,
            createdAt: now,
        };

        dispatch({ type: 'CREATE_CATEGORY', payload: newCategory });

        return newCategory;
    }, []);

    const updateCategory = useCallback(async (id: string, updates: Partial<Omit<TagCategory, 'id' | 'createdAt' | 'updatedAt'>>) => {
        const category = state.categories.find(c => c.id === id);
        if (!category) return;

        const updatedCategory: TagCategory = {
            ...category,
            ...updates,
        };

        dispatch({ type: 'UPDATE_CATEGORY', payload: updatedCategory });
    }, [state.categories]);


    const deleteCategory = useCallback(async (id: string) => {
        const category = state.categories.find(c => c.id === id);
        dispatch({ type: 'DELETE_CATEGORY', payload: id });
    }, [state.categories]);


    const createTag = useCallback(async (categoryId: string, title: string): Promise<CategorizedTag> => {
        const now = new Date().toISOString();
        const newTag: CategorizedTag = {
            id: uuidv4(),
            categoryId,
            title,
            isArchived: false,
            createdAt: now,
        };

        dispatch({ type: 'CREATE_TAG', payload: newTag });

        return newTag;
    }, []);


    const updateTag = useCallback(async (id: string, updates: Partial<Omit<CategorizedTag, 'id' | 'createdAt' | 'updatedAt'>>) => {
        const tag = state.tags.find(t => t.id === id);
        if (!tag) return;

        const updatedTag: CategorizedTag = {
            ...tag,
            ...updates,
        };

        dispatch({ type: 'UPDATE_TAG', payload: updatedTag });
    }, [state.tags]);


    const deleteTag = useCallback(async (id: string) => {
        dispatch({ type: 'DELETE_TAG', payload: id });

        // Delete the tag from existing logs
        const newItems = logsState.items.map((item) => {
            if (item.tags.some((tag: any) => tag.id === id)) {
                const filteredTags = item.tags.filter((tag: any) => tag.id !== id);
                return { ...item, tags: filteredTags };
            }
            return item;
        });

        logsUpdater.updateLogs(newItems);
    }, [logsState.items, logsUpdater]);


    const archiveTag = useCallback(async (id: string) => {
        await updateTag(id, { isArchived: true });
    }, [updateTag]);


    const importData = useCallback(async (data: TagCategoriesState) => {
        dispatch({ type: 'LOAD_DATA', payload: data });
    }, []);


    const reset = useCallback(async () => {
        dispatch({ type: 'RESET' });
    }, []);


    const updaterValue: TagCategoriesUpdater = useMemo(() => ({
        createCategory,
        updateCategory,
        deleteCategory,
        createTag,
        updateTag,
        deleteTag,
        archiveTag,
        importData,
        reset,
    }), [
        createCategory,
        updateCategory,
        deleteCategory,
        createTag,
        updateTag,
        deleteTag,
        archiveTag,
        importData,
        reset,
    ]);


    // Load from storage
    useEffect(() => {
        if (!settings.loaded) return;

        (async () => {
            const stored = await load<TagCategoriesState>(TAGS_STORAGE_KEY);
            if (stored !== null) {
                // Already has data, just load it (don't override with defaults)
                dispatch({ type: 'LOAD_DATA', payload: stored });
            } 
            else {
                // First launch: initialize with default data only once
                const initialState = getInitialState();
                dispatch({ type: 'LOAD_DATA', payload: initialState });
            }
        })();
    }, [settings.loaded]);


    // Save to storage
    useEffect(() => {
        if (state.loaded) {
            store<Omit<TagCategoriesState, 'loaded'>>(TAGS_STORAGE_KEY, {
                categories: state.categories,
                tags: state.tags,
                version: state.version,
            });
        }
    }, [state]);


    return (
        <TagCategoriesStateContext.Provider value={state}>
            <TagCategoriesUpdaterContext.Provider value={updaterValue}>
                {children}
            </TagCategoriesUpdaterContext.Provider>
        </TagCategoriesStateContext.Provider>
    );
}


export function useTagCategoriesState(): TagCategoriesState {
    const context = useContext(TagCategoriesStateContext);
    if (context === undefined) {
        throw new Error('useTagCategoriesState must be used within a TagCategoriesProvider');
    }
    return context;
}


export function useTagCategoriesUpdater(): TagCategoriesUpdater {
    const context = useContext(TagCategoriesUpdaterContext);
    if (context === undefined) {
        throw new Error('useTagCategoriesUpdater must be used within a TagCategoriesProvider');
    }
    return context;
}


export function useTagsByCategory(categoryId: string): CategorizedTag[] {
    const { tags } = useTagCategoriesState();
    return useMemo(() =>
        tags.filter(tag => tag.categoryId === categoryId && !tag.isArchived),
        [tags, categoryId]
    );
}


export function useAvailableCategories(): TagCategory[] {
    const { categories } = useTagCategoriesState();
    return useMemo(() => categories, [categories]);
}