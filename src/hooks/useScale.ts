import { IScale } from '@/constants/Colors/Scales';
import { NUMBER_OF_RATINGS } from '@/constants/Config';
import useColors from "./useColors";
import { SettingsState, useSettings } from "./useSettings";

export default function useScale(
    type?: SettingsState['scaleType']
) {
    const colors = useColors()
    const { settings } = useSettings()

    const _type = type || settings.scaleType

    // Simply return the scale from colors which already has numeric indices
    return {
        colors: colors.scales[_type],
        labels: Array.from({ length: NUMBER_OF_RATINGS }, (_, i) => NUMBER_OF_RATINGS - i)
    }
}
