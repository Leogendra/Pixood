import { TAG_COLOR_NAMES } from '@/constants/Config';
import { z } from "zod";

// Type pour une catégorie de tags
export const TagCategorySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(50),
  color: z.enum(TAG_COLOR_NAMES as [string, ...string[]]),
  icon: z.string().optional(), // Emoji ou nom d'icône
  isDefault: z.boolean().default(false), // True pour la catégorie "Émotions" par défaut
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type TagCategory = z.infer<typeof TagCategorySchema>;

// Type pour un tag dans une catégorie
export const CategorizedTagSchema = z.object({
  id: z.string().uuid(),
  categoryId: z.string().uuid(),
  title: z.string().min(1).max(50),
  color: z.enum(TAG_COLOR_NAMES as [string, ...string[]]),
  isArchived: z.boolean().default(false),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  // Pour les émotions migrées
  emotionData: z.object({
    key: z.string(),
    category: z.enum(["very_bad", "bad", "neutral", "good", "very_good"]),
    description: z.string().optional(),
  }).optional(),
});

export type CategorizedTag = z.infer<typeof CategorizedTagSchema>;

// Référence à un tag sélectionné dans un log
export const TagSelectionSchema = z.object({
  tagId: z.string().uuid(),
  categoryId: z.string().uuid(),
});

export type TagSelection = z.infer<typeof TagSelectionSchema>;

// État global du système de catégories de tags
export interface TagCategoriesState {
  loaded: boolean;
  categories: TagCategory[];
  tags: CategorizedTag[];
  version: number; // Pour la migration
}

// Actions pour le reducer
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

// Interface pour les opérations CRUD
export interface TagCategoriesUpdater {
  // Catégories
  createCategory: (name: string, color: string, icon?: string) => Promise<TagCategory>;
  updateCategory: (id: string, updates: Partial<Omit<TagCategory, 'id' | 'createdAt' | 'updatedAt'>>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  
  // Tags
  createTag: (categoryId: string, title: string, color?: string) => Promise<CategorizedTag>;
  updateTag: (id: string, updates: Partial<Omit<CategorizedTag, 'id' | 'createdAt' | 'updatedAt'>>) => Promise<void>;
  deleteTag: (id: string) => Promise<void>;
  archiveTag: (id: string) => Promise<void>;
  
  // Migration et import/export
  migrateFromOldSystem: () => Promise<void>;
  importData: (data: TagCategoriesState) => Promise<void>;
  reset: () => Promise<void>;
}

// Pour les sélections dans l'interface utilisateur
export interface CategorySelection {
  category: TagCategory;
  selectedTags: CategorizedTag[];
  availableTags: CategorizedTag[];
}

// Configuration par défaut
export const DEFAULT_EMOTIONS_CATEGORY: Omit<TagCategory, 'id' | 'createdAt' | 'updatedAt'> = {
  name: 'Émotions',
  color: 'purple',
  icon: '😊',
  isDefault: true,
};

export const DEFAULT_ACTIVITY_CATEGORY: Omit<TagCategory, 'id' | 'createdAt' | 'updatedAt'> = {
  name: 'Activités',
  color: 'blue', 
  icon: '🎯',
  isDefault: false,
};