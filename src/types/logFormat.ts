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