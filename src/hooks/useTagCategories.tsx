import { load, store } from '@/helpers/storage';
import { t } from '@/helpers/translation';
import { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from "react";
import { v4 as uuidv4 } from "uuid";
import { useLogState, useLogUpdater } from './useLogs';
import { useSettings } from './useSettings';
import {
    TagCategoriesState,
    TagCategoriesAction,
    TagCategory,
    CategorizedTag,
    TagCategoriesUpdater,
    DEFAULT_EMOTIONS_CATEGORY,
    DEFAULT_ACTIVITY_CATEGORY,
    TagSelection
} from '@/types/tagCategories';
import { EMOTIONS } from '@/components/Logger/config';

export const STORAGE_KEY = 'PIXEL_TRACKER_TAG_CATEGORIES';

// Contexts
const TagCategoriesStateContext = createContext({} as TagCategoriesState);
const TagCategoriesUpdaterContext = createContext({} as TagCategoriesUpdater);

// Reducer
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

        case 'MIGRATE_FROM_OLD_SYSTEM':
            // This action will be implemented to migrate from the old system
            return state;

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

// Default data generators
const generateDefaultEmotionsCategory = (): TagCategory => {
    const now = new Date().toISOString();
    return {
        id: uuidv4(),
        ...DEFAULT_EMOTIONS_CATEGORY,
        createdAt: now,
        updatedAt: now,
    };
};

const generateDefaultActivityCategory = (): TagCategory => {
    const now = new Date().toISOString();
    return {
        id: uuidv4(),
        ...DEFAULT_ACTIVITY_CATEGORY,
        name: t('tag_category_activities'),
        createdAt: now,
        updatedAt: now,
    };
};

// Convert emotions to categorized tags - Simplified version with 10 main emotions
const convertEmotionsToTags = (emotionsCategory: TagCategory): CategorizedTag[] => {
    const now = new Date().toISOString();

    // Selection of 10 representative main emotions
    const mainEmotions = [
        'happy',      // Happy
        'excited',    // Excited  
        'energized',  // Énergique
        'proud',      // Proud
        'hopeful',    // Hopeful
        'surprised',  // Surprised
        'angry',      // Angry
        'annoyed',    // Annoyed
        'sad',        // Sad
        'tired'       // Tired
    ];

    return EMOTIONS
        .filter(emotion => mainEmotions.includes(emotion.key))
        .map(emotion => ({
            id: uuidv4(),
            categoryId: emotionsCategory.id,
            title: emotion.label,
            color: emotionsCategory.color,
            isArchived: false,
            createdAt: now,
            updatedAt: now,
            emotionData: {
                key: emotion.key,
                category: emotion.category,
                description: emotion.description,
            },
        }));
};

// Initial state
const getInitialState = (): TagCategoriesState => {
    const emotionsCategory = generateDefaultEmotionsCategory();
    const activityCategory = generateDefaultActivityCategory();

    return {
        loaded: false,
        categories: [emotionsCategory, activityCategory],
        tags: [
            ...convertEmotionsToTags(emotionsCategory),
            // Some default activity tags
            {
                id: uuidv4(),
                categoryId: activityCategory.id,
                title: `${t('tags_default_1_title')} 🏡`,
                color: 'slate',
                isArchived: false,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
            {
                id: uuidv4(),
                categoryId: activityCategory.id,
                title: `${t('tags_default_2_title')} 🤝`,
                color: 'orange',
                isArchived: false,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
        ],
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
    const createCategory = useCallback(async (name: string, color: string, icon?: string): Promise<TagCategory> => {
        const now = new Date().toISOString();
        const newCategory: TagCategory = {
            id: uuidv4(),
            name,
            color: color as any,
            icon,
            isDefault: false,
            createdAt: now,
            updatedAt: now,
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
            updatedAt: new Date().toISOString(),
        };

        dispatch({ type: 'UPDATE_CATEGORY', payload: updatedCategory });
    }, [state.categories]);

    const deleteCategory = useCallback(async (id: string) => {
        const category = state.categories.find(c => c.id === id);
        if (!category || category.isDefault) return; // Do not delete default categories

        dispatch({ type: 'DELETE_CATEGORY', payload: id });
    }, [state.categories]);

    const createTag = useCallback(async (categoryId: string, title: string, color?: string): Promise<CategorizedTag> => {
        const category = state.categories.find(c => c.id === categoryId);
        if (!category) throw new Error('Category not found');

        const now = new Date().toISOString();
        const newTag: CategorizedTag = {
            id: uuidv4(),
            categoryId,
            title,
            color: (color || category.color) as any,
            isArchived: false,
            createdAt: now,
            updatedAt: now,
        };

        dispatch({ type: 'CREATE_TAG', payload: newTag });

        return newTag;
    }, [state.categories]);

    const updateTag = useCallback(async (id: string, updates: Partial<Omit<CategorizedTag, 'id' | 'createdAt' | 'updatedAt'>>) => {
        const tag = state.tags.find(t => t.id === id);
        if (!tag) return;

        const updatedTag: CategorizedTag = {
            ...tag,
            ...updates,
            updatedAt: new Date().toISOString(),
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

    const migrateFromOldSystem = useCallback(async () => {
        // This function will be implemented to migrate from the old useTags system
    }, []);

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
        migrateFromOldSystem,
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
        migrateFromOldSystem,
        importData,
        reset,
    ]);

    // Load from storage
    useEffect(() => {
        if (!settings.loaded) return;

        (async () => {
            const stored = await load<TagCategoriesState>(STORAGE_KEY);
            if (stored !== null) {
                dispatch({ type: 'LOAD_DATA', payload: stored });
            } else {
                // First launch, initialize with default data
                dispatch({ type: 'LOAD_DATA', payload: getInitialState() });
            }
        })();
    }, [settings.loaded]);

    // Save to storage
    useEffect(() => {
        if (state.loaded) {
            store<Omit<TagCategoriesState, 'loaded'>>(STORAGE_KEY, {
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

// Custom hooks
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

// Helper hooks
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