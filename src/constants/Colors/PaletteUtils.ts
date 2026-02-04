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
        
        const first = colors[0];
        const last = colors[colors.length - 1];
        const middle = colors.slice(1, colors.length - 1);
        
        const frontGreys = Array(frontCount).fill(grey);
        const endGreys = Array(endCount).fill(grey);
        
        return [first, ...frontGreys, ...middle, ...endGreys, last];
    }
    
    return colors.slice(colors.length - targetCount);
}


export function adjustPaletteSizeInterpolate(colors: string[], targetCount: number = NUMBER_OF_RATINGS): string[] {
    if (colors.length === targetCount) {
        return colors;
    }
    
    if (colors.length < targetCount) {
        const missing = targetCount - colors.length;
        const frontCount = Math.ceil(missing / 2);
        const endCount = missing - frontCount;
        
        const first = colors[0];
        const last = colors[colors.length - 1];
        const middle = colors.slice(1, colors.length - 1);
        
        const frontInterpolated: string[] = [];
        if (frontCount > 0 && colors.length > 1) {
            const scale = chroma.scale([colors[0], colors[1]]).mode('lch');
            for (let i = 1; i <= frontCount; i++) {
                const t = i / (frontCount + 1);
                frontInterpolated.push(scale(t).hex());
            }
        }
        
        const endInterpolated: string[] = [];
        if (endCount > 0 && colors.length > 1) {
            const scale = chroma.scale([colors[colors.length - 2], colors[colors.length - 1]]).mode('lch');
            for (let i = 1; i <= endCount; i++) {
                const t = i / (endCount + 1);
                endInterpolated.push(scale(t).hex());
            }
        }
        
        return [first, ...frontInterpolated, ...middle, ...endInterpolated, last];
    }
    
    return colors.slice(colors.length - targetCount);
}


export function normalizeColor(value: string): string {
    let hexColor = value.startsWith('#') ? value : `#${value}`;
    hexColor = hexColor.toUpperCase();
    let normalizedColor: string;

    if (/^#[0-9A-F]{6}$/i.test(hexColor)) {
        normalizedColor = hexColor;
    }
    else if (/^#[0-9A-F]{3}$/i.test(hexColor)) {
        const r = hexColor[1];
        const g = hexColor[2];
        const b = hexColor[3];
        normalizedColor = `#${r}${r}${g}${g}${b}${b}`;
    }
    else if (/^#[0-9A-F]{8}$/i.test(hexColor)) {
        normalizedColor = hexColor.slice(0, 7); // Keep only #RRGGBB
    }
    else {
        return "";
    }
    return normalizedColor;
};


export function getTextColor(backgroundColor: string): string {
    try {
        const lum = chroma(backgroundColor).luminance();
        return lum > 0.45
            ? chroma(backgroundColor).darken(4).hex()
            : chroma(backgroundColor).brighten(2.5).hex();
    } 
    catch {
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