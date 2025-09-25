import { z } from 'zod';

// Nouveau format de données pour l'export/stockage optimisé
export const CategorizedTagEntrySchema = z.object({
  type: z.string(), // Nom de la catégorie (ex: "Emotions", "Activities")
  entries: z.array(z.string()), // Liste des noms de tags sélectionnés
});

export const LogEntrySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{1,2}-\d{1,2}$/), // Format YYYY-M-D comme dans l'exemple
  type: z.literal('Mood'), // Préparé pour future extension
  scores: z.array(z.number()), // Array de scores pour future extension
  notes: z.string(), // Message/notes de l'utilisateur
  tags: z.array(CategorizedTagEntrySchema), // Tags organisés par catégories
});

export const LogExportDataSchema = z.array(LogEntrySchema);

// Types TypeScript
export type CategorizedTagEntry = z.infer<typeof CategorizedTagEntrySchema>;
export type LogEntry = z.infer<typeof LogEntrySchema>;
export type LogExportData = z.infer<typeof LogExportDataSchema>;

// Nouveau format d'export simplifié pour Pixels Visualiser
export const ExportEntrySchema = z.object({
  date: z.string(), // Format ISO 8601 (YYYY-MM-DDTHH:mm:ss.sssZ)
  score: z.array(z.number()), // Array de scores numériques
  note: z.string().optional(), // Message/notes optionnel
  tags: z.array(CategorizedTagEntrySchema), // Tags organisés par catégories
});

export const ExportDataSchema = z.array(ExportEntrySchema);

export type ExportEntry = z.infer<typeof ExportEntrySchema>;
export type ExportData = z.infer<typeof ExportDataSchema>;

// Utilitaire pour convertir le rating actuel en score numérique
export const RATING_TO_SCORE_MAPPING = {
  extremely_bad: 0,
  very_bad: 1,
  bad: 2,
  neutral: 3,
  good: 4,
  very_good: 5,
  extremely_good: 6,
} as const;

export const SCORE_TO_RATING_MAPPING = {
  0: 'extremely_bad',
  1: 'very_bad', 
  2: 'bad',
  3: 'neutral',
  4: 'good',
  5: 'very_good',
  6: 'extremely_good',
} as const;

// Fonction pour transformer les données internes vers le format d'export
import type { LogItem } from '../hooks/useLogs';
import type { Tag } from '../hooks/useTags';
import { LogItemSchema } from './index';

export function transformToExportFormat(items: LogItem[], tags: Tag[]): ExportData {
  // Créer un map des tags par ID pour un accès rapide
  const tagMap = new Map(tags.map(tag => [tag.id, tag]));
  
  return items.map(item => {
    // Transformer les tags en format catégorisé
    const categorizedTags: CategorizedTagEntry[] = [];
    
    if (item.tags && item.tags.length > 0) {
      // Grouper les tags par catégorie (pour l'instant une seule catégorie "Tags")
      const tagNames = item.tags
        .map(tagRef => tagMap.get(tagRef.id)?.title)
        .filter(Boolean) as string[];
      
      if (tagNames.length > 0) {
        categorizedTags.push({
          type: 'Tags',
          entries: tagNames
        });
      }
    }
    
    // Transformer l'émotions en tags aussi
    if (item.emotions && item.emotions.length > 0) {
      categorizedTags.push({
        type: 'Emotions',
        entries: item.emotions
      });
    }
    
    const exportEntry: ExportEntry = {
      date: item.dateTime, // Déjà en format ISO 8601
      score: [RATING_TO_SCORE_MAPPING[item.rating]], // Array avec un seul score pour l'instant
      note: item.message || undefined,
      tags: categorizedTags
    };
    
    return exportEntry;
  });
}