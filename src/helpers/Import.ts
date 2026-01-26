import { LogEntry } from '@/types/logFormat';
import { LogsState } from '@/hooks/useLogs';
import { TAG_COLOR_NAMES } from '@/constants/Config';
import { ExportSettings } from '@/hooks/useSettings';
import { Tag } from "@/hooks/useTags";
import { z } from "zod";


export interface ImportData {
    version: string;
    items: LogsState["items"] | {
        [key: string]: LogsState["items"][number];
    };
    tags?: Tag[];
    settings: ExportSettings
}

// TODO: Update pixySchema to match new LogEntry structure with:
// - dateTime (ISO string)
// - rating (number[])
// - notes (string)
// - metrics (optional)
// - tags with tagId instead of id
export const pixySchema = z.object({
    version: z.string().optional(),
    items: z.array(z.any()), // Simplified - will be validated during import
    tags: z.array(z.object({
        id: z.string(),
        title: z.string(),
        color: z.string()
    })).optional(),
    settings: z.any() // Simplified
}).strict();

const DEBUG = false;

export function getJSONSchemaType(json: any): 'pixy' | 'unknown' {
    const result = pixySchema.safeParse(json);

    if (!result.success && DEBUG) {
        console.log(result.error.issues)
    }

    return result.success ? 'pixy' : 'unknown';
}


