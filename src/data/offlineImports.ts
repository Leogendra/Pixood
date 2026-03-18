import { LogEntryImport, LogEntrySchema } from '@/types/logFormat';
import { NUMBER_OF_RATINGS } from '@/constants/Config';
import { INITIAL_STATE } from '@/hooks/useSettings';
import { ImportData } from '@/helpers/Import';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';


export interface OfflineImportUser {
    id: string;
    importData: ImportData;
}


const baseSettings = {
    palettePresetId: INITIAL_STATE.palettePresetId,
    customPalette: INITIAL_STATE.customPalette,
    theme: INITIAL_STATE.theme,
    reminderEnabled: INITIAL_STATE.reminderEnabled,
    reminderTime: INITIAL_STATE.reminderTime,
    actionsDone: [],
    steps: INITIAL_STATE.steps,
};


export function generateOfflineUser(nbDays: number, userId = 'demo-user'): OfflineImportUser {
    const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));
    const days = Math.floor(nbDays);

    const WORDS = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.".split(' ');
    const TAG_GROUPS = [
        { category: 'Work', tags: ['Project', 'Meeting', 'Deep Work', 'Planning'] },
        { category: 'Emotions', tags: ['Happy', 'Sad', 'Anxious', 'Excited', 'Tired'] },
        { category: 'Activities', tags: ['Family', 'Friends', 'Reading', 'Cooking', 'Music'] },
    ];

    const RATINGS = Array.from({ length: NUMBER_OF_RATINGS }, (_, i) => i + 1);

    const randInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
    const pickN = <T,>(arr: T[], n: number) => {
        const copy = [...arr];
        const result: T[] = [];
        const take = clamp(n, 0, copy.length);
        for (let i = 0; i < take; i++) {
            const idx = randInt(0, copy.length - 1);
            result.push(copy[idx]);
            copy.splice(idx, 1);
        }
        return result;
    };
    
    const randomWords = (minWords = 1, maxWords = 100) => {
        const words = randInt(minWords, maxWords);
        const chosen = Array.from({ length: words }, () => WORDS[randInt(0, WORDS.length - 1)]);
        const sentence = chosen.join(' ');
        const capitalized = sentence.charAt(0).toUpperCase() + sentence.slice(1);
        return capitalized + '.';
    };

    const items: LogEntryImport[] = [];
    for (let i = 0; i < days; i++) {
        const d = dayjs().subtract(i, 'day');
        const hour = randInt(7, 22);
        const minute = randInt(0, 59);
        const dt = d.hour(hour).minute(minute).second(0).millisecond(0).toISOString();
        const rating = RATINGS[randInt(0, RATINGS.length - 1)];

        const pickedGroups = pickN(TAG_GROUPS, randInt(1, Math.min(3, TAG_GROUPS.length))).map((group) => {
            const maxTagCount = Math.min(3, group.tags.length);
            return {
                category: group.category,
                tags: pickN(group.tags, randInt(1, maxTagCount)),
            };
        });

        const item = LogEntrySchema.parse({
            id: uuidv4(),
            date: d.format('YYYY-MM-DD'),
            dateTime: dt,
            rating: [rating],
            notes: randomWords(1, 100),
            metrics: {},
            tags: pickedGroups,
        });

        items.push(item);
    }

    const importData: ImportData = {
        version: '2.0.0',
        items,
        settings: { ...baseSettings },
    };

    return { id: userId, importData };
}


export const OFFLINE_IMPORT_USERS: OfflineImportUser[] = [
    {
        id: 'clean-user-data',
        importData: {
            version: '2.0.0',
            items: [],
            settings: { ...baseSettings },
        },
    }
];


for (let days of [7, 30, 180, 365, 3000]) {
    OFFLINE_IMPORT_USERS.push(generateOfflineUser(days, `demo-user-${days}-days`));
}