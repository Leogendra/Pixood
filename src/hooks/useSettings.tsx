import { adjustPaletteSizeInterpolate } from "@/constants/Colors/PaletteUtils";
import { LoggerStep, STEP_OPTIONS } from "@/components/Logger/config";
import { STORAGE_KEY, COLOR_PALETTE_PRESETS } from "@/constants/Config";
import { load, store } from "@/helpers/storage";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import _ from "lodash";
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState
} from "react";




// ATTENTION: If you change the settings state, you need to update
// the export variables also in the DataGate
export interface SettingsState {
    loaded: boolean;
    deviceId: string | null;
    palettePresetId: string | null; // null means custom palette
    customPalette: string[] | null;
    theme: 'light' | 'dark' | 'system';
    reminderEnabled: Boolean;
    reminderTime: string;
    actionsDone: IAction[];
    steps: LoggerStep[];
}


export type ExportSettings = Omit<SettingsState, 'loaded' | 'deviceId'>;

interface IAction {
    title: string;
    date: string;
}


const defaultPreset = COLOR_PALETTE_PRESETS[0];
const defaultPalette = adjustPaletteSizeInterpolate(defaultPreset.colors);

export const INITIAL_STATE: SettingsState = {
    loaded: false,
    deviceId: null,
    palettePresetId: defaultPreset.id,
    customPalette: defaultPalette,
    theme: 'system', // Default to system theme
    reminderEnabled: false,
    reminderTime: "18:00",
    actionsDone: [],
    steps: [
        "rating",
        "sleep",
        "tags",
        "message"
    ],
};


type SettingsContextType = {
    settings: SettingsState;
    setSettings: (
        settings: SettingsState | ((settings: SettingsState) => SettingsState)
    ) => void;
    resetSettings: () => void;
    importSettings: (settings: ExportSettings) => void;
    addActionDone: (action: IAction["title"]) => void;
    hasActionDone: (actionTitle: IAction["title"]) => boolean;
    removeActionDone: (actionTitle: IAction["title"]) => void;
    toggleStep: (step: LoggerStep, value?: Boolean) => void;
    hasStep: (step: LoggerStep) => boolean;
}

const SettingsStateContext = createContext({} as SettingsContextType);

function SettingsProvider({ children }: { children: React.ReactNode }) {

    const [settings, setSettings] = useState<SettingsState>(INITIAL_STATE);

    const resetSettings = useCallback(() => {
        setSettings({
            ...INITIAL_STATE,
            deviceId: uuidv4(),
            loaded: true,
        });
    }, [INITIAL_STATE]);

    const importSettings = useCallback((settings: SettingsState) => {
        setSettings({
            ...INITIAL_STATE,
            ...settings,
            loaded: true,
        });
    }, [INITIAL_STATE]);

    useEffect(() => {
        (async () => {
            const json = await load<SettingsState>(STORAGE_KEY);
            if (json !== null) {
                if (!json.deviceId) {
                    json.deviceId = uuidv4();
                }
                setSettings({
                    ...INITIAL_STATE,
                    ...json,
                    loaded: true,
                });
            } else {
                setSettings({
                    ...INITIAL_STATE,
                    deviceId: uuidv4(),
                    loaded: true,
                });
            }
        })();
    }, []);

    useEffect(() => {
        if (settings.loaded) {
            store(STORAGE_KEY, _.omit(settings, 'loaded'));
        }
    }, [JSON.stringify(settings)]);

    const addActionDone = useCallback((actionTitle: IAction["title"]) => {
        if (hasActionDone(actionTitle)) {
            return;
        }

        setSettings((settings) => ({
            ...settings,
            actionsDone: [
                ...settings.actionsDone,
                {
                    title: actionTitle,
                    date: new Date().toISOString(),
                },
            ],
        }));
    }, [settings.actionsDone]);

    const removeActionDone = useCallback((actionTitle: IAction["title"]) => {
        setSettings((settings) => ({
            ...settings,
            actionsDone: settings.actionsDone.filter(
                (action) => action.title !== actionTitle
            ),
        }));
    }, [settings.actionsDone]);

    const hasActionDone = useCallback(
        (actionTitle: IAction["title"]) => {
            return settings.actionsDone.some(
                (action) => action.title === actionTitle
            );
        },
        [settings.actionsDone]
    );

    const toggleStep = useCallback((step: LoggerStep, value: Boolean) => {
        setSettings((settings) => {
            const shouldAdd = _.isBoolean(value) ? value : !settings.steps.includes(step);

            if (!STEP_OPTIONS.includes(step)) {
                throw new Error(`Step ${step} is not a valid step`);
            }

            if (shouldAdd) {
                return {
                    ...settings,
                    steps: _.uniq([...settings.steps, step]),
                };
            } else {
                return {
                    ...settings,
                    steps: settings.steps.filter((s) => s !== step),
                };
            }
        });
    }, []);

    const hasStep = useCallback((step: LoggerStep) => {
        return settings.steps.includes(step);
    }, [settings.steps]);

    const value = {
        settings,
        setSettings,
        resetSettings,
        importSettings,
        addActionDone,
        hasActionDone,
        removeActionDone,
        toggleStep,
        hasStep,
    };

    return (
        <SettingsStateContext.Provider value={value}>
            {children}
        </SettingsStateContext.Provider>
    );
}


function useSettings(): SettingsContextType {
    const context = useContext(SettingsStateContext);
    if (context === undefined) {
        throw new Error("useSettings must be used within a SettingsProvider");
    }
    return context;
}

export { SettingsProvider, useSettings };
