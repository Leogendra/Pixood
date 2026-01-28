export const MIN_TAG_LENGTH = 3;
export const MAX_TAG_LENGTH = 30;

export const NUMBER_OF_RATINGS = 7;
export const MAX_TAGS = 100;
export const STATISTIC_MIN_LOGS = 1;

export const DATE_FORMAT = "YYYY-MM-DD";

export const TAG_COLOR_NAMES = [
    "slate",
    "red",
    "orange",
    "amber",
    "yellow",
    "lime",
    "green",
    "emerald",
    "teal",
    "cyan",
    "sky",
    "blue",
    "indigo",
    "violet",
    "purple",
    "fuchsia",
    "pink",
    "rose",
];


export interface ColorPalettePreset {
    id: string;
    name: string;
    colors: Array<string>;
}


export const COLOR_PALETTE_PRESETS: ColorPalettePreset[] = [
    {
        id: "1",
        name: "Default",
        colors: ["#E22230", "#E28422", "#FBEE45", "#A0E865", "#039D07"]
    },
    {
        id: "2",
        name: "Reverted",
        colors: ["#06f8ae", "#97fadd", "#f2ffe5", "#fdd689", "#fd9f09"]
    },
    {
        id: "3",
        name: "Ocean",
        colors: ["#034efc", "#0ab3fc", "#3de5fc", "#0af7d4", "#02fa9a"]
    },
    {
        id: "4",
        name: "Sunset",
        colors: ["#3a86ff", "#5be0ff", "#fffd82", "#ff9a5b", "#ff3e7e"]
    },
    {
        id: "5",
        name: "unknown",
        colors: ["#8c510a", "#d8b365", "#f6e8c3", "#5ab4ac", "#01665e"]
    },
    {
        id: "6",
        name: "YIP",
        colors: ["#7a59c1", "#576fc1", "#00bcd4", "#94cb6a", "#55b253"]
    },
    {
        id: "7",
        name: "unknown",
        colors: ["#252f38", "#597285", "#e8f1ee", "#fdcd0f", "#fa8702"]
    }
];