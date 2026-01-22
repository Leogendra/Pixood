import { z } from "zod";




export const MetricValueSchema = z.union([
    z.number(),
    z.string(),
    z.boolean(),
]);


export const MetricSchema = z.object({
    name: z.string().min(1),
    version: z.number().int().min(1).default(1),
    value: z.array(MetricValueSchema),
});


export const TagRefSchema = z.object({
    tagId: z.string().min(1),
});


export const LogEntrySchema = z.object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    rating: z.array(z.number().int()),
    notes: z.string().default(""),
    metrics: z.array(MetricSchema).optional(),
    tags: z.array(TagRefSchema).default([]),
});


export type LogEntry = z.infer<typeof LogEntrySchema>;