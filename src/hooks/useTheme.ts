import { useColorScheme } from 'react-native';
import { useSettings } from './useSettings';




export function useTheme(): 'light' | 'dark' {
    const { settings } = useSettings();
    const systemColorScheme = useColorScheme();

    if (settings.theme === 'system') {
        return systemColorScheme === 'dark' ? 'dark' : 'light';
    }

    return settings.theme;
}
