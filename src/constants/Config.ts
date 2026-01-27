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
    colors: [string, string, string, string, string];
}

// The system will interpolate between the main three to create NUMBER_OF_RATINGS colors
export const COLOR_PALETTE_PRESETS: ColorPalettePreset[] = [
    {
        id: "1",
        name: "Default",
        colors: ["#E22230", "#E28422", "#FBEE45", "#A0E865", "#039D07"]
    },
    {
        id: "2",
        name: "Reverted",
        colors: ["#06f8ae", "#97fadd", "#ffffff", "#fdd689", "#fd9f09"]
    },
    {
        id: "4",
        name: "Rainbow",
        colors: ["#ff0080", "#ff8c00", "#ffe600", "#8cff00", "#00ffe1"]
    },
    {
        id: "5",
        name: "Ocean",
        colors: ["#034efc", "#0ab3fc", "#3de5fc", "#0af7d4", "#02fa9a"]
    },
    {
        id: "6",
        name: "Sunset",
        colors: ["#ff3e7e", "#ff9a5b", "#fffd82", "#5be0ff", "#3a86ff"]
    }
];