import { LogEntry, SLEEP_QUALITY_MAPPING } from "@/hooks/useLogs";
import { Pressable, View, ViewStyle } from "react-native";
import useHaptics from "@/hooks/useHaptics";
import { useTheme } from "@/hooks/useTheme";
import useColors from "@/hooks/useColors";




export const SlideSleepButton = ({
    value,
    selected,
    onPress,
    style = {},
}: {
    value: number | 'very_good' | 'good' | 'neutral' | 'bad' | 'very_bad';
    selected?: boolean;
    onPress?: () => void;
    style?: ViewStyle;
}) => {
    const colors = useColors();
    const theme = useTheme();
    const haptics = useHaptics();

    const _value = typeof value === 'number' ? value : SLEEP_QUALITY_MAPPING[value];

    const HEIGHT = 32;

    return (
        <View
            style={{
                flex: 5,
                ...style,
            }}
        >
            <Pressable
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: colors.logCardBackground,
                    borderColor: selected ? colors.tint : theme === 'light' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)',
                    borderWidth: selected ? 2 : 1,
                    borderRadius: 8,
                    paddingLeft: selected ? 7 : 8,
                    paddingRight: selected ? 7 : 8,
                    paddingVertical: 16,
                    height: HEIGHT + 32,
                    margin: 4,
                    aspectRatio: 1,
                }}
                onPress={() => {
                    if (!onPress) return;
                    haptics.selection();
                    onPress?.();
                }}
            >
                <View
                    style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: HEIGHT,
                        width: 16,
                        borderRadius: 8,
                        overflow: 'hidden',
                    }}
                >
                    <View
                        style={{
                            width: 16,
                            height: HEIGHT,
                            backgroundColor: colors.sleepQualityEmpty,
                            position: 'absolute',
                            bottom: 0,
                            zIndex: 1,
                        }} />
                    <View
                        style={{
                            width: 16,
                            height: _value * 8,
                            backgroundColor: colors.sleepQualityFull,
                            position: 'absolute',
                            bottom: 0,
                            zIndex: 1,
                        }} />
                </View>
            </Pressable>
        </View>
    );
};
