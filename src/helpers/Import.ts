import { ExportSettings } from '@/hooks/useSettings';
import { LogEntrySchema } from '@/types/logFormat';
import { z } from "zod";


export interface ImportData {
    version: string;
    items: unknown;
    settings: ExportSettings
}


const ExportSettingsSchema = z.object({
    palettePresetId: z.string().nullable(),
    customPalette: z.array(z.string()).nullable(),
    theme: z.enum(['light', 'dark', 'system']),
    reminderEnabled: z.boolean(),
    reminderTime: z.string(),
    actionsDone: z.array(z.object({
        title: z.string(),
        date: z.string(),
    }).strict()),
    steps: z.array(z.enum(['rating', 'tags', 'message', 'reminder'])),
}).strict();


export const PixoodSchema = z.object({
    version: z.string().optional(),
    items: z.array(LogEntrySchema),
    settings: ExportSettingsSchema,
}).strict();


const DEBUG = false;


export function getJSONSchemaType(json: any): 'pixood' | 'unknown' {
    const result = PixoodSchema.safeParse(json);

    if (!result.success && DEBUG) {
        console.error(result.error.issues)
    }

    return result.success ? 'pixood' : 'unknown';
}