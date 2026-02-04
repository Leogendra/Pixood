import dayjs from 'dayjs';
import { ImportData } from '@/helpers/Import';
import { INITIAL_STATE } from '@/hooks/useSettings';
import { v4 as uuidv4 } from 'uuid';

export interface OfflineImportUser {
    id: string;
    importData: ImportData;
}

const baseSettings = {
    palettePresetId: INITIAL_STATE.palettePresetId,
    customPalette: INITIAL_STATE.customPalette,
    reminderEnabled: INITIAL_STATE.reminderEnabled,
    reminderTime: INITIAL_STATE.reminderTime,
    actionsDone: [],
    steps: INITIAL_STATE.steps,
};


export function generateOfflineUser(nbDays: number, userId = 'demo-user'): OfflineImportUser {
    const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));
    const days = Math.floor(nbDays);

    const WORDS = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.".split(' ');
    const TAGS = [
        { id: 't-01', title: 'Work', color: 'blue' },
        { id: 't-02', title: 'Sport', color: 'green' },
        { id: 't-03', title: 'Family', color: 'purple' },
        { id: 't-04', title: 'Friends', color: 'teal' },
        { id: 't-05', title: 'Health', color: 'red' },
        { id: 't-06', title: 'Leisure', color: 'orange' },
        { id: 't-07', title: 'Reading', color: 'indigo' },
        { id: 't-08', title: 'Music', color: 'pink' },
        { id: 't-09', title: 'Cooking', color: 'yellow' },
        { id: 't-10', title: 'Project', color: 'cyan' },
        { id: 't-11', title: 'Walk', color: 'emerald' },
        { id: 't-12', title: 'Meditation', color: 'lime' },
    ];

    const RATINGS: Array<"extremely_good" | "very_good" | "good" | "neutral" | "bad" | "very_bad" | "extremely_bad"> = [
        'extremely_good', 'very_good', 'good', 'neutral', 'bad', 'very_bad', 'extremely_bad'
    ];
    const RATING_TO_NUMBER: Record<string, number> = {
        'extremely_good': 6,
        'very_good': 5,
        'good': 4,
        'neutral': 3,
        'bad': 2,
        'very_bad': 1,
        'extremely_bad': 0,
    };

    const randInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
    const uuid = () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
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

    const items: ImportData['items'] = [];
    for (let i = 0; i < days; i++) {
        const d = dayjs().subtract(i, 'day');
        const hour = randInt(7, 22);
        const minute = randInt(0, 59);
        const dt = d.hour(hour).minute(minute).second(0).millisecond(0).toISOString();
        const tagRefs = pickN(TAGS, randInt(1, Math.min(10, TAGS.length))).map(t => ({ tagId: t.id }));
        const ratingStr = RATINGS[randInt(0, RATINGS.length - 1)];

        items.push({
            id: uuidv4(),
            date: d.format('YYYY-MM-DD'),
            dateTime: dt,
            rating: [RATING_TO_NUMBER[ratingStr]],
            notes: randomWords(1, 100),
            metrics: {},
            tags: tagRefs,
        });
    }

    const importData: ImportData = {
        version: '1.0.0',
        items,
        tags: TAGS,
        settings: { ...baseSettings },
    };

    return { id: userId, importData };
}


export const OFFLINE_IMPORT_USERS: OfflineImportUser[] = [
    {
        id: 'clean-user-data',
        importData: {
            version: '1.0.0',
            items: [],
            tags: [],
            settings: { ...baseSettings },
        },
    }
];

for (let days of [7, 30, 180, 365, 3000]) {
    OFFLINE_IMPORT_USERS.push(generateOfflineUser(days, `demo-user-${days}-days`));
}