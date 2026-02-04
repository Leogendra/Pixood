import { Pressable, Text, View, ViewStyle } from "react-native";
import { TAG_COLOR_NAMES } from "@/constants/Config";
import { useSettings } from "@/hooks/useSettings";
import { useTheme } from "@/hooks/useTheme";
import useHaptics from "@/hooks/useHaptics";
import useColors from "@/hooks/useColors";

export default function Tag({
    title,
    selected = false,
    colorName,
    onPress,
    style = {},
}: {
    title: string,
    selected?: boolean,
    colorName: typeof TAG_COLOR_NAMES[number],
    onPress?: () => void,
    style?: ViewStyle
}) {
    const colors = useColors();
    const haptics = useHaptics();
    const theme = useTheme();
    const { settings } = useSettings();

    return (
        <Pressable
            style={({ pressed }) => ({
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
                borderRadius: 100,
                marginRight: 8,
                marginBottom: 8,
                backgroundColor: selected ? colors.tagBackgroundActive : colors.tagBackground,
                borderColor: selected ? colors.tint : theme === 'light' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)',
                borderWidth: 1,
                paddingHorizontal: 16,
                paddingVertical: 8,
                opacity: pressed && onPress ? 0.8 : 1,
                ...style,
            })}
            onPress={async () => {
                if (!onPress) return;
                await haptics.selection();
                onPress?.();
            }}
        >
            <Text style={{
                color: selected ? colors.tagTextActive : colors.tagText,
                fontSize: 17,
            }}>{title}</Text>
        </Pressable>
    )
}