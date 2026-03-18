import { LogEntry, StoredLogEntrySchema } from "@/types/logFormat";
import { TagCategoriesState } from "@/types/tagCategories";
import { ImportData } from "./Import";
import { v4 as uuidv4 } from "uuid";
import _ from "lodash";


interface MigratedData extends ImportData {
    items: LogEntry[];
    tagCategories: Omit<TagCategoriesState, 'loaded'>;
}

const normalizeText = (value?: string) => (value || '').trim();
const normalizeKey = (value?: string) => normalizeText(value).toLowerCase();

export const migrateImportData = (data: ImportData): MigratedData => {
    let { items, settings, version } = data;
    const categoryByName = new Map<string, { id: string; name: string; createdAt: string }>();
    const categorizedTagByCategoryAndTitle = new Map<string, { id: string; categoryId: string; title: string; isArchived: boolean; createdAt: string }>();

    const getOrCreateCategory = (categoryName: string) => {
        const key = normalizeKey(categoryName);
        let category = categoryByName.get(key);

        if (!category) {
            category = {
                id: uuidv4(),
                name: categoryName,
                createdAt: new Date().toISOString(),
            };
            categoryByName.set(key, category);
        }

        return category;
    };

    const getOrCreateTag = (categoryId: string, rawTagTitle: string) => {
        const tagTitle = normalizeText(rawTagTitle);
        if (!tagTitle) return null;

        const tagKey = `${categoryId}|${normalizeKey(tagTitle)}`;
        let categorizedTag = categorizedTagByCategoryAndTitle.get(tagKey);

        if (!categorizedTag) {
            categorizedTag = {
                id: uuidv4(),
                categoryId,
                title: tagTitle,
                isArchived: false,
                createdAt: new Date().toISOString(),
            };
            categorizedTagByCategoryAndTitle.set(tagKey, categorizedTag);
        }

        return categorizedTag;
    };

    const newItems = (items as any[]).map((item) => {
        const tagRefs: { tagId: string }[] = [];

        for (const tagGroup of item.tags || []) {
            const categoryName = normalizeText(tagGroup.category);
            if (!categoryName) continue;

            const category = getOrCreateCategory(categoryName);

            for (const rawTagTitle of tagGroup.tags || []) {
                const categorizedTag = getOrCreateTag(category.id, rawTagTitle);
                if (!categorizedTag) continue;
                tagRefs.push({ tagId: categorizedTag.id });
            }
        }

        return StoredLogEntrySchema.parse({
            ...item,
            tags: _.uniqBy(tagRefs, 'tagId'),
        });
    });

    let _settings = _.omit(settings, 'tags');

    if (!_settings.actionsDone) _settings.actionsDone = [];

    const tagCategories = {
        categories: Array.from(categoryByName.values()),
        tags: Array.from(categorizedTagByCategoryAndTitle.values()),
        version: 1,
    };

    return {
        version: version || "2.0.0",
        items: newItems,
        settings: _settings,
        tagCategories,
    };
};