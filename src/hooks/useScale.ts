import { adjustPaletteSize } from '@/constants/Colors/PaletteUtils';
import { NUMBER_OF_RATINGS, COLOR_PALETTE_PRESETS } from '@/constants/Config';
import { getCustomScale } from '@/constants/Colors/Scales';
import { IScale } from '@/constants/Colors/Scales';
import { useColorScheme } from 'react-native';
import { useSettings } from "./useSettings";
import useColors from "./useColors";




export default function useScale() {
    const colors = useColors();
    const { settings } = useSettings();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    let scale: IScale;

    if (settings.customPalette) {
        scale = getCustomScale(settings.customPalette, isDark);
    }
    else if (settings.palettePresetId) {
        scale = colors.scales[settings.palettePresetId];
    }
    else {
        const defaultPreset = COLOR_PALETTE_PRESETS[0];
        const defaultPalette = adjustPaletteSize(defaultPreset.colors);
        scale = getCustomScale(defaultPalette, isDark);
    }

    return {
        colors: scale,
        labels: Array.from({ length: NUMBER_OF_RATINGS }, (_, i) => NUMBER_OF_RATINGS - i)
    }
}
