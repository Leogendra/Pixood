import { askToImport, askToReset, showImportError, showImportSuccess, showResetSuccess } from "@/helpers/prompts";
import { LOGS_STORAGE_KEY, SETTINGS_STORAGE_KEY, TAGS_STORAGE_KEY, TAG_CATEGORIES_STORAGE_KEY } from "@/constants/Config";
import { useTagCategoriesState, useTagCategoriesUpdater } from "./useTagCategories";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LogsState, useLogState, useLogUpdater } from "./useLogs";
import { getJSONSchemaType, ImportData } from "@/helpers/Import";
import { ExportSettings, useSettings } from "./useSettings";
import { TagCategoriesState } from "@/types/tagCategories";
import { migrateImportData } from "@/helpers/migration";
import * as DocumentPicker from "expo-document-picker";
import { Alert, Platform } from "react-native";
import * as FileSystem from "expo-file-system";
import { t } from "@/helpers/translation";
import * as Sharing from "expo-sharing";
import dayjs from "dayjs";

type ResetType = "factory" | "data"

// Simplified export format builder using current in-memory state
const transformToExportFormat = (
    items: LogsState["items"],
    settings: ExportSettings,
    tagCategoriesState: TagCategoriesState,
) => {
    const categoryById = new Map(tagCategoriesState.categories.map(category => [category.id, category]));
    const categorizedTagById = new Map(tagCategoriesState.tags.map(tag => [tag.id, tag]));

    const formattedItems = items.map((item) => {
        const groups = new Map<string, Set<string>>();

        for (const tagRef of item.tags || []) {
            const categorizedTag = categorizedTagById.get(tagRef.tagId);
            if (!categorizedTag) continue;

            const categoryName = categoryById.get(categorizedTag.categoryId)?.name;
            if (!categoryName) continue;

            const current = groups.get(categoryName) || new Set<string>();
            current.add(categorizedTag.title);
            groups.set(categoryName, current);
        }

        return {
            ...item,
            tags: Array.from(groups.entries()).map(([category, tagSet]) => ({
                category,
                tags: Array.from(tagSet.values()),
            })),
        };
    });

    return {
        items: formattedItems,
        settings,
    };
};

const normalize = (value?: string) => (value || '').trim().toLowerCase();


export const useDatagate = (): {
    openExportDialog: () => Promise<void>;
    openImportDialog: () => Promise<void>;
    import: (data: ImportData, options: { muted: boolean }) => Promise<void>;
    openDangerousImportDirectlyToAsyncStorageDialog: () => Promise<void>;
    openResetDialog: (type: ResetType) => Promise<void>;
} => {
    const logState = useLogState();
    const logUpdater = useLogUpdater();
    const tagCategoriesState = useTagCategoriesState();
    const tagCategoriesUpdater = useTagCategoriesUpdater();
    const { resetSettings, importSettings, settings } = useSettings();


    const dangerouslyImportDirectlyToAsyncStorage = async (data: ImportData) => {
        await AsyncStorage.multiRemove([
            LOGS_STORAGE_KEY,
            SETTINGS_STORAGE_KEY,
            TAG_CATEGORIES_STORAGE_KEY,
            TAGS_STORAGE_KEY,
        ]);

        await AsyncStorage.setItem(
            LOGS_STORAGE_KEY,
            JSON.stringify({
                items: data.items,
            })
        );

        await AsyncStorage.setItem(
            SETTINGS_STORAGE_KEY,
            JSON.stringify({
                ...data.settings,
                actionsDone: [{
                    date: new Date().toISOString(),
                    title: 'onboarding',
                }],
            })
        );
    };

    const _import = async (data: ImportData, options: { muted: boolean } = { muted: false }) => {
        const jsonSchemaType = getJSONSchemaType(data);

        if (jsonSchemaType === "pixood") {
            const migratedData = migrateImportData(data);
            const incomingTagCategories = migratedData.tagCategories;
            let mergedTagCategories = {
                categories: [...tagCategoriesState.categories],
                tags: [...tagCategoriesState.tags],
                version: Math.max(tagCategoriesState.version || 1, incomingTagCategories?.version || 1),
            };

            if (incomingTagCategories) {
                const categoryIdRemap = new Map<string, string>();
                const existingCategoriesByName = new Map(
                    mergedTagCategories.categories.map(category => [normalize(category.name), category])
                );

                for (const importedCategory of incomingTagCategories.categories) {
                    const key = normalize(importedCategory.name);
                    const existingCategory = existingCategoriesByName.get(key);

                    if (existingCategory) {
                        categoryIdRemap.set(importedCategory.id, existingCategory.id);
                    }
                    else {
                        mergedTagCategories.categories.push(importedCategory);
                        existingCategoriesByName.set(key, importedCategory);
                        categoryIdRemap.set(importedCategory.id, importedCategory.id);
                    }
                }

                const existingTagsByCategoryAndTitle = new Map(
                    mergedTagCategories.tags.map(tag => [`${tag.categoryId}|${normalize(tag.title)}`, tag])
                );
                const tagIdRemap = new Map<string, string>();

                for (const importedTag of incomingTagCategories.tags) {
                    const targetCategoryId = categoryIdRemap.get(importedTag.categoryId) || importedTag.categoryId;
                    const key = `${targetCategoryId}|${normalize(importedTag.title)}`;
                    const existingTag = existingTagsByCategoryAndTitle.get(key);

                    if (existingTag) {
                        tagIdRemap.set(importedTag.id, existingTag.id);
                        continue;
                    }

                    const nextTag = {
                        ...importedTag,
                        categoryId: targetCategoryId,
                    };

                    mergedTagCategories.tags.push(nextTag);
                    existingTagsByCategoryAndTitle.set(key, nextTag);
                    tagIdRemap.set(importedTag.id, nextTag.id);
                }

                migratedData.items = migratedData.items.map((item) => ({
                    ...item,
                    tags: item.tags.map((tag) => ({
                        tagId: tagIdRemap.get(tag.tagId) || tag.tagId,
                    })),
                }));
            }

            logUpdater.import({
                items: migratedData.items,
            });
            await tagCategoriesUpdater.importData({
                loaded: true,
                categories: mergedTagCategories.categories,
                tags: mergedTagCategories.tags,
                version: mergedTagCategories.version,
            });
            importSettings(migratedData.settings);
            if (!options.muted) showImportSuccess()
        } 
    else {
            console.error('import failed, json schema:', jsonSchemaType);
            if (!options.muted) showImportError()
        }
    };

    const reset = () => {
        logUpdater.reset();
        tagCategoriesUpdater.reset();
    }

    const factoryReset = () => {
        reset()
        resetSettings();
    };

    const openImportDialog = async (): Promise<void> => {
        return askToImport()
            .then(async () => {
                try {
                    const doc = await DocumentPicker.getDocumentAsync({
                        type: "application/json",
                        copyToCacheDirectory: true,
                    });

                    if (doc.type === "success") {
                        const contents = await FileSystem.readAsStringAsync(doc.uri);
                        const data = JSON.parse(contents);

                        _import(data);
                    }
                } catch (error) {
                    showImportError()
                }
            })
    };

    const openResetDialog = async (type: ResetType) => {
        const resetFn = type === "factory" ? factoryReset : reset;

        if (Platform.OS === "web") {
            resetFn()
            alert(t("reset_data_success_message"));
            return Promise.resolve();
        }

        return askToReset<ResetType>(type)
            .then(() => {
                resetFn()
                showResetSuccess<ResetType>(type)
            })
            .catch(() => {
            })
    };

    const openExportDialog = async () => {
        // Use the new simplified export format
        const data = transformToExportFormat(logState.items, settings, tagCategoriesState);


        if (Platform.OS === "web") {
            return Alert.alert("Not supported on web");
        }

        const filename = `Pixood${__DEV__ ? '-DEV' : ''}-export-${dayjs().format("YY-MM-DD_HH-mm")}.json`;

        await FileSystem.writeAsStringAsync(
            FileSystem.documentDirectory + filename,
            JSON.stringify(data, null, 2)
        );

        if (!(await Sharing.isAvailableAsync())) {
            alert(t("export_failed_title"));
            return;
        }

        return Sharing.shareAsync(FileSystem.documentDirectory + filename);
    };

    const openDangerousImportDirectlyToAsyncStorageDialog = async () => {
        const doc = await DocumentPicker.getDocumentAsync({
            type: "application/json",
            copyToCacheDirectory: true,
        });

        if (doc.type === "success") {
            const contents = await FileSystem.readAsStringAsync(doc.uri);
            const data = JSON.parse(contents);
            dangerouslyImportDirectlyToAsyncStorage(data);
        }
    };

    return {
        openExportDialog,
        openImportDialog,
        openResetDialog,
        import: _import,
        openDangerousImportDirectlyToAsyncStorageDialog,
    };
};
