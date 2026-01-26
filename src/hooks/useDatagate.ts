import AsyncStorage from "@react-native-async-storage/async-storage";
import dayjs from "dayjs";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { Alert, Platform } from "react-native";
import { getJSONSchemaType, ImportData } from "@/helpers/Import";
import { migrateImportData } from "@/helpers/migration";
import { askToImport, askToReset, showImportError, showImportSuccess, showResetSuccess } from "@/helpers/prompts";
import { t } from "@/helpers/translation";
import { LogsState, STORAGE_KEY as STORAGE_KEY_LOGS, useLogState, useLogUpdater } from "./useLogs";
import { ExportSettings, STORAGE_KEY as STORAGE_KEY_SETTINGS, useSettings } from "./useSettings";
import { STORAGE_KEY as STORAGE_KEY_TAGS, Tag, useTagsState, useTagsUpdater } from "./useTags";

type ResetType = "factory" | "data"

// Simplified export format builder using current in-memory state
const transformToExportFormat = (items: LogsState["items"], tags: Tag[], settings: ExportSettings) => ({
    items,
    tags,
    settings,
});


export const useDatagate = (): {
    openExportDialog: () => Promise<void>;
    openImportDialog: () => Promise<void>;
    import: (data: ImportData, options: { muted: boolean }) => Promise<void>;
    openDangerousImportDirectlyToAsyncStorageDialog: () => Promise<void>;
    openResetDialog: (type: ResetType) => Promise<void>;
} => {
    const logState = useLogState();
    const logUpdater = useLogUpdater();
    const { tags } = useTagsState();
    const tagsUpdater = useTagsUpdater();
    const { resetSettings, importSettings, settings } = useSettings();


    const dangerouslyImportDirectlyToAsyncStorage = async (data: ImportData) => {
        await AsyncStorage.multiRemove([
            STORAGE_KEY_TAGS,
            STORAGE_KEY_LOGS,
            STORAGE_KEY_SETTINGS,
        ]);

        await AsyncStorage.setItem(
            STORAGE_KEY_LOGS,
            JSON.stringify({
                items: data.items,
            })
        );

        await AsyncStorage.setItem(
            STORAGE_KEY_SETTINGS,
            JSON.stringify({
                ...data.settings,
                actionsDone: [{
                    date: new Date().toISOString(),
                    title: 'onboarding',
                }],
                tags: data.tags ?? [],
            })
        );
    };

    const _import = async (data: ImportData, options: { muted: boolean } = { muted: false }) => {
        const migratedData = migrateImportData(data);
        const jsonSchemaType = getJSONSchemaType(migratedData);

        if (jsonSchemaType === "pixy") {
            logUpdater.import({
                items: migratedData.items,
            });
            tagsUpdater.import({
                tags: migratedData.tags || []
            });
            importSettings(migratedData.settings);
            if (!options.muted) showImportSuccess()
        } 
    else {
            console.log('import failed, json schema:', jsonSchemaType);
            if (!options.muted) showImportError()
        }
    };

    const reset = () => {
        logUpdater.reset();
        tagsUpdater.reset();
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
        const data = transformToExportFormat(logState.items, tags, settings);


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
