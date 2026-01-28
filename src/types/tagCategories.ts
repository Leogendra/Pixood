import { z } from "zod";

// Type for a tag category
export const TagCategorySchema = z.object({
    id: z.string().uuid(),
    name: z.string().min(1).max(50),
    icon: z.string().optional(), // Emoji or icon name
    isDefault: z.boolean().default(false), // True for the default "Emotions" category
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
});

export type TagCategory = z.infer<typeof TagCategorySchema>;

// Type for a tag in a category
export const CategorizedTagSchema = z.object({
    id: z.string().uuid(),
    categoryId: z.string().uuid(),
    title: z.string().min(1).max(50),
    isArchived: z.boolean().default(false),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
    // For migrated emotions
    emotionData: z.object({
        key: z.string(),
        category: z.enum(["very_bad", "bad", "neutral", "good", "very_good"]),
        description: z.string().optional(),
    }).optional(),
});

export type CategorizedTag = z.infer<typeof CategorizedTagSchema>;

// Reference to a tag selected in a log
export const TagSelectionSchema = z.object({
    tagId: z.string().uuid(),
    categoryId: z.string().uuid(),
});

export type TagSelection = z.infer<typeof TagSelectionSchema>;

// Global state of the tag categories system
export interface TagCategoriesState {
    loaded: boolean;
    categories: TagCategory[];
    tags: CategorizedTag[];
    version: number; // For migration
}

// Actions for the reducer
export type TagCategoriesAction =
    | { type: 'LOAD_DATA'; payload: TagCategoriesState }
    | { type: 'CREATE_CATEGORY'; payload: TagCategory }
    | { type: 'UPDATE_CATEGORY'; payload: TagCategory }
    | { type: 'DELETE_CATEGORY'; payload: string }
    | { type: 'CREATE_TAG'; payload: CategorizedTag }
    | { type: 'UPDATE_TAG'; payload: CategorizedTag }
    | { type: 'DELETE_TAG'; payload: string }
    | { type: 'MIGRATE_FROM_OLD_SYSTEM'; payload: { oldTags: any[], oldEmotions: any[] } }
    | { type: 'RESET' };

// Interface for CRUD operations
export interface TagCategoriesUpdater {
    // Categories
    createCategory: (name: string, icon?: string) => Promise<TagCategory>;
    updateCategory: (id: string, updates: Partial<Omit<TagCategory, 'id' | 'createdAt' | 'updatedAt'>>) => Promise<void>;
    deleteCategory: (id: string) => Promise<void>;

    // Tags
    createTag: (categoryId: string, title: string) => Promise<CategorizedTag>;
    updateTag: (id: string, updates: Partial<Omit<CategorizedTag, 'id' | 'createdAt' | 'updatedAt'>>) => Promise<void>;
    deleteTag: (id: string) => Promise<void>;
    archiveTag: (id: string) => Promise<void>;

    // Migration and import/export
    migrateFromOldSystem: () => Promise<void>;
    importData: (data: TagCategoriesState) => Promise<void>;
    reset: () => Promise<void>;
}

// For selections in the user interface
export interface CategorySelection {
    category: TagCategory;
    selectedTags: CategorizedTag[];
    availableTags: CategorizedTag[];
}

// Default configuration
export const DEFAULT_EMOTIONS_CATEGORY: Omit<TagCategory, 'id' | 'createdAt' | 'updatedAt'> = {
    name: 'Emotions',
    isDefault: true,
};

export const DEFAULT_ACTIVITY_CATEGORY: Omit<TagCategory, 'id' | 'createdAt' | 'updatedAt'> = {
    name: 'Activités',
    isDefault: false,
};