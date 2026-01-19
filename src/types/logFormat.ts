import { z } from 'zod';

export const CategorizedTagEntrySchema = z.object({
    type: z.string(), // Category name (ex: "Emotions", "Activities")
    entries: z.array(z.string()), // List of selected tag names
});

export const LogEntrySchema = z.object({
    date: z.string().regex(/^\d{4}-\d{1,2}-\d{1,2}$/), // Format YYYY-M-D as in the example
    type: z.literal('Mood'), // Prepared for future extension
    scores: z.array(z.number()), // Array of scores for future extension
    notes: z.string(), // User message/notes
    tags: z.array(CategorizedTagEntrySchema), // Tags organized by categories
});

export const LogExportDataSchema = z.array(LogEntrySchema);

// TypeScript types
export type CategorizedTagEntry = z.infer<typeof CategorizedTagEntrySchema>;
export type LogEntry = z.infer<typeof LogEntrySchema>;
export type LogExportData = z.infer<typeof LogExportDataSchema>;

// New simplified export format for Pixels Visualizer
export const ExportEntrySchema = z.object({
    date: z.string(), // ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ)
    score: z.array(z.number()), // Array of numeric scores
    note: z.string().optional(), // Optional message/notes
    tags: z.array(CategorizedTagEntrySchema), // Tags organisés par catégories
});

export const ExportDataSchema = z.array(ExportEntrySchema);

export type ExportEntry = z.infer<typeof ExportEntrySchema>;
export type ExportData = z.infer<typeof ExportDataSchema>;

// Utility to convert current rating to numeric score
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

// Function to transform internal data to export format
import type { LogItem } from '../hooks/useLogs';
import type { Tag } from '../hooks/useTags';
import { LogItemSchema } from './index';

export function transformToExportFormat(items: LogItem[], tags: Tag[]): ExportData {
    // Create a map of tags by ID for quick access
    const tagMap = new Map(tags.map(tag => [tag.id, tag]));

    return items.map(item => {
        // Transform tags to categorized format
        const categorizedTags: CategorizedTagEntry[] = [];

        if (item.tags && item.tags.length > 0) {
            // Group tags by category (currently only one "Tags" category)
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

        // Transform emotions to tags as well
        if (item.emotions && item.emotions.length > 0) {
            categorizedTags.push({
                type: 'Emotions',
                entries: item.emotions
            });
        }

        const exportEntry: ExportEntry = {
            date: item.dateTime, // Déjà en format ISO 8601
            score: [RATING_TO_SCORE_MAPPING[item.rating]], // Array with a single score for now
            note: item.message || undefined,
            tags: categorizedTags
        };

        return exportEntry;
    });
}