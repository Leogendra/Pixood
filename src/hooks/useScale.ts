import { adjustPaletteSizeInterpolate } from '@/constants/Colors/PaletteUtils';
import { NUMBER_OF_RATINGS, COLOR_PALETTE_PRESETS } from '@/constants/Config';
import { getCustomScale } from '@/constants/Colors/Scales';
import { IScale } from '@/constants/Colors/Scales';
import { useSettings } from "./useSettings";
import { useTheme } from "./useTheme";
import useColors from "./useColors";




export default function useScale() {
    const colors = useColors();
    const { settings } = useSettings();
    const theme = useTheme();

    let scale: IScale;

    if (settings.customPalette) {
        scale = getCustomScale(settings.customPalette, theme);
    }
    else if (settings.palettePresetId) {
        scale = colors.scales[settings.palettePresetId];
    }
    else {
        const defaultPalette = adjustPaletteSizeInterpolate(COLOR_PALETTE_PRESETS[0].colors);
        scale = getCustomScale(defaultPalette, theme);
    }

    return {
        colors: scale,
        labels: Array.from({ length: NUMBER_OF_RATINGS }, (_, i) => NUMBER_OF_RATINGS - i)
    }
}
