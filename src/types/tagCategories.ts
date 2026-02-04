import { z } from "zod";




export const TagCategorySchema = z.object({
    id: z.string().uuid(),
    name: z.string().min(1).max(50),
    createdAt: z.string().datetime(),
});


export const CategorizedTagSchema = z.object({
    id: z.string().uuid(),
    categoryId: z.string().uuid(),
    title: z.string().min(1).max(50),
    isArchived: z.boolean().default(false),
    createdAt: z.string().datetime(),
});


export const TagSelectionSchema = z.object({
    tagId: z.string().uuid(),
    categoryId: z.string().uuid(),
});


export type TagCategory = z.infer<typeof TagCategorySchema>;
export type CategorizedTag = z.infer<typeof CategorizedTagSchema>;
export type TagSelection = z.infer<typeof TagSelectionSchema>;


// Global state of the tag categories system
export interface TagCategoriesState {
    loaded: boolean;
    categories: TagCategory[];
    tags: CategorizedTag[];
    version: number;
}


export type TagCategoriesAction =
    | { type: 'LOAD_DATA'; payload: TagCategoriesState }
    | { type: 'CREATE_CATEGORY'; payload: TagCategory }
    | { type: 'UPDATE_CATEGORY'; payload: TagCategory }
    | { type: 'DELETE_CATEGORY'; payload: string }
    | { type: 'CREATE_TAG'; payload: CategorizedTag }
    | { type: 'UPDATE_TAG'; payload: CategorizedTag }
    | { type: 'DELETE_TAG'; payload: string }
    | { type: 'RESET' };


export interface TagCategoriesUpdater {
    // Categories
    createCategory: (name: string, icon?: string) => Promise<TagCategory>;
    updateCategory: (id: string, updates: Partial<Omit<TagCategory, 'id' | 'createdAt'>>) => Promise<void>;
    deleteCategory: (id: string) => Promise<void>;

    // Tags
    createTag: (categoryId: string, title: string) => Promise<CategorizedTag>;
    updateTag: (id: string, updates: Partial<Omit<CategorizedTag, 'id' | 'createdAt'>>) => Promise<void>;
    deleteTag: (id: string) => Promise<void>;
    archiveTag: (id: string) => Promise<void>;

    importData: (data: TagCategoriesState) => Promise<void>;
    reset: () => Promise<void>;
}


export interface CategorySelection {
    category: TagCategory;
    selectedTags: CategorizedTag[];
    availableTags: CategorizedTag[];
}