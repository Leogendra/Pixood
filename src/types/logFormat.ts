import { NUMBER_OF_RATINGS } from "@/constants/Config";
import { isISODate } from "@/lib/utils";
import { z } from "zod";




export const MetricsSchema = z.record(
    z.string().min(1),
    z.array(z.number().int())
);


export const TagRefSchema = z.object({
    tagId: z.string().min(1),
});


export const LogEntrySchema = z.object({
    id: z.string().uuid(),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    dateTime: z.string().refine((value) => { return isISODate(value) }),
    rating: z.array(z.number().int().min(1).max(NUMBER_OF_RATINGS)),
    notes: z.string().default(""),
    metrics: MetricsSchema.default({}),
    tags: z.array(TagRefSchema).default([]),
});


export type LogEntry = z.infer<typeof LogEntrySchema>;