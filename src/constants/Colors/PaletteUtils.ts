import { NUMBER_OF_RATINGS } from '../Config';
import chroma from 'chroma-js';




export function adjustPaletteSize(colors: string[], targetCount: number = NUMBER_OF_RATINGS): string[] {
    if (colors.length === targetCount) {
        return colors;
    }

    if (colors.length < targetCount) {
        const grey = '#555555';
        const missing = targetCount - colors.length;
        const frontCount = Math.ceil(missing / 2);
        const endCount = missing - frontCount;

        // Insère le gris juste après la première couleur (frontCount fois)
        // puis juste avant la dernière couleur (endCount fois)
        const first = colors[0];
        const last = colors[colors.length - 1];
        const middle = colors.slice(1, colors.length - 1);

        const frontGreys = Array(frontCount).fill(grey);
        const endGreys = Array(endCount).fill(grey);

        return [first, ...frontGreys, ...middle, ...endGreys, last];
    }

    return colors.slice(colors.length - targetCount);
}


export function isValidHexColor(color: string): boolean {
    return /^#[0-9A-F]{6}$/i.test(color);
}


export function getTextColor(backgroundColor: string): string {
    try {
        const lum = chroma(backgroundColor).luminance();
        return lum > 0.45
            ? chroma(backgroundColor).darken(4).hex()
            : chroma(backgroundColor).brighten(2.5).hex();
    } catch {
        return '#000000';
    }
}


export function getSecondaryTextColor(backgroundColor: string): string {
    try {
        const lum = chroma(backgroundColor).luminance();
        return lum > 0.45
            ? chroma(backgroundColor).darken(2.5).hex()
            : chroma(backgroundColor).brighten(4).hex();
    } catch {
        return '#666666';
    }
}