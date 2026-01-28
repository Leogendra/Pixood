import { adjustPaletteSizeInterpolate, getTextColor, getSecondaryTextColor } from './PaletteUtils';
import { COLOR_PALETTE_PRESETS, NUMBER_OF_RATINGS } from '../Config';
import colors from './TailwindColors';
import chroma from 'chroma-js';




interface IScaleMood {
    background: string;
    text: string;
    textSecondary: string;
}

export interface IScale {
    [key: number]: IScaleMood;
    empty: { background: string; border: string; text: string; };
}

export type IScaleColors = {
    [key: string]: IScale;
};

const getScaleMood = (color: string): IScaleMood => {
    return {
        background: color,
        text: getTextColor(color),
        textSecondary: getSecondaryTextColor(color),
    };
}


const getScaleFromPalette = (palette: string[], emptyColor: string): IScale => {
    const adjustedPalette = adjustPaletteSizeInterpolate(palette, NUMBER_OF_RATINGS);

    const scale: IScale = {
        empty: {
            background: emptyColor,
            border: chroma(emptyColor).luminance() > 0.5 ? chroma(emptyColor).darken(0.5).hex() : chroma(emptyColor).brighten(1.5).hex(),
            text: chroma(emptyColor).luminance() > 0.5 ? chroma(emptyColor).darken(3).hex() : chroma(emptyColor).brighten(4).hex(),
        },
    };

    adjustedPalette.forEach((color, idx) => {
        const rating = idx + 1; // 1-n rating keys
        scale[rating] = getScaleMood(color);
    });

    return scale;
};


const generatePresetsScales = (emptyColorLight: string, emptyColorDark: string) => {
    const light: IScaleColors = {};
    const dark: IScaleColors = {};

    COLOR_PALETTE_PRESETS.forEach(preset => {
        const palette = adjustPaletteSizeInterpolate(preset.colors);
        light[preset.id] = getScaleFromPalette(palette, emptyColorLight);
        dark[preset.id] = getScaleFromPalette(palette, emptyColorDark);
    });

    return { light, dark };
};

const { light, dark } = generatePresetsScales(colors.neutral[100], colors.neutral[800]);

export default {
    dark,
    light,
};

// Export helper for custom palettes
export function getCustomScale(palette: string[], isDark: boolean): IScale {
    const emptyColor = isDark ? colors.neutral[800] : colors.neutral[100];
    return getScaleFromPalette(palette, emptyColor);
}