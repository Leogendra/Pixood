import { load, store } from "@/helpers/storage";
import { LogEntry } from "@/types/logFormat";
import { Buffer } from "buffer";
import dayjs from "dayjs";
import _ from "lodash";
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useReducer,
} from "react";
import { v4 as uuidv4 } from "uuid";

export { LogEntry };


export const STORAGE_KEY = "PIXEL_TRACKER_LOGS";

// Deprecated - kept for migration compatibility
export const RATING_MAPPING = {
    extremely_good: 6,
    very_good: 5,
    good: 4,
    neutral: 3,
    bad: 2,
    very_bad: 1,
    extremely_bad: 0,
};

export const SLEEP_QUALITY_MAPPING = {
    very_good: 4,
    good: 3,
    neutral: 2,
    bad: 1,
    very_bad: 0,
};

// Deprecated - Use NUMBER_OF_RATINGS from Config instead
export const RATING_KEYS = Object.keys(
    RATING_MAPPING
) as (keyof typeof RATING_MAPPING)[];
export const SLEEP_QUALITY_KEYS = Object.keys(
    SLEEP_QUALITY_MAPPING
) as (keyof typeof SLEEP_QUALITY_MAPPING)[];

// New: Generate array of rating values dynamically
import { NUMBER_OF_RATINGS } from "@/constants/Config";
export const RATING_VALUES = Array.from({ length: NUMBER_OF_RATINGS }, (_, i) => i + 1);


export interface LogDay {
    date: string;
    items: LogEntry[];
    ratingAvg: number;
    metricsAvg: Record<string, number>;
    sleepQualityAvg: number | null;
}

export interface LogsState {
    loaded?: boolean;
    items: LogEntry[];
}

type LogAction =
    | { type: "import"; payload: LogsState }
    | { type: "add"; payload: LogEntry }
    | { type: "edit"; payload: { id: string; data: Partial<LogEntry> } }
    | { type: "batchEdit"; payload: LogEntry[] }
    | { type: "delete"; payload: string }
    | { type: "reset"; payload: LogsState };

export interface UpdaterValue {
    addLog: (item: LogEntry) => void;
    editLog: (id: string, item: Partial<LogEntry>) => void;
    updateLogs: (items: LogsState["items"]) => void;
    deleteLog: (id: string) => void;
    reset: () => void;
    import: (data: LogsState) => void;
}

interface StateValue extends LogsState { }

const LogStateContext = createContext<StateValue>(undefined as any);
const LogUpdaterContext = createContext<UpdaterValue>(undefined as any);

function reducer(state: LogsState, action: LogAction): LogsState {
    switch (action.type) {
        case "import":
            return migrate({
                ...(action.payload as LogsState),
                loaded: true,
            });
        case "add":
            return {
                ...state,
                items: [...state.items, action.payload],
            };
        case "edit":
            return {
                ...state,
                items: state.items.map((item) => {
                    if (item.id === action.payload.id) {
                        return {
                            ...item,
                            ...action.payload.data,
                        };
                    }
                    return item;
                }),
            };
        case "batchEdit":
            state.items = action.payload;
            return {
                ...state,
            };
        case "delete":
            return {
                ...state,
                items: state.items.filter((item) => item.id !== action.payload),
            };
        case "reset":
            return {
                ...action.payload,
                loaded: true,
            };
    }
}

const migrate = (data: LogsState): LogsState => {
    let result = {
        ...data,
    };

    if (!_.isArray(data.items)) {
        result.items = Object.values(result.items);
    }

    result.items = result.items.map((item) => {
        const newItem = { ...item };

        // Migrate old dateTime fields
        if (!newItem.dateTime && (item as any).date) {
            newItem.dateTime = dayjs((item as any).date).toISOString();
        }
        if (!newItem.dateTime && (item as any).createdAt) {
            newItem.dateTime = dayjs((item as any).createdAt).toISOString();
        }
        
        // Ensure defaults
        if (!newItem.dateTime) newItem.dateTime = dayjs().toISOString();
        if (!newItem.notes) newItem.notes = "";
        if (!newItem.rating || !Array.isArray(newItem.rating)) newItem.rating = [3]; // neutral
        if (!newItem.tags) newItem.tags = [];
        
        // Migrate old tag structure (id -> tagId)
        if (newItem.tags && Array.isArray(newItem.tags)) {
            newItem.tags = newItem.tags.map((tag: any) => ({
                tagId: tag.tagId || tag.id
            }));
        }

        return newItem as LogEntry;
    });

    return result;
};

function LogsProvider({ children }: { children: React.ReactNode }) {
    const INITIAL_STATE: LogsState = {
        loaded: false,
        items: [],
    };

    const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

    useEffect(() => {
        (async () => {
            try {
                const value = await load<LogsState>(STORAGE_KEY);
                const size = Buffer.byteLength(JSON.stringify(value));
                const megaBytes = Math.round((size / 1024 / 1024) * 100) / 100;
                if (value !== null) {
                    dispatch({
                        type: "import",
                        payload: value,
                    });
                } else {
                    dispatch({
                        type: "import",
                        payload: {
                            ...INITIAL_STATE,
                        },
                    });
                }
            } catch (error) {
                // Sentry.Native.captureException(error); // Removed Sentry usage
            }
        })();
    }, []);

    useEffect(() => {
        if (state.loaded) {
            store<Omit<LogsState, "loaded">>(STORAGE_KEY, _.omit(state, "loaded"));
        }
    }, [JSON.stringify(state)]);

    const importState = useCallback((data: LogsState) => {
        dispatch({
            type: "import",
            payload: data,
        });
    }, []);

    const addLog = useCallback(
        (payload: LogEntry) => dispatch({ type: "add", payload }),
        []
    );
    const editLog = useCallback(
        (id: string, data: Partial<LogEntry>) => dispatch({ type: "edit", payload: { id, data } }),
        []
    );
    const updateLogs = useCallback(
        (items: LogsState["items"]) =>
            dispatch({ type: "batchEdit", payload: items }),
        []
    );
    const deleteLog = useCallback(
        (id: string) => dispatch({ type: "delete", payload: id }),
        []
    );
    const reset = useCallback(
        () => dispatch({ type: "reset", payload: INITIAL_STATE }),
        []
    );

    const updaterValue: UpdaterValue = useMemo(
        () => ({
            addLog,
            editLog,
            updateLogs,
            deleteLog,
            reset,
            import: importState,
        }),
        [addLog, editLog, updateLogs, deleteLog, reset, importState]
    );

    const stateValue: StateValue = useMemo(
        () => ({
            ...state,
        }),
        [JSON.stringify(state)]
    );

    return (
        <LogStateContext.Provider value={stateValue}>
            <LogUpdaterContext.Provider value={updaterValue}>
                {children}
            </LogUpdaterContext.Provider>
        </LogStateContext.Provider>
    );
}

function useLogState(): StateValue {
    const context = useContext(LogStateContext);
    if (context === undefined) {
        throw new Error("useLogState must be used within a LogsProvider");
    }
    return context;
}

function useLogUpdater(): UpdaterValue {
    const context = useContext(LogUpdaterContext);
    if (context === undefined) {
        throw new Error("useLogUpdater must be used within a LogsProvider");
    }
    return context;
}

export { LogsProvider, useLogState, useLogUpdater };
